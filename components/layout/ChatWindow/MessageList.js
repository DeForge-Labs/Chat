import MarkdownRenderer from "@/components/ui/markdownRenderer";

export default function MessageList({ history, isLoading }) {
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
                    ? "bg-foreground/15 text-foreground"
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
        <div className="flex w-full justify-start">
          <div className="flex items-center gap-1 px-0 py-3">
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
    </div>
  );
}
