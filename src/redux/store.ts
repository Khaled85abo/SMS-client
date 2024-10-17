import { configureStore } from "@reduxjs/toolkit";

import workspaceSlice from "./features/workspace/workspaceSlice";
import { workspaceApi } from "./features/workspace/workspaceApi";
import boxSlice from "./features/box/boxSlice";
import { boxApi } from "./features/box/boxApi";
import itemSlice from "./features/item/itemSlice";
import { itemApi } from "./features/item/itemApi";
import { detectApi } from "./features/detect/detectApi";
import themeSlice from "./features/theme/themeSlice";
import authSlice from "./features/auth/authSlice";
import { authApi } from "./features/auth/authApi";
import { ragApi } from "./features/rag/ragApi";
export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    workspace: workspaceSlice,
    box: boxSlice,
    item: itemSlice,
    [authApi.reducerPath]: authApi.reducer,
    [workspaceApi.reducerPath]: workspaceApi.reducer,
    [boxApi.reducerPath]: boxApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [detectApi.reducerPath]: detectApi.reducer,
    [ragApi.reducerPath]: ragApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, workspaceApi.middleware, boxApi.middleware, itemApi.middleware, detectApi.middleware, ragApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
