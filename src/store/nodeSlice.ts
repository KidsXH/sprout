import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import { TutorialContentType } from "@/models/agents/writer";
import { ChatCompletionRequestMessage } from "openai";

export type ChatNodeType = {
  observation: string;
  thought: string;
  action: TutorialContentType;
  codeRange: number[];
};

export type ChatNodeWithID = ChatNodeType & { id: number };

export type RequestWithChannelID = {
  channelID: number;
  request: ChatCompletionRequestMessage;
};

interface NodeState {
  requestPool: RequestWithChannelID[];
  nodePool: ChatNodeWithID[];
}

const initialState: NodeState = {
  requestPool: [],
  nodePool: [],
};

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<ChatNodeWithID>) => {
      state.nodePool.push(action.payload);
    },
    addRequests: (
      state,
      action: PayloadAction<[number, ChatCompletionRequestMessage[]]>,
    ) => {
      const [channelID, requests] = action.payload;
      state.requestPool = [
        ...state.requestPool,
        ...requests.map((request) => ({ channelID, request })),
      ];
    },
  },
});

export const { addNode, addRequests } = nodeSlice.actions;

export const selectNodes = (state: RootState) => state.node.nodePool;

export const selectRequestPool = (state: RootState) => state.node.requestPool;

export default nodeSlice.reducer;
