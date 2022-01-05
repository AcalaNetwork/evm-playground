import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ENVIRONMENT } from './types';

type SliceState = {
  language: string;
  ethereum: any;
  env: ENVIRONMENT | null;
};

const initialState: SliceState = {
  language: 'en',
  ethereum: null,
  env: null
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
    }
  }
});

export const { setLanguage, setEthereum, setEnv } = globalSlice.actions;

export default globalSlice.reducer;
