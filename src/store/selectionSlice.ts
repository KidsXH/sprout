import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

interface SelectionState {
  chainNodes: number[]; // The id of the nodes in the chain
  clickNodeTrigger: boolean;
}

const initialState: SelectionState = {
  chainNodes: [],
  clickNodeTrigger: false,
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
    }
  },
});

export const { pickChain , clickNode} = selectionSlice.actions;

export const selectChainNodes = (state: RootState) =>
  state.selection.chainNodes;

export const selectClickNodeTrigger = (state: RootState) =>
  state.selection.clickNodeTrigger;

export default selectionSlice.reducer;
