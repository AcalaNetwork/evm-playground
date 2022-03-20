import { FixedNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrencyId } from 'types';

export interface Subscription {
  subscribeId: number;
  currencyId: CurrencyId;
  amount: FixedNumber;
  vestingPeriod: number;
  minAmount: FixedNumber;
  minRatio: FixedNumber;
  discount: {
    max: FixedNumber;
    incOnIdle: FixedNumber;
    decPerUnit: FixedNumber;
  };
  state: {
    totalSold: FixedNumber;
    lastSoldAt: number;
    lastDiscount: FixedNumber;
  };
}

export interface SubscriptionDetail extends Subscription {
  subscriptionPrice: FixedNumber;
  priceDiscount: FixedNumber;
}

type SliceState = {
  readonly subscriptions: Subscription[] | null;
};

const initialState: SliceState = {
  subscriptions: null
};

export const subscriptionSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setSubscriptions: (state, { payload }: PayloadAction<Subscription[]>) => {
      state.subscriptions = payload;
    }
  }
});

export const { setSubscriptions } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
