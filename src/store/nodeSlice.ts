import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import { TutorialContent } from "@/models/agents/writer";
import { OpenAI } from "openai";
import { matchCode } from "@/utils/matchCode";
import { ChatCompletionMessageParam } from "openai/resources";

export type ChatNodeType = {
  observation: string;
  thought: string;
  action: TutorialContent;
  codeRange?: number[];
  disabled: boolean;
};

export type ChatNodeWithID = ChatNodeType & { id: number };

export type RequestWithChannelID = {
  channelID: number;
  request: ChatCompletionMessageParam;
  disabled: boolean;
};

interface NodeState {
  requestPool: RequestWithChannelID[];
  numRequests: number;
  nodePool: ChatNodeWithID[];
  numNodes: number;
  numHandledRequests: number;
  numDisabledRequests: number;
}

const initialState: NodeState = {
  requestPool: [],
  numRequests: 0,
  nodePool: [],
  numNodes: 0,
  numHandledRequests: 0,
  numDisabledRequests: 0,
};

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    addRequest: (
      state,
      action: PayloadAction<[number, ChatCompletionMessageParam]>,
    ) => {
      const [channelID, request] = action.payload;
      state.requestPool.push({ channelID, request, disabled: false });
      state.numRequests += 1;
    },
    updateNodePool: (state, action: PayloadAction<ChatNodeWithID[]>) => {
      state.nodePool.push(...action.payload);
    },
    updateCodeRange: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      const numLines = code.split("\n").length;
      state.nodePool.forEach((node) => {
        const searchCode = node.action.targetCode;
        if (node.codeRange === undefined) {
          if (searchCode === undefined || searchCode === "") {
            node.codeRange = [1, numLines];
          } else {
            node.codeRange = matchCode(searchCode, code);
          }
        }
      });
    },
    addNode: (state, action: PayloadAction<ChatNodeWithID>) => {
      state.nodePool.push(action.payload);
    },
    setNumHandledRequests: (state, action: PayloadAction<number>) => {
      state.numHandledRequests = action.payload;
    },
    disableChannel: (state, action: PayloadAction<number>) => {
      const channelID = action.payload;
      state.numDisabledRequests = 0;
      state.requestPool.forEach((request) => {
        if (request.channelID === channelID) {
          request.disabled = true;
          state.numDisabledRequests += 1;
        }
      });
      state.nodePool.forEach((node) => {
        node.disabled = state.requestPool[node.id].disabled;
      });
    },
  },
});

export const {
  addNode,
  addRequest,
  updateNodePool,
  updateCodeRange,
  setNumHandledRequests,
  disableChannel,
} = nodeSlice.actions;

export const selectNodePool = (state: RootState) => state.node.nodePool;

export const selectRequestPool = (state: RootState) => state.node.requestPool;

export const selectNumNodes = (state: RootState) => state.node.numNodes;

export const selectNumRequests = (state: RootState) => state.node.numRequests;

export const selectNumHandledRequests = (state: RootState) =>
  state.node.numHandledRequests;

export const selectNumDisabledRequests = (state: RootState) =>
  state.node.numDisabledRequests;

export default nodeSlice.reducer;
