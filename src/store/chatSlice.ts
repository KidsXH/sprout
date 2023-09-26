import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

type Chat = {
  channel: number;
  messageID: number;
};

type ChainNode = {
  id: number;
  text: string;
  color: string;
  range: number[];
  step: number;
  summary: string;
};

interface ChatState {
  chatChannels: { [key: number]: number[] };
  latestChat: Chat | null;
  mainChannelID: number;
  mainChannelChats: number[];
  nrOfChats: number;
  chainNodes: ChainNode[];
}

const initialState: ChatState = {
  chatChannels: { 0: [] },
  latestChat: null,
  mainChannelID: 0,
  mainChannelChats: [],
  nrOfChats: 0,
  chainNodes: [],
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
    setChainNodes: (state, action: PayloadAction<ChainNode[]>) => {
      state.chainNodes = [...action.payload];
    },
  },
});

export const { addChat, setMainChannelID, updateMainChannelChats, setChainNodes } =
  chatSlice.actions;

export const selectChatChannels = (state: RootState) => state.chat.chatChannels;

export const selectLatestChat = (state: RootState) => state.chat.latestChat;

export const selectMainChannelID = (state: RootState) =>
  state.chat.mainChannelID;

export const selectMainChannelChats = (state: RootState) =>
  state.chat.mainChannelChats;

export const selectNrOfChats = (state: RootState) => state.chat.nrOfChats;

export const selectChainNodes = (state: RootState) => state.chat.chainNodes;

export default chatSlice.reducer;
