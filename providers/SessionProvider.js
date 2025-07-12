"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setChatSessions,
  setCurrentSessionHistory,
} from "@/redux/slice/chatSlice";

export default function SessionProvider({ children }) {
  const workflowId = useSelector((state) => state.chat.workflowId);
  const dispatch = useDispatch();
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);

  useEffect(() => {
    if (workflowId) {
      const allChatSessions = localStorage.getItem("chatSessions");

      if (allChatSessions) {
        try {
          const parsedChatSessions = JSON.parse(allChatSessions);
          const filteredChatSessions = parsedChatSessions.filter(
            (session) => session.workflowId === workflowId
          );

          dispatch(setChatSessions(filteredChatSessions));
        } catch (error) {
          dispatch(setChatSessions([]));
          localStorage.setItem("chatSessions", JSON.stringify([]));
        }
      }
    }
  }, [workflowId]);

  useEffect(() => {
    if (currentSessionId) {
      const chatHistory = localStorage.getItem(
        "chatHistory_" + currentSessionId
      );
      if (chatHistory) {
        dispatch(setCurrentSessionHistory(JSON.parse(chatHistory)));
      }
    }

    return () => {
      dispatch(setCurrentSessionHistory(null));
    };
  }, [currentSessionId]);

  return <>{children}</>;
}
