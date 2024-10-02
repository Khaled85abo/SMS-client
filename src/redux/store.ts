import { configureStore } from "@reduxjs/toolkit";
import currencySlice from "./features/currency/currencySlice";
import { currencyApi } from "./features/currency/currencyApi";
import workspaceSlice from "./features/workspace/workspaceSlice";
import { workspaceApi } from "./features/workspace/workspaceApi";
import boxSlice from "./features/box/boxSlice";
import { boxApi } from "./features/box/boxApi";
import itemSlice from "./features/item/itemSlice";
import { itemApi } from "./features/item/itemApi";
import themeSlice from "./features/theme/themeSlice";
import authSlice from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";

export const store = configureStore({
  reducer: {
    currency: currencySlice,
    theme: themeSlice,
    auth: authSlice,
    workspace: workspaceSlice,
    box: boxSlice,
    item: itemSlice,
    [currencyApi.reducerPath]: currencyApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [boxApi.reducerPath]: boxApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(currencyApi.middleware, authApi.middleware, workspaceApi.middleware, boxApi.middleware, itemApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
