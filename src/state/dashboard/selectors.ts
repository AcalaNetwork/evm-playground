import { AppState } from 'state';

export const tabSelector = (state: AppState) => state.dashboard.tab;
