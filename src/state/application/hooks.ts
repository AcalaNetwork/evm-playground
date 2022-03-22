import { useCallback } from 'react';
import { AppState } from 'state';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { envSelector } from './selectors';
import { ApplicationModal, ENVIRONMENT, setEnv, setOpenModal } from './slice';

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

export const useEnv = () => {
  const env = useAppSelector(envSelector);
  const dispatch = useAppDispatch();

  const setAppEnv = useCallback((env: ENVIRONMENT | null) => {
    dispatch(setEnv(env));
  }, []);

  return [env, setAppEnv] as const;
};

export const useAccountModal = (): [boolean, (close?: boolean) => void] => {
  const showAccountModal = useModalOpen(ApplicationModal.ACCOUNT);

  const toggle = useToggleModal(ApplicationModal.ACCOUNT);

  return [showAccountModal, toggle];
};

export const useEnvModal = (): [boolean, (close?: boolean) => void] => {
  const isOpen = useModalOpen(ApplicationModal.ENV_SELECT);

  const toggle = useToggleModal(ApplicationModal.ENV_SELECT);

  return [isOpen, toggle];
};
