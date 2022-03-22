import { AppState } from 'state';

export const languageSelector = (state: AppState) => state.application.language;

export const envSelector = (state: AppState) => state.application.env;
