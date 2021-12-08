// Copyright 2017-2021 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { ApiPromise } from '@polkadot/api/promise';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { WsProvider } from '@polkadot/rpc-provider';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import { keyring } from '@polkadot/ui-keyring';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import { formatBalance, isTestChain } from '@polkadot/util';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';
import type BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ApiProps, ApiState } from './types';
import { ApiContext } from './ApiContext';
import { registry } from './typeRegistry';
import { options } from '@acala-network/api';

interface Props {
  children: React.ReactNode;
  endpoints?: string[];
  store?: KeyringStore;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    name: string;
    source: string;
    whenCreated: number;
  };
}

interface ChainData {
  injectedAccounts: InjectedAccountExt[];
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 15);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);

let api: ApiPromise;

export { api };

function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

async function getInjectedAccounts(injectedPromise: Promise<InjectedExtension[]>): Promise<InjectedAccountExt[]> {
  try {
    await injectedPromise;
    const { web3Accounts } = await import('@polkadot/extension-dapp');
    
    const accounts = await web3Accounts();

    return accounts.map(
      ({ address, meta }, whenCreated): InjectedAccountExt => ({
        address,
        meta: {
          ...meta,
          name: `${meta.name || 'unknown'}`,
          whenCreated
        }
      })
    );
  } catch (error) {
    console.error('web3Enable', error);

    return [];
  }
}

async function retrieve(api: ApiPromise, injectedPromise: Promise<InjectedExtension[]>): Promise<ChainData> {
  const [
    chainProperties,
    systemChain,
    systemChainType,
    systemName,
    systemVersion,
    injectedAccounts
  ] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.chainType ? api.rpc.system.chainType() : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version(),
    getInjectedAccounts(injectedPromise)
  ]);

  // HACK Horrible hack to try and give some window to the DOT denomination
  const ss58Format = api.consts.system?.ss58Prefix || chainProperties.ss58Format;

  const properties = registry.createType('ChainProperties', {
    ss58Format,
    tokenDecimals: chainProperties.tokenDecimals,
    tokenSymbol: chainProperties.tokenSymbol
  });

  return {
    injectedAccounts,
    properties,
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString()
  };
}

async function loadOnReady(
  api: ApiPromise,
  injectedPromise: Promise<InjectedExtension[]>,
  store: KeyringStore | undefined
): Promise<ApiState> {
  const { injectedAccounts, properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(
    api,
    injectedPromise
  );

  const ss58Format = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber();
  const tokenSymbol = properties.tokenSymbol.unwrapOr(undefined)?.toString();
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]);
  const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(
    registry.createType('ChainProperties', {
      ss58Format,
      tokenDecimals,
      tokenSymbol
    })
  );

  // FIXME This should be removed (however we have some hanging bits, e.g. vanity)
  keyring.setSS58Format(ss58Format);

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: (tokenDecimals as BN[]).map((b) => b.toNumber()),
    unit: tokenSymbol
  });

  // finally load the keyring
  isKeyringLoaded() ||
    keyring.loadAll(
      {
        genesisHash: api.genesisHash,
        isDevelopment,
        ss58Format,
        store,
        type: 'sr25519'
      },
      injectedAccounts
    );

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment,
    systemChain,
    systemName,
    systemVersion
  };
}

export const Api = React.memo(function Api({ children, store, endpoints }: Props): React.ReactElement<Props> | null {
  const [state, setState] = useState<ApiState>(({
    hasInjectedAccounts: false,
    isApiReady: false
  } as unknown) as ApiState);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExtensionLoading, setIsExtensionoading] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [apiError, setApiError] = useState<null | string>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();

  // initial initialization
  useEffect((): void => {
    const provider = new WsProvider(endpoints);

    api = new ApiPromise(
      options({
        provider,
        registry,
        types: {}
      })
    );

    api.on('connected', () => setIsApiConnected(true));
    api.on('disconnected', () => setIsApiConnected(false));
    api.on('error', (error: Error) => setApiError(error.message));
    api.on('ready', (): void => {
      setIsReady(true);
    });

    setIsApiInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExtension = useCallback(async () => {
    const { web3Enable } = await import('@polkadot/extension-dapp');
    setIsExtensionoading(true);
    try {
      if (apiError) {
        throw new Error(apiError);
      }

      if (!isReady) {
        await new Promise((resolve, reject): void => {
          api.once('error', (error: Error) => reject(error));
          api.once('disconnected', () => reject(new Error('disconnected')));
          api.once('ready', (): void => {
            resolve(true);
          });
        });
      }

      const injectedPromise = web3Enable('Karura Parachain Auction');

      const injected = await injectedPromise;

      setExtensions(injected);

      const data = await loadOnReady(api, injectedPromise, store);

      setState(data);

      if (data.hasInjectedAccounts) {
        setIsLoaded(true);
      } else {
        setApiError('Cannot get the account address from Polkadot Extension');
        setIsLoaded(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoaded(false);
      setApiError((error as Error)?.message);
    } finally {
      setIsExtensionoading(false);
    }
  }, [isReady, store, apiError]);

  const value = useMemo<ApiProps>(
    () => ({
      ...state,
      api,
      loadExtension,
      isLoaded,
      isExtensionLoading,
      apiError,
      extensions,
      isReady,
      isApiConnected,
      isApiInitialized,
      isWaitingInjected: !extensions
    }),
    [
      loadExtension,
      isLoaded,
      isExtensionLoading,
      apiError,
      extensions,
      isReady,
      isApiConnected,
      isApiInitialized,
      state
    ]
  );

  if (!value.isApiInitialized) {
    return null;
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
});
