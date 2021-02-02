// Copyright 2017-2020 @canvas-ui/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { InjectedExtension } from "@polkadot/extension-inject/types";
import { ChainProperties, ChainType } from "@polkadot/types/interfaces";
import { ApiProps, ApiState } from "./types";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { ApiPromise } from "@polkadot/api/promise";
import { setDeriveCache, deriveMapCache } from "@polkadot/api-derive/util";
import { typesChain, typesSpec } from "@canvas-ui/apps-config/api";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { WsProvider } from "@polkadot/rpc-provider";
import { StatusContext } from "@canvas-ui/react-components/Status";
import { TokenUnit } from "@canvas-ui/react-components/InputNumber";
import keyring from "@polkadot/ui-keyring";
import * as defaults from "@polkadot/ui-keyring/defaults";
import { KeyringStore } from "@polkadot/ui-keyring/types";
import { options } from "@acala-network/api";

import uiSettings from "@polkadot/ui-settings";
import ApiSigner from "@canvas-ui/react-signer/ApiSigner";
import TestingSigner from "@canvas-ui/react-signer/TestingSigner";
import { formatBalance, isTestChain } from "@polkadot/util";
import { setSS58Format } from "@polkadot/util-crypto";
import { defaults as addressDefaults } from "@polkadot/util-crypto/address/defaults";
import { Provider } from "@acala-network/bodhi";
import ApiContext from "./ApiContext";
import registry from "./typeRegistry";
import ERC20 from "./ERC20";
import { setEvmAccounts } from "./util/getEvmAccounts";

interface Props {
  children: React.ReactNode;
  url?: string;
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
  evmAccounts: any;
}

// const injectedPromise = new Promise<InjectedExtension[]>((resolve): void => {
//   window.addEventListener('load', (): void => {
//     resolve(web3Enable('polkadot-js/apps'));
//   });
// });

const DEFAULT_DECIMALS = registry.createType("u32", 12);
const DEFAULT_SS58 = registry.createType("u32", addressDefaults.prefix);
const injectedPromise = web3Enable("polkadot-js/apps");
let api: ApiPromise;

export { api };

async function retrieve(api: ApiPromise): Promise<ChainData> {
  const [
    properties,
    systemChain,
    systemChainType,
    systemName,
    systemVersion,
    injectedAccounts,
    evmAccounts,
  ] = await Promise.all([
    api.rpc.system.properties(),
    api.rpc.system.chain(),
    api.rpc.system.chainType ? api.rpc.system.chainType() : Promise.resolve(registry.createType("ChainType", "Live")),
    api.rpc.system.name(),
    api.rpc.system.version(),
    injectedPromise
      .then(() => web3Accounts())
      .then((accounts) =>
        accounts.map(
          ({ address, meta }, whenCreated): InjectedAccountExt => ({
            address,
            meta: {
              ...meta,
              name: `${meta.name || "unknown"} (${meta.source === "polkadot-js" ? "extension" : meta.source})`,
              whenCreated,
            },
          })
        )
      )
      .catch((error): InjectedAccountExt[] => {
        console.error("web3Enable", error);

        return [];
      }),
    injectedPromise
      //@ts-ignore
      .then((data) => {
        //@ts-ignore
        return data[0]?.accounts.get(true) || [];
      })
      .then((data) => data.filter((i: any) => i.type === "ethereum"))
      .catch((error): InjectedAccountExt[] => {
        console.error("web3Enable", error);

        return [];
      }),
  ]);

  return {
    injectedAccounts,
    properties,
    systemChain: (systemChain || "<unknown>").toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString(),
    evmAccounts,
  };
}

async function loadOnReady(api: ApiPromise, store?: KeyringStore): Promise<ApiState> {
  const {
    injectedAccounts,
    properties,
    systemChain,
    systemChainType,
    systemName,
    systemVersion,
    evmAccounts,
  } = await retrieve(api);

  setEvmAccounts(evmAccounts || []);
  const ss58Format =
    uiSettings.prefix === -1 ? properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber() : uiSettings.prefix;
  const tokenSymbol = properties.tokenSymbol.unwrapOr(undefined)?.toString();
  const tokenDecimals = properties.tokenDecimals.unwrapOr(DEFAULT_DECIMALS).toNumber();
  const isDevelopment = systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType("ChainProperties", { ...properties, ss58Format }));

  // FIXME This should be removed (however we have some hanging bits, e.g. vanity)
  setSS58Format(ss58Format);

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: tokenDecimals,
    unit: tokenSymbol,
  });
  TokenUnit.setAbbr(tokenSymbol);

  // finally load the keyring
  const options = {
    genesisHash: api.genesisHash,
    isDevelopment,
    ss58Format,
    store,
    type: "ed25519",
  };

  (keyring as any).initKeyring(options);

  for (const { name, address } of [
    {
      name: "ACA",
      address: "0x0000000000000000000000000000000000000800",
    },
    {
      name: "AUSD",
      address: "0x0000000000000000000000000000000000000801",
    },
    {
      name: "DOT",
      address: "0x0000000000000000000000000000000000000802",
    },
    {
      name: "XBTC",
      address: "0x0000000000000000000000000000000000000803",
    },
    {
      name: "LDOT",
      address: "0x0000000000000000000000000000000000000804",
    },
    {
      name: "RENBTC",
      address: "0x0000000000000000000000000000000000000805",
    },
  ]) {
    const json = {
      contract: {
        abi: ERC20,
        genesisHash: "0x0000000000000000000000000000000000000000",
      },
      name,
      tags: [],
    };

    keyring.saveContract(address, json);
  }

  const loadContract = (json: any, key: any) => {
    const address = json.address;
    const [, hexAddr] = key.split(":"); // move genesisHash to top-level (TODO Remove from contracts section?)

    json.meta.genesisHash = json.meta.genesisHash || (json.meta.contract && json.meta.contract.genesisHash);
    keyring.contracts.add((keyring as any)._store, address, json);

    (keyring as any).rewriteKey(json, key, hexAddr, defaults.contractKey);
  };

  (keyring as any).initKeyring(options);

  (keyring as any)._store.all((key: any, json: any) => {
    if ((keyring as any).allowGenesis(json)) {
      if (defaults.accountRegex.test(key)) {
        (keyring as any).loadAccount(json, key);
      } else if (defaults.addressRegex.test(key)) {
        (keyring as any).loadAddress(json, key);
      } else if (defaults.contractRegex.test(key)) {
        loadContract(json, key);
      }
    }
  });

  injectedAccounts.forEach((account) => {
    if ((keyring as any).allowGenesis(account)) {
      (keyring as any).loadInjected(account.address, account.meta);
    }
  });

  keyring.keyringOption.init(keyring);

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;
  const isSubstrateV2 = !!Object.keys(api.consts).length;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    hasInjectedAccounts: injectedAccounts.length !== 0,
    isApiReady: true,
    isDevelopment,
    isSubstrateV2,
    systemChain,
    systemName,
    systemVersion,
  };
}

function Api({ children, store, url }: Props): React.ReactElement<Props> | null {
  const { queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [state, setState] = useState<ApiState>(({ isApiReady: false } as unknown) as ApiState);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [evmProvider, setEvmProvider] = useState<Provider | null>(null);
  const [accountSigner, setAccountSigner] = useState<any>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();
  
  const props = useMemo<ApiProps>(
    () => ({
      ...state,
      api,
      accountSigner,
      extensions,
      isApiConnected,
      isApiInitialized,
      evmProvider: evmProvider as Provider,
      isWaitingInjected: !extensions,
    }),
    [extensions, isApiConnected, isApiInitialized, state, evmProvider]
  );

  // initial initialization
  useEffect((): void => {
    const provider = new WsProvider(url);
    const signer = new ApiSigner(queuePayload, queueSetTxStatus);

    const apiOptions = options({
      provider,
      registry,
      signer,
      typesChain,
      typesSpec,
    });

    api = new ApiPromise(apiOptions);

    api.on("connected", () => setIsApiConnected(true));
    api.on("disconnected", () => setIsApiConnected(false));
    api.on(
      "ready",
      async (): Promise<void> => {
        try {
          setState(await loadOnReady(api, store));
        } catch (error) {
          console.error("Unable to load chain", error);
        }
      }
    );

    injectedPromise
      .then((extensions) => {
        setExtensions(extensions);
        setAccountSigner(extensions[0]?.signer);
        setEvmProvider(
          new Provider(
            options({
              provider,
              registry,
              signer: new TestingSigner(registry, extensions[0]?.signer as any),
            })
          )
        );
      })
      .catch((error) => console.error(error));

    setIsApiInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!props.isApiInitialized) {
    return null;
  }

  return <ApiContext.Provider value={props}>{children}</ApiContext.Provider>;
}

export default React.memo(Api);
