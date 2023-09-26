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
  numChats: number;
  numChannels: number;
  chainNodes: ChainNode[];
  activeChannels: number[];
}

const initialState: ChatState = {
  chatChannels: { 0: [] },
  latestChat: null,
  mainChannelID: 0,
  mainChannelChats: [],
  numChats: 0,
  numChannels: 1,
  chainNodes: [],
  activeChannels: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addChat: (state, action: PayloadAction<Chat>) => {
      const { channel, messageID } = action.payload;
      if (state.chatChannels[channel] === undefined) {
        state.chatChannels[channel] = [];
        state.numChannels += 1;
      }
      state.chatChannels[channel].push(messageID);
      state.numChats += 1;
      state.latestChat = action.payload;
    },
    addChats: (state, action: PayloadAction<Chat[]>) => {
      const chats = action.payload;
      chats.forEach((chat) => {
        const { channel, messageID } = chat;
        if (state.chatChannels[channel] === undefined) {
          state.chatChannels[channel] = [];
          state.numChannels += 1;
        }
        state.chatChannels[channel].push(messageID);
        state.numChats += 1;
        state.latestChat = chat;
      });
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
    activateChannel: (state, action: PayloadAction<number>) => {
      state.activeChannels = [...state.activeChannels, action.payload];
    },
    deactivateChannel: (state, action: PayloadAction<number>) => {
      state.activeChannels = state.activeChannels.filter(
        (channel) => channel !== action.payload,
      );
    },
    clearActiveChannels: (state) => {
      state.activeChannels = [];
    },
  },
});

export const {
  addChat,
  setMainChannelID,
  updateMainChannelChats,
  setChainNodes,
  activateChannel,
  deactivateChannel,
  clearActiveChannels,
} = chatSlice.actions;

export const selectChatChannels = (state: RootState) => state.chat.chatChannels;

export const selectLatestChat = (state: RootState) => state.chat.latestChat;

export const selectMainChannelID = (state: RootState) =>
  state.chat.mainChannelID;

export const selectMainChannelChats = (state: RootState) =>
  state.chat.mainChannelChats;

export const selectNumChats = (state: RootState) => state.chat.numChats;

export const selectChainNodes = (state: RootState) => state.chat.chainNodes;

export const selectNumChannels = (state: RootState) => state.chat.numChannels;

export const selectActiveChannels = (state: RootState) =>
  state.chat.activeChannels;

export default chatSlice.reducer;
