import { useAppSelector } from 'state/hooks';
import { accountListSelector, selectedAccountSelector, selectedAddressSelector } from './selectors';

export const useActiveAddress = () => {
  return useAppSelector(selectedAddressSelector);
};

export const useActiveAccount = () => {
  return useAppSelector(selectedAccountSelector);
};

export const useAccountList = () => {
  return useAppSelector(accountListSelector);
};
