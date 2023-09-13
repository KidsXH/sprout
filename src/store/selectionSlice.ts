import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/index";

interface SelectionState {
  chainNodes: number[]; // The id of the nodes in the chain
}

const initialState: SelectionState = {
  chainNodes: [0, 1, 2, 3, 4, 5, 6, 7],
};

export const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    pickChain: (state, action: PayloadAction<number[]>) => {
      state.chainNodes = [...action.payload];
    },
  },
});

export const { pickChain } = selectionSlice.actions;

export const selectChainNodes = (state: RootState) =>
  state.selection.chainNodes;

export default selectionSlice.reducer;
