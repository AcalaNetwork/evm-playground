import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Tab {
  ReserveStats,
  MyStats
}

export interface DashboardState {
  readonly tab: Tab;
}

const initialState: DashboardState = {
  tab: Tab.ReserveStats
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setTab: (state, { payload }: PayloadAction<Tab>) => {
      state.tab = payload;
    }
  }
});

export const { setTab } = dashboardSlice.actions;

export default dashboardSlice.reducer;
