import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../index';

export const selectedAddressSelector = (state: AppState) => state.account.selectedAddress || '';

export const accountListSelector = (state: AppState) => state.account.accountList || [];

export const connectedSelector = (state: AppState) => state.account.connected;

export const selectedAccountSelector = createSelector(
  selectedAddressSelector,
  accountListSelector,
  (selectedAddress, list) => {
    if (!selectedAddress || !list) return null;
    const account = list.find(({ address }) => address === selectedAddress);
    if (!account) {
      return null;
    }
    return account;
  }
);
