import { useContext } from 'react';
import { ApiContext } from '../../chain-api/ApiContext';

export function useApi() {
  return useContext(ApiContext);
}
