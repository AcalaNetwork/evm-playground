import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { keyring } from '@polkadot/ui-keyring';
import { useEffect, useRef } from 'react';
import store from 'state';
import { useApi } from '../../hooks/useApi';
import { useAppDispatch, useAppSelector } from '../hooks';
import { loadSelectedAddress, saveSelectedAddress } from './helpers';
import { connectedSelector, selectedAddressSelector } from './selectors';
import { setConnected, updateAccount } from './slice';

export const Updater = () => {
  const { hasInjectedAccounts, loadExtension } = useApi();
  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(selectedAddressSelector);
  const hasInjectedAccountsRef = useRef(hasInjectedAccounts);
  const connected = useAppSelector(connectedSelector);

  hasInjectedAccountsRef.current = hasInjectedAccounts;

  useEffect(() => {
    const storageAddress = loadSelectedAddress();
    const state = store.getState();

    if (storageAddress && !state.account.connected) {
      (async () => {
        await loadExtension();

        const pairs = keyring.getPairs() as any as InjectedAccountWithMeta[];

        dispatch(
          updateAccount({ accountList: pairs.filter(({ meta }) => (meta as any).isInjected), address: storageAddress })
        );

        dispatch(setConnected(true));
      })();
    }
  }, [dispatch, loadExtension]);

  useEffect(() => {
    if (connected) {
      saveSelectedAddress(selectedAddress);
    }
  }, [selectedAddress, connected]);

  return null;
};
