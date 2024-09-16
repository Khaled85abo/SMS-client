import { configureStore } from "@reduxjs/toolkit";
import currencySlice from "./features/currency/currencySlice";
import { currencyApi } from "./features/currency/currencyApi";
import themeSlice from "./features/theme/themeSlice";
import authSlice from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";

export const store = configureStore({
  reducer: {
    currency: currencySlice,
    theme: themeSlice,
    auth: authSlice,
    [currencyApi.reducerPath]: currencyApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(currencyApi.middleware, authApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
