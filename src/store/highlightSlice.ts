import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

interface HighlightState {
  highlightNode: number; //the id of highlight node in chain
  previewNode: number;
  codeScrollTop: number;
  textScrollTop: number;
}

const initialState: HighlightState = {
  highlightNode: -1,
  previewNode: -1,
  codeScrollTop: 0,
  textScrollTop: 0,
};

export const highlightSlice = createSlice({
  name: "highlight",
  initialState,
  reducers: {
    updateHighlightNode: (state, action: PayloadAction<number>) => {
      state.highlightNode = action.payload;
    },
    updateCodeScrollTop: (state, action: PayloadAction<number>) => {
      state.codeScrollTop = action.payload;
    },
    updateTextScrollTop: (state, action: PayloadAction<number>) => {
      state.textScrollTop = action.payload;
    },
  },
});

export const { updateHighlightNode, updateCodeScrollTop, updateTextScrollTop } =
  highlightSlice.actions;

export const selectHighlightNode = (state: RootState) =>
  state.highlight.highlightNode;
export const selectCodeScrollTop = (state: RootState) =>
  state.highlight.codeScrollTop;
export const selectTextScrollTop = (state: RootState) =>
  state.highlight.textScrollTop;
export default highlightSlice.reducer;
