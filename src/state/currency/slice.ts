import { createSlice } from '@reduxjs/toolkit';
import { TokenList } from 'types';

export interface CurrencyState {
  readonly tokenList: typeof TokenList;
}

const initialState: CurrencyState = {
  tokenList: TokenList
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {}
});

// export const {} = currencySlice.actions;

export default currencySlice.reducer;
