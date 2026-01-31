"use client";

import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import MarkdownRenderer from "@/components/ui/markdownRenderer";

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const CopyButton = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-foreground/10 rounded-md transition-colors text-foreground/40 hover:text-foreground"
      title="Copy message"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
};

const MessageList = ({ history, isLoading }) => {
  return (
    <div className="flex flex-col gap-6 py-4">
      {history.length > 0 &&
        history.map((message, index) => {
          const isUser = message.role === "user";
          const isError = message.isError;

          return (
            <div
              key={index}
              className={`flex w-full flex-col ${
                isUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-5 py-3 text-sm leading-relaxed relative ${
                  isUser
                    ? "bg-foreground/5 text-foreground rounded-br-sm"
                    : isError
                      ? "bg-red-500/10 text-red-500 border rounded-bl-sm border-red-500/20"
                      : "bg-transparent text-foreground !px-0"
                }`}
              >
                {isError && (
                  <div className="flex items-center gap-2 mb-2 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Error</span>
                  </div>
                )}

                {isUser ? (
                  message.content
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>

              <div
                className={`flex items-center gap-2 mt-1 px-1 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <span className="text-[10px] text-foreground/40 select-none">
                  {message.timestamp
                    ? formatTime(message.timestamp)
                    : formatTime(new Date().toISOString())}
                </span>
                <CopyButton content={message.content} />
              </div>
            </div>
          );
        })}

      {isLoading && (
        <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3 px-1 py-2">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/50 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-foreground/50"></span>
            </div>

            <span className="text-sm font-medium text-foreground/50 animate-pulse">
              Thinking...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
