import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",

  initialState: {
    chat: null,
    isInitializing: true,
  },

  reducers: {
    setChat: (state, action) => {
      state.user = action.payload;
    },
    setIsInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
  },
});

export const { setChat, setIsInitializing } = chatSlice.actions;

export default chatSlice.reducer;
