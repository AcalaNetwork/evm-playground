import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AccountState {
  readonly accountList: InjectedAccountWithMeta[] | null;
  readonly selectedAddress: string;
  readonly connected: boolean;
}

const initialState: AccountState = {
  accountList: null,
  selectedAddress: '',
  connected: false
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setConnected: (state, { payload }: PayloadAction<boolean>) => {
      state.connected = payload;
    },
    updateAccount: (
      state,
      {
        payload: { accountList, address }
      }: PayloadAction<{
        accountList?: InjectedAccountWithMeta[];
        address?: string;
      }>
    ) => {
      if (accountList) {
        state.accountList = accountList;
      }

      // const defaultAddress = state.accountList?.[0]?.address || '';
      const defaultAddress = '';

      if (!state.selectedAddress && !address) {
        state.selectedAddress = defaultAddress;
      } else {
        const targetAddress = address || state.selectedAddress;
        const findedAccount = state.accountList?.find(({ address }) => targetAddress === address);

        state.selectedAddress = findedAccount ? findedAccount.address : defaultAddress;
      }
    }
  }
});

export const { updateAccount, setConnected } = accountSlice.actions;

export default accountSlice.reducer;
