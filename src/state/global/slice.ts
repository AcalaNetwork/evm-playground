import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SliceState = {
  language: string;
};

const initialState: SliceState = {
  language: 'en'
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
    }
  }
});

export const { setLanguage } = globalSlice.actions;

export default globalSlice.reducer;
