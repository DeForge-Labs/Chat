"use client";

import axios from "axios";
import Image from "next/image";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const IntroWindow = ({ workflowId, status }) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");

  const placeholders = [
    "Test how the agent responds to a customer question",
    "Simulate an email summary workflow",
    "Verify competitor price tracking logic",
    "Check meeting scheduling behavior",
  ];

  useEffect(() => {
    if (query) return;

    const currentText = placeholders[placeholderIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentText.length) {
            setCurrentPlaceholder(currentText.slice(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (charIndex > 0) {
            setCurrentPlaceholder(currentText.slice(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setPlaceholderIndex((placeholderIndex + 1) % placeholders.length);
          }
        }
      },

      isDeleting ? 30 : 50
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex, placeholders, query]);

  const handleStartChat = async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    const sessionId = uuidv4();
    const currentQuery = query;

    try {
      const apiCall = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot/message/${workflowId}`,
        {
          Message: currentQuery,
          queryId: sessionId,
        },
        { timeout: 300000 }
      );

      if (!apiCall.data.success) {
        toast.error(apiCall.data.message || "Failed to start chat");
        setIsLoading(false);
        return;
      }

      const response = apiCall.data.value.Message;

      const newHistory = [
        { role: "user", content: currentQuery },
        { role: "assistant", content: response || "No response generated." },
      ];

      localStorage.setItem(
        `chatHistory_${sessionId}`,
        JSON.stringify(newHistory)
      );

      const allSessionsStr = localStorage.getItem("chatSessions");
      const allSessions = allSessionsStr ? JSON.parse(allSessionsStr) : [];

      const newSession = {
        id: sessionId,
        name: currentQuery,
        workflowId,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(
        "chatSessions",
        JSON.stringify([newSession, ...allSessions])
      );

      router.push(
        `/${sessionId}?workflowId=${workflowId}&status=${status || ""}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleStartChat();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center pt-32 sm:pt-48 relative w-full">
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full h-full flex items-center justify-center pointer-events-none z-0">
        <Image
          priority
          alt="logo"
          width={400}
          height={400}
          src="/logo/logo-black.svg"
          className="opacity-30 dark:invert"
        />
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-t from-background via-background to-background/5 pointer-events-none z-0"></div>

      <div className="z-10 flex flex-col gap-2 items-center w-full px-4">
        <h1 className="text-3xl text-foreground/80 font-bold text-center">
          Test Your Workflow
        </h1>

        <p className="text-center max-w-lg text-sm text-foreground/60 mb-6">
          Run your agent in a test environment to verify logic, responses, and
          data flow before deployment.
        </p>

        <div className="relative w-full max-w-150 min-w-75">
          <Textarea
            value={query}
            disabled={isLoading}
            onKeyDown={handleKeyDown}
            style={{ resize: "none" }}
            placeholder={currentPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-foreground/30 rounded-lg h-32 p-4 text-base resize-none shadow-sm focus-visible:ring-1 bg-background"
          />

          <Button
            onClick={handleStartChat}
            disabled={isLoading || !query.trim()}
            className="absolute bottom-3 right-3 rounded-md p-2 h-9 w-9"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-center mt-4 w-full max-w-150">
          <p className="text-foreground/60 text-xs text-center w-87.5">
            The response are generated in real-time and might not be accurate.
            Make sure to double check the response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroWindow;
