import { configureStore } from "@reduxjs/toolkit";
import modelReducer from "@/store/modelSlice";
import selectionReducer from "@/store/selectionSlice";
import highlightReducer from "@/store/highlightSlice";

export const store = configureStore({
  reducer: {
    model: modelReducer,
    selection: selectionReducer,
    highlight: highlightReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
