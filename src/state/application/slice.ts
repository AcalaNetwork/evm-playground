import { FixedNumber } from '@ethersproject/bignumber';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Token } from 'wallet/core';
import { Wallet } from 'wallet/wallet';

export enum ApplicationModal {
  ACCOUNT,
  CLAIM
}

type SliceState = {
  readonly language: string;
  readonly openModal: ApplicationModal | null;
  readonly wallet: Wallet | null;
  readonly currencies: {
    [k: string]: Token;
  };
  readonly bestBlockNumber: number | null;
  readonly adaoPrice: FixedNumber | null;
  readonly marketPrice: {
    [k: string]: FixedNumber;
  };
  readonly oraclePrice: {
    [k: string]: FixedNumber;
  };
  readonly dexPrice: {
    [k: string]: FixedNumber;
  };
};

const initialState: SliceState = {
  language: 'en',
  openModal: null,
  wallet: null,
  bestBlockNumber: null,
  adaoPrice: null,
  marketPrice: {},
  oraclePrice: {},
  dexPrice: {},
  currencies: {}
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setLanguage: (state, { payload }: PayloadAction<string>) => {
      state.language = payload;
    },
    setBestBlockNumber: (state, { payload }: PayloadAction<number>) => {
      state.bestBlockNumber = payload;
    },
    setCurrencies: (state, action) => {
      state.currencies = action.payload;
    },
    setOpenModal(state, action) {
      state.openModal = action.payload;
    },
    initWallet(state, { payload }: PayloadAction<Wallet>) {
      state.wallet = payload;
    },
    setADAOPrice(state, { payload }: PayloadAction<FixedNumber>) {
      state.adaoPrice = payload;
    },
    setMarket: (state, action) => {
      const { price, token } = action.payload;

      state.marketPrice = {
        ...state.marketPrice,
        [token]: price
      };
    },
    setOracle: (state, action) => {
      const { price, token } = action.payload;

      state.oraclePrice = {
        ...state.oraclePrice,
        [token]: price
      };
    },
    setDex: (state, action) => {
      const { price, token } = action.payload;

      state.dexPrice = {
        ...state.dexPrice,
        [token]: price
      };
    }
  }
});

export const {
  setLanguage,
  setOpenModal,
  initWallet,
  setMarket,
  setOracle,
  setCurrencies,
  setDex,
  setBestBlockNumber,
  setADAOPrice
} = applicationSlice.actions;

export default applicationSlice.reducer;
