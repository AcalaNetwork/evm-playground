import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import applicationReducer from './application/slice';
import accountReducer from './account/slice';

export function makeStore() {
  return configureStore({
    reducer: {
      application: applicationReducer,
      account: accountReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false
      })
  });
}

const store = makeStore();

setupListeners(store.dispatch);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
