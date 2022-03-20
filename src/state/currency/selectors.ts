import { AppState } from '../index';

export const tokenListSelector = (state: AppState) => state.currency.tokenList || [];
