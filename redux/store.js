"use client";

import { configureStore } from "@reduxjs/toolkit";

import chatSlice from "./slice/chatSlice.js";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
