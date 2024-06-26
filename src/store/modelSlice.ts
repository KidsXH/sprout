import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";
import "dotenv/config";
import { DIJKSTRA_CODE } from "@/components/CodeView/codeEditor";

const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

interface modelState {
  sourceCode: string;
  runningState: "running" | "stopped" | "paused" | "waited" | "error";
  command:
    | "start"
    | "stop"
    | "step"
    | "reset"
    | "run"
    | "pause"
    | "continue"
    | "continue-next"
    | "next-plan"
    | "next-split"
    | "next-group"
    | "finish"
    | "none";
  modelName: string;
  apiKey: string;
  numRuns: number;
}

const initialState: modelState = {
  sourceCode: DIJKSTRA_CODE,
  runningState: "stopped",
  command: "none",
  modelName: "gpt-3.5-turbo-16k",
  apiKey: DEFAULT_API_KEY,
  numRuns: 0,
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setSourceCode: (state, action: PayloadAction<string>) => {
      state.sourceCode = action.payload;
    },
    setRunningState: (
      state,
      action: PayloadAction<modelState["runningState"]>,
    ) => {
      if (action.payload === "waited" && state.runningState !== "running") {
        return;
      }
      state.runningState = action.payload;
    },
    continueGeneration: (state) => {
      if (state.runningState === "running") {
        state.command = "continue";
      }
    },
    setCommand: (state, action: PayloadAction<modelState["command"]>) => {
      state.command = action.payload;
    },
    setModelName: (state, action: PayloadAction<string>) => {
      state.modelName = action.payload;
    },
    setApiKey: (state, action: PayloadAction<string>) => {
      state.apiKey = action.payload;
    },
    setNumRuns: (state, action: PayloadAction<number>) => {
      state.numRuns = action.payload;
    },
    decreaseNumRuns: (state) => {
      state.numRuns -= 1;
    },
  },
});

export const {
  setSourceCode,
  setRunningState,
  setCommand,
  setModelName,
  setApiKey,
  setNumRuns,
  decreaseNumRuns,
} = modelSlice.actions;

export const selectSourceCode = (state: RootState) => state.model.sourceCode;
export const selectRunningState = (state: RootState) =>
  state.model.runningState;
export const selectCommand = (state: RootState) => state.model.command;
export const selectModelName = (state: RootState) => state.model.modelName;
export const selectApiKey = (state: RootState) => state.model.apiKey;
export const selectNumRuns = (state: RootState) => state.model.numRuns;

export default modelSlice.reducer;
