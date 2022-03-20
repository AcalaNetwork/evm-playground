import { useAppSelector } from 'state/hooks';
import { selectedAccountSelector, selectedAddressSelector } from './selectors';

export const useActiveAddress = () => {
  return useAppSelector(selectedAddressSelector);
};

export const useActiveAccount = () => {
  return useAppSelector(selectedAccountSelector);
};
