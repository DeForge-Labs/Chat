"use client";

import { useDispatch } from "react-redux";
import {
  setChatQuery,
  setChatSessions,
  setCurrentProcessingSessionId,
  setCurrentSessionHistory,
  setCurrentSessionId,
  setIsChatLoading,
} from "@/redux/slice/chatSlice";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import axios from "axios";

export default function useChat() {
  const dispatch = useDispatch();
  const chatQuery = useSelector((state) => state.chat.chatQuery);
  const workflowId = useSelector((state) => state.chat.workflowId);
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);

  const startNewChat = async () => {
    try {
      dispatch(setIsChatLoading(true));

      const sessionId = uuidv4();
      dispatch(setCurrentProcessingSessionId(sessionId));

      dispatch(setCurrentSessionId(sessionId));

      const apiCall = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot/message/${workflowId}`,
        {
          Message: chatQuery,
          queryId: sessionId,
        }
      );

      if (!apiCall.data.success) {
        toast.error(apiCall.data.message);
        return;
      }

      const response = apiCall.data.value.Message;

      const history = response
        ? [
            {
              role: "user",
              content: chatQuery,
            },
            {
              role: "assistant",
              content: response,
            },
          ]
        : [
            {
              role: "user",
              content: chatQuery,
            },
            {
              role: "assistant",
              content: "I'm sorry, I couldn't generate a response.",
            },
          ];

      dispatch(setCurrentSessionHistory(history));

      localStorage.setItem("chatHistory_" + sessionId, JSON.stringify(history));

      const allChatSessions = localStorage.getItem("chatSessions");
      if (!allChatSessions) {
        localStorage.setItem(
          "chatSessions",
          JSON.stringify([
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );

        dispatch(
          setChatSessions([
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );
      } else {
        localStorage.setItem(
          "chatSessions",
          JSON.stringify([
            ...JSON.parse(allChatSessions),
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );

        dispatch(
          setChatSessions([
            ...JSON.parse(allChatSessions).filter(
              (session) => session.workflowId === workflowId
            ),
            {
              id: sessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );
      }

      dispatch(setCurrentSessionId(sessionId));
      dispatch(setChatQuery(""));
      dispatch(setCurrentProcessingSessionId(null));
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setIsChatLoading(false));
    }
  };

  const addChat = async () => {
    try {
      dispatch(setIsChatLoading(true));

      dispatch(setCurrentProcessingSessionId(currentSessionId));

      const allChatSessions = localStorage.getItem("chatSessions");

      const filteredChatSessions = JSON.parse(allChatSessions).filter(
        (session) => session.workflowId === workflowId
      );

      if (
        !filteredChatSessions.find((session) => session.id === currentSessionId)
      ) {
        localStorage.setItem(
          "chatSessions",
          JSON.stringify([
            ...JSON.parse(allChatSessions),
            {
              id: currentSessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );

        dispatch(
          setChatSessions([
            ...JSON.parse(allChatSessions).filter(
              (session) => session.workflowId === workflowId
            ),
            {
              id: currentSessionId,
              name: chatQuery,
              workflowId,
              timestamp: new Date().toISOString(),
            },
          ])
        );
      }

      let chatHistory = localStorage.getItem("chatHistory_" + currentSessionId);

      if (chatHistory) {
        dispatch(
          setCurrentSessionHistory([
            ...JSON.parse(chatHistory),
            {
              role: "user",
              content: chatQuery,
            },
          ])
        );
      } else {
        dispatch(
          setCurrentSessionHistory([
            {
              role: "user",
              content: chatQuery,
            },
          ])
        );
      }

      const apiCall = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot/message/${workflowId}`,
        {
          Message: chatQuery,
          queryId: currentSessionId,
        }
      );

      if (!apiCall.data.success) {
        toast.error(apiCall.data.message);
        return;
      }

      const response = apiCall.data.value.Message;

      if (!response) {
        dispatch(
          setCurrentSessionHistory([
            ...JSON.parse(chatHistory || "[]"),
            {
              role: "user",
              content: chatQuery,
            },
            {
              role: "assistant",
              content: "I'm sorry, I couldn't generate a response.",
            },
          ])
        );

        localStorage.setItem(
          "chatHistory_" + currentSessionId,
          JSON.stringify([
            ...JSON.parse(chatHistory || "[]"),
            {
              role: "user",
              content: chatQuery,
            },
            {
              role: "assistant",
              content: "I'm sorry, I couldn't generate a response.",
            },
          ])
        );

        dispatch(setChatQuery(""));
        dispatch(setCurrentProcessingSessionId(null));
      } else {
        dispatch(
          setCurrentSessionHistory([
            ...JSON.parse(chatHistory || "[]"),
            {
              role: "user",
              content: chatQuery,
            },
            {
              role: "assistant",
              content: response,
            },
          ])
        );

        localStorage.setItem(
          "chatHistory_" + currentSessionId,
          JSON.stringify([
            ...JSON.parse(chatHistory || "[]"),
            {
              role: "user",
              content: chatQuery,
            },
            {
              role: "assistant",
              content: response,
            },
          ])
        );

        dispatch(setCurrentSessionId(currentSessionId));

        dispatch(setChatQuery(""));
        dispatch(setCurrentProcessingSessionId(null));
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setIsChatLoading(false));
    }
  };

  return {
    startNewChat,
    addChat,
  };
}
