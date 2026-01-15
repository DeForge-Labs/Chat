"use client";

import MarkdownRenderer from "@/components/ui/markdownRenderer";

const MessageList = ({ history, isLoading }) => {
  return (
    <div className="flex flex-col gap-6 py-4">
      {history.length > 0 &&
        history.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`flex w-full ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  isUser
                    ? "bg-foreground/5 text-foreground"
                    : "bg-transparent text-foreground px-0"
                }`}
              >
                {isUser ? (
                  message.content
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
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
