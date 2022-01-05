import { AppState } from '..';

export const languageSelector = (state: AppState) => state.global.language;

export const isMetamaskOnboarded = (state: AppState) => state.global.ethereum && state.global.ethereum.selectedAddress;

export const currentEnv = (state: AppState) => state.global.env;
