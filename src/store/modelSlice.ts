import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

interface modelState {
  sourceCode: string;
  runningState: "running" | "stopped" | "error";
  command:
    | "start"
    | "stop"
    | "step"
    | "reset"
    | "run"
    | "pause"
    | "continue"
    | "next"
    | "finish"
    | "none";
}

const initialState: modelState = {
  sourceCode: "",
  runningState: "stopped",
  command: "none",
};

export const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setSourceCode: (state, action: PayloadAction<string>) => {
      state.sourceCode = action.payload;
    },
    continueGeneration: (state) => {
      if (state.runningState === "running") {
        state.command = "continue";
      }
    },
    setCommand: (state, action: PayloadAction<modelState["command"]>) => {
      state.command = action.payload;
    }
  },
});

export const { setSourceCode , setCommand} = modelSlice.actions;

export const selectSourceCode = (state: RootState) => state.model.sourceCode;
export const selectRunningState = (state: RootState) =>
  state.model.runningState;
export const selectCommand = (state: RootState) => state.model.command;

export default modelSlice.reducer;
