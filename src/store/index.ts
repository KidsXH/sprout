import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/store/chatSlice";
import modelReducer from "@/store/modelSlice";
import nodeReducer from "@/store/nodeSlice";
import selectionReducer from "@/store/selectionSlice";
import highlightReducer from "@/store/highlightSlice";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    model: modelReducer,
    node: nodeReducer,
    selection: selectionReducer,
    highlight: highlightReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
