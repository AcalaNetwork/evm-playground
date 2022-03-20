import { AppState } from 'state';

export const subscriptionsSelector = (state: AppState) => state.subscription.subscriptions;
