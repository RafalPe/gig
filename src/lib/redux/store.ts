import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { groupsApi } from "./groupsApi";
import { userApi } from "./userApi";

const rootReducer = combineReducers({
  [groupsApi.reducerPath]: groupsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

export const makeStore = (
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(groupsApi.middleware)
        .concat(userApi.middleware),

    preloadedState,
  });
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
