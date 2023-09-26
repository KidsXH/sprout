import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import { TutorialContent } from "@/models/agents/writer";
import { ChatCompletionRequestMessage } from "openai";
import { matchCode } from "@/utils/matchCode";

export type ChatNodeType = {
  observation: string;
  thought: string;
  action: TutorialContent;
  codeRange?: number[];
};

export type ChatNodeWithID = ChatNodeType & { id: number };

export type RequestWithChannelID = {
  channelID: number;
  request: ChatCompletionRequestMessage;
};

interface NodeState {
  requestPool: RequestWithChannelID[];
  numRequests: number;
  nodePool: ChatNodeWithID[];
  numNodes: number;
  numHandledRequests: number;
}

const initialState: NodeState = {
  requestPool: [],
  numRequests: 0,
  nodePool: [],
  numNodes: 0,
  numHandledRequests: 0,
};

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    addRequest: (
      state,
      action: PayloadAction<[number, ChatCompletionRequestMessage]>,
    ) => {
      const [channelID, request] = action.payload;
      state.requestPool.push({ channelID, request });
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
    }
  },
});

export const { addNode, addRequest, updateNodePool, updateCodeRange , setNumHandledRequests} =
  nodeSlice.actions;

export const selectNodePool = (state: RootState) => state.node.nodePool;

export const selectRequestPool = (state: RootState) => state.node.requestPool;

export const selectNumNodes = (state: RootState) => state.node.numNodes;

export const selectNumRequests = (state: RootState) => state.node.numRequests;

export const selectNumHandledRequests = (state: RootState) => state.node.numHandledRequests;

export default nodeSlice.reducer;
