import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import { TutorialContentType } from "@/models/agents/writer";
import { ChatCompletionRequestMessage } from "openai";
import { matchCode } from "@/utils/matchCode";

export type ChatNodeType = {
  observation: string;
  thought: string;
  action: TutorialContentType;
  codeRange?: number[];
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
    updateNodePool: (state, action: PayloadAction<ChatNodeWithID[]>) => {
      state.nodePool = [...action.payload];
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
      state.nodePool = [...state.nodePool, action.payload];
    },
  },
});

export const { addNode, addRequests, updateNodePool, updateCodeRange } =
  nodeSlice.actions;

export const selectNodePool = (state: RootState) => state.node.nodePool;

export const selectRequestPool = (state: RootState) => state.node.requestPool;

export default nodeSlice.reducer;
