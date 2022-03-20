import { useExchangeRate } from 'hooks/useExchangeRate';
import { useCallback } from 'react';
import { AppState } from 'state';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { CurrencyId } from 'types';
import { parseCurrency } from 'utils/token';
import { selectCurrency, selectCurrencyPrice, walletSelector } from './selectors';
import { ApplicationModal, setOpenModal } from './slice';

export const useModalOpen = (modal: ApplicationModal): boolean => {
  const openModal = useAppSelector((state: AppState) => state.application.openModal);
  return openModal === modal;
};

export const useToggleModal = (modal: ApplicationModal) => {
  const open = useModalOpen(modal);
  const dispatch = useAppDispatch();
  return useCallback(
    (close?: boolean) => dispatch(setOpenModal(close !== undefined ? null : open ? null : modal)),
    [dispatch, modal, open]
  );
};

export const useAccountModal = (): [boolean, (close?: boolean) => void] => {
  const showAccountModal = useModalOpen(ApplicationModal.ACCOUNT);

  const toggle = useToggleModal(ApplicationModal.ACCOUNT);

  return [showAccountModal, toggle];
};

export const useClaimModal = (): [boolean, (close?: boolean) => void] => {
  const showClaimModal = useModalOpen(ApplicationModal.CLAIM);

  const toggle = useToggleModal(ApplicationModal.CLAIM);

  return [showClaimModal, toggle];
};

export const useWallet = () => {
  const wallet = useAppSelector(walletSelector);

  return wallet;
};

export const useCurrency = (id?: CurrencyId) => {
  const selector = useCallback((state) => selectCurrency(state, id), [id]);
  return useAppSelector(selector);
};

export const useCurrencyPrice = (id?: CurrencyId) => {
  const exchangeRate = useExchangeRate();
  const selector = useCallback(
    (state) => {
      try {
        const { currencyId } = parseCurrency(id);
        if (currencyId === 'SDAO') {
          if (exchangeRate) {
            return selectCurrencyPrice(state, 'ADAO')?.mulUnsafe(exchangeRate);
          } else {
            return;
          }
        }
        return selectCurrencyPrice(state, id);
      } catch {
        return;
      }
    },
    [id, exchangeRate]
  );

  return useAppSelector(selector);
};
