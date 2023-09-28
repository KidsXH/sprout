import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

type Chat = {
  channel: number;
  messageID: number;
};

export type ChannelStatus = {
  channelID: number;
  isActive: boolean;
  isDone: boolean;
  lastChatNodeID: number;
};

type ChainNode = {
  id: number;
  text: string;
  color: string;
  range: number[];
  step: number;
  summary: string;
  requestID: number;
};

interface ChatState {
  chatChannels: { [key: number]: number[] };
  latestChat: Chat | null;
  mainChannelID: number;
  mainChannelChats: number[];
  numChats: number;
  numChannels: number;
  chainNodes: ChainNode[];
  activeChannels: ChannelStatus[];
  focusChatID: number;
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
  focusChatID: -1,
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
    activateChannel: (state, action: PayloadAction<ChannelStatus>) => {
      state.activeChannels = [...state.activeChannels, action.payload];
    },
    deactivateChannel: (state, action: PayloadAction<number>) => {
      state.activeChannels.forEach((channel) => {
        if (channel.channelID === action.payload) {
          channel.isActive = false;
          channel.isDone = true;
        }
      });
    },
    changeChannelStatus: (state, action: PayloadAction<ChannelStatus>) => {
      const { channelID, isActive, isDone, lastChatNodeID } = action.payload;
      state.activeChannels.forEach((channel) => {
        if (channel.channelID === channelID) {
          channel.isActive = isActive;
          channel.isDone = isDone;
          channel.lastChatNodeID = lastChatNodeID;
        }
      });
    },
    clearActiveChannels: (state) => {
      state.activeChannels = [];
    },
    setFocusChatID: (state, action: PayloadAction<number>) => {
      state.focusChatID = action.payload;
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
  changeChannelStatus,
  setFocusChatID,
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

export const selectFocusChatID = (state: RootState) => state.chat.focusChatID;

export default chatSlice.reducer;
