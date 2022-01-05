import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ENVIRONMENT, Account } from './types';

type SliceState = {
  language: string;
  ethereum: any;
  env: ENVIRONMENT | null;
  accounts: Account[];
  selectedAccount: Account | null;
  envModalOpen: boolean;
  accModalOpen: boolean;
};

const initialState: SliceState = {
  language: 'en',
  ethereum: null,
  env: null,
  accounts: [],
  selectedAccount: null,
  envModalOpen: false,
  accModalOpen: false
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
    },
    setEthereum: (state, { payload }: PayloadAction<unknown>) => {
      state.ethereum = payload;
    },
    setEnv: (state, { payload }: PayloadAction<ENVIRONMENT>) => {
      state.env = payload;
    },
    setAccounts: (state, { payload }: PayloadAction<Account[]>) => {
      state.accounts = payload;
      state.selectedAccount = state.accounts[0];
    },
    setEnvModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.envModalOpen = payload;
    },
    setAccModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.accModalOpen = payload;
    }
  }
});

export const { setLanguage, setEthereum, setEnv, setAccounts, setEnvModalOpen, setAccModalOpen } = globalSlice.actions;

export default globalSlice.reducer;
