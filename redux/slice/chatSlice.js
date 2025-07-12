import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",

  initialState: {
    isInitializing: true,
    currentSessionId: null,
    currentSessionHistory: null,
    chatQuery: "",
    isChatLoading: false,
    currentProcessingSessionId: null,
    workflowId: "12345",
    chatSessions: [],
  },

  reducers: {
    setIsInitializing: (state, action) => {
      state.isInitializing = action.payload;
    },
    setCurrentSessionId: (state, action) => {
      state.currentSessionId = action.payload;
    },
    setCurrentSessionHistory: (state, action) => {
      state.currentSessionHistory = action.payload;
    },
    setChatQuery: (state, action) => {
      state.chatQuery = action.payload;
    },
    setIsChatLoading: (state, action) => {
      state.isChatLoading = action.payload;
    },
    setCurrentProcessingSessionId: (state, action) => {
      state.currentProcessingSessionId = action.payload;
    },
    setWorkflowId: (state, action) => {
      state.workflowId = action.payload;
    },
    setChatSessions: (state, action) => {
      state.chatSessions = action.payload;
    },
  },
});

export const {
  setIsInitializing,
  setCurrentSessionId,
  setCurrentSessionHistory,
  setChatQuery,
  setIsChatLoading,
  setCurrentProcessingSessionId,
  setWorkflowId,
  setChatSessions,
} = chatSlice.actions;

export default chatSlice.reducer;
