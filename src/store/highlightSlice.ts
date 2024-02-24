import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

interface HighlightState {
  highlightNode: number; //the id of highlight node in chain
  textSelected: number;
  previewNode: number;
  codeScrollTop: number;
  textScrollTop: number;
  highlightBlockHeight: number;
}

const initialState: HighlightState = {
  highlightNode: -1,
  textSelected: -1,
  previewNode: -1,
  codeScrollTop: 0,
  textScrollTop: 0,
  highlightBlockHeight: 0,
};

export const highlightSlice = createSlice({
  name: "highlight",
  initialState,
  reducers: {
    updateHighlightNode: (state, action: PayloadAction<number>) => {
      state.highlightNode = action.payload;
    },
    updateTextSelected: (state, action: PayloadAction<number>) => {
      state.textSelected = action.payload;
    },
    updateCodeScrollTop: (state, action: PayloadAction<number>) => {
      state.codeScrollTop = action.payload;
    },
    updateTextScrollTop: (state, action: PayloadAction<number>) => {
      state.textScrollTop = action.payload;
    },
    updateHighlightBlockHeight: (state, action: PayloadAction<number>) => {
      state.highlightBlockHeight = action.payload;
    },
  },
});

export const {
  updateHighlightNode,
  updateTextSelected,
  updateCodeScrollTop,
  updateTextScrollTop,
  updateHighlightBlockHeight,
} = highlightSlice.actions;

export const selectHighlightNode = (state: RootState) =>
  state.highlight.highlightNode;
export const selectTextSelected = (state: RootState) =>
  state.highlight.textSelected;
export const selectCodeScrollTop = (state: RootState) =>
  state.highlight.codeScrollTop;
export const selectTextScrollTop = (state: RootState) =>
  state.highlight.textScrollTop;
export const selectHighlightBlockHeight = (state: RootState) =>
  state.highlight.highlightBlockHeight;
export default highlightSlice.reducer;
