"use client";

import axios from "axios";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export default function ChatHistory({ chatId, workflowId }) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const scrollRef = useRef(null);

  const scrollToBottom = (behavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [history, isLoading]);

  useEffect(() => {
    const loadHistory = () => {
      setIsInitializing(true);
      const storedHistory = localStorage.getItem(`chatHistory_${chatId}`);

      if (storedHistory) {
        try {
          const parsed = JSON.parse(storedHistory);
          setHistory(parsed);
        } catch (e) {
          console.error("Failed to parse history", e);
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
      setIsInitializing(false);

      setTimeout(() => scrollToBottom("smooth"), 1000);
    };

    loadHistory();
  }, [chatId]);

  const saveToHistory = (newHistoryItems) => {
    const updatedHistory = [...history, ...newHistoryItems];
    setHistory(updatedHistory);
    localStorage.setItem(
      `chatHistory_${chatId}`,
      JSON.stringify(updatedHistory),
    );
    return updatedHistory;
  };

  const handleSendMessage = async () => {
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    const timestamp = new Date().toISOString();

    setQuery("");
    setIsLoading(true);
    const userMessage = {
      role: "user",
      content: currentQuery,
      timestamp,
    };

    const optimisticHistory = saveToHistory([userMessage]);

    try {
      const apiCall = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot/message/${workflowId}`,
        {
          Message: currentQuery,
          queryId: chatId,
        },
        { timeout: 300000 },
      );

      if (!apiCall.data.success) {
        const errorMessage = {
          role: "assistant",
          content: apiCall.data.message || "Failed to fetch response.",
          timestamp: new Date().toISOString(),
          isError: true,
        };
        saveToHistory([errorMessage]);
        toast.error("Response failed");
        return;
      }

      const botResponse = apiCall.data.value.Message;

      const botMessage = {
        role: "assistant",
        content: botResponse || "No response generated.",
        timestamp: new Date().toISOString(),
      };

      const finalHistory = [...optimisticHistory, botMessage];
      setHistory(finalHistory);
      localStorage.setItem(
        `chatHistory_${chatId}`,
        JSON.stringify(finalHistory),
      );

      updateSessionList(chatId, currentQuery, workflowId);
    } catch (error) {
      console.error(error);

      const crashMessage = {
        role: "assistant",
        content: "Chat failed to process due to a network or server error.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      saveToHistory([crashMessage]);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionList = (id, firstMessage, wfId) => {
    const allSessionsStr = localStorage.getItem("chatSessions");
    let allSessions = allSessionsStr ? JSON.parse(allSessionsStr) : [];
    const exists = allSessions.find((s) => s.id === id);

    if (!exists) {
      const newSession = {
        id,
        workflowId: wfId,
        name: firstMessage,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        "chatSessions",
        JSON.stringify([newSession, ...allSessions]),
      );
    }
  };

  if (isInitializing) return null;

  return (
    <div className="flex flex-col h-full w-full relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full hide-scroll"
      >
        <div className="max-w-3xl mx-auto w-full p-4 pb-0 flex flex-col gap-6 min-h-0">
          <MessageList history={history} isLoading={isLoading} />
        </div>
      </div>

      <div className="w-full p-4 pt-2">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
