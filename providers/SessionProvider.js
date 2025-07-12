"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setChatSessions } from "@/redux/slice/chatSlice";

export default function SessionProvider({ children }) {
  const workflowId = useSelector((state) => state.chat.workflowId);
  const dispatch = useDispatch();

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

  return <>{children}</>;
}
