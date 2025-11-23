import { configureStore } from '@reduxjs/toolkit';
import { groupsApi } from './groupsApi'; 

export const store = configureStore({
  reducer: {
    [groupsApi.reducerPath]: groupsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(groupsApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;