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
    | "next"
    | "finish"
    | "none";
  modelName: string;
  apiKey: string;
}

const initialState: modelState = {
  sourceCode: DIJKSTRA_CODE,
  runningState: "stopped",
  command: "none",
  modelName: "gpt-3.5-turbo",
  apiKey: DEFAULT_API_KEY,
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
  },
});

export const {
  setSourceCode,
  setRunningState,
  setCommand,
  setModelName,
  setApiKey,
} = modelSlice.actions;

export const selectSourceCode = (state: RootState) => state.model.sourceCode;
export const selectRunningState = (state: RootState) =>
  state.model.runningState;
export const selectCommand = (state: RootState) => state.model.command;

export const selectModelName = (state: RootState) => state.model.modelName;

export const selectApiKey = (state: RootState) => state.model.apiKey;

export default modelSlice.reducer;
