import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ApplicationModal {
  ACCOUNT,
  ENV_SELECT
}

export enum ENVIRONMENT {
  Metamask = 'Metamask',
  PolkadotExtension = 'Polkadot Extension'
}

type SliceState = {
  readonly language: string;
  readonly openModal: ApplicationModal | null;
  readonly env: ENVIRONMENT | null;
};

const initialState: SliceState = {
  language: 'en',
  openModal: null,
  env: null
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
    },
    setOpenModal(state, action) {
      state.openModal = action.payload;
    },
    setEnv: (state, { payload }: PayloadAction<ENVIRONMENT | null>) => {
      state.env = payload;
    }
  }
});

export const { setLanguage, setOpenModal, setEnv } = applicationSlice.actions;

export default applicationSlice.reducer;
