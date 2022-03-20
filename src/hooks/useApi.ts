import { useContext } from 'react';
import { ApiContext } from '../chain-api-provider/ApiContext';

export function useApi() {
  return useContext(ApiContext);
}
