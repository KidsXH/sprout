import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

type Chat = {
  channel: number;
  messageID: number;
};

interface ChatState {
  chatChannels: { [key: number]: number[] };
  latestChat: Chat | null;
  mainChannelID: number;
  mainChannelChats: number[];
  nrOfChats: number;
}

const initialState: ChatState = {
  chatChannels: { 0: [] },
  latestChat: null,
  mainChannelID: 0,
  mainChannelChats: [],
  nrOfChats: 0,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<Chat>) => {
      const { channel, messageID } = action.payload;
      if (state.chatChannels[channel] === undefined) {
        state.chatChannels[channel] = [];
      }
      state.chatChannels[channel].push(messageID);
      state.nrOfChats += 1;
      state.latestChat = action.payload;
    },
    setMainChannelID: (state, action: PayloadAction<number>) => {
      state.mainChannelID = action.payload;
      state.mainChannelChats = [...state.chatChannels[action.payload]];
    },
    updateMainChannelChats: (state) => {
      state.mainChannelChats = [...state.chatChannels[state.mainChannelID]];
    },
  },
});

export const { addChat, setMainChannelID, updateMainChannelChats } =
  chatSlice.actions;

export const selectChatChannels = (state: RootState) => state.chat.chatChannels;

export const selectLatestChat = (state: RootState) => state.chat.latestChat;

export const selectMainChannelID = (state: RootState) =>
  state.chat.mainChannelID;

export const selectMainChannelChats = (state: RootState) =>
  state.chat.mainChannelChats;

export const selectNrOfChats = (state: RootState) => state.chat.nrOfChats;

export default chatSlice.reducer;
