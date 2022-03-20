import { useMemo } from 'react';
import { useApi } from './useApi';

export const useApiReady = () => {
  const { api, isReady } = useApi();

  return useMemo(() => {
    if (!isReady || !api) return null;

    return api;
  }, [api, isReady]);
};
