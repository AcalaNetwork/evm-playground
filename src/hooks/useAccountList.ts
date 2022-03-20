import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { keyring } from '@polkadot/ui-keyring';
import { useMemo } from 'react';
import { useApi } from './useApi';

export const useAccountList = () => {
  const { isApiReady } = useApi();

  return useMemo(() => {
    if (isApiReady) {
      return keyring.getPairs().filter(({ meta }) => (meta as any).isInjected) as any as InjectedAccountWithMeta[];
    } else {
      return [];
    }
  }, [isApiReady]);
};
