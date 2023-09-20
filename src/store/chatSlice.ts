import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import { ChatCompletionRequestMessage } from "openai";

interface ChatState {
  chatSet: { [key: string]: ChatCompletionRequestMessage[] };
  currentChat: string;
}

const initialState: ChatState = {
  chatSet: {},
  currentChat: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChat: (
      state,
      action: PayloadAction<{ value: ChatCompletionRequestMessage[] }>,
    ) => {
      const key = state.currentChat;
      if (state.chatSet[key] === undefined) {
        state.chatSet[key] = [];
      }
      state.chatSet[key].push(...action.payload.value);
    },
    updateChat: (
      state,
      action: PayloadAction<{ value: ChatCompletionRequestMessage[] }>,
    ) => {
      state.chatSet[state.currentChat] = action.payload.value;
    },
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChat = action.payload;
    },
  },
});

export const { addChat, updateChat, setCurrentChat } = chatSlice.actions;

export const selectChatSet = (state: RootState) => state.chat.chatSet;

export const selectCurrentChat = (state: RootState) => state.chat.currentChat;

export default chatSlice.reducer;
