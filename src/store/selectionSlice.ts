import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

interface SelectionState {
  chainNodes: number[]; // The id of the nodes in the chain
  clickNodeTrigger: boolean;
  selectedCodeRange: [number, number];
}

const initialState: SelectionState = {
  chainNodes: [],
  clickNodeTrigger: false,
  selectedCodeRange: [0, 0],
};

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    pickChain: (state, action: PayloadAction<number[]>) => {
      state.chainNodes = [...action.payload];
    },
    clickNode: (state) => {
      state.clickNodeTrigger = !state.clickNodeTrigger;
    },
    updateSelectedCodeRange: (
      state,
      action: PayloadAction<[number, number]>,
    ) => {
      state.selectedCodeRange = [...action.payload];
    },
  },
});

export const { pickChain, clickNode, updateSelectedCodeRange } =
  selectionSlice.actions;

export const selectChainNodes = (state: RootState) =>
  state.selection.chainNodes;

export const selectClickNodeTrigger = (state: RootState) =>
  state.selection.clickNodeTrigger;

export const selectSelectedCodeRange = (state: RootState) =>
  state.selection.selectedCodeRange;

export default selectionSlice.reducer;
