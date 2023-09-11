import { createSlice } from "@reduxjs/toolkit";

export const contentSlice = createSlice({
  name: "content",
  initialState: {
    codeScrollTop: 0,
    chainScrollTop: 0,
    textScrollTop: 0,
  },
  reducers: {
    changeCodeScrollTop: (state, action) => {
      state.codeScrollTop = action.payload;
    },
    changeChainScrollTop: (state, action) => {
      state.chainScrollTop = action.payload;
    },
    changeTextScrollTop: (state, action) => {
      state.textScrollTop = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const {
  changeCodeScrollTop,
  changeChainScrollTop,
  changeTextScrollTop,
} = contentSlice.actions;

export default contentSlice.reducer;
