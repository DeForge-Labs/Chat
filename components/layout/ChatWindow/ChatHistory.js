"use client";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import useChat from "@/hooks/useChat";
import { setChatQuery } from "@/redux/slice/chatSlice";
import MarkdownRenderer from "@/components/ui/markdownRenderer";
import { useEffect, useRef } from "react";

export default function ChatHistory() {
  const chatQuery = useSelector((state) => state.chat.chatQuery);
  const dispatch = useDispatch();
  const isChatLoading = useSelector((state) => state.chat.isChatLoading);
  const { addChat } = useChat();
  const chatHistory = useSelector((state) => state.chat.currentSessionHistory);
  const currentProcessingSessionId = useSelector(
    (state) => state.chat.currentProcessingSessionId
  );
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);

  // Ref for the scrollable container
  const scrollContainerRef = useRef(null);

  // Auto-scroll to bottom function with smooth scrolling
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll when chat history changes or when loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isChatLoading, currentProcessingSessionId]);

  // Initial scroll to bottom when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleChatQueryChange = (e) => {
    dispatch(setChatQuery(e.target.value));
  };

  return (
    <div className="flex flex-col w-[90%] sm:w-[80%] md:w-[60%] h-full justify-center py-8 items-center min-w-[300px] mx-4">
      <div className="flex-1 relative h-full w-full">
        <div
          ref={scrollContainerRef}
          className="absolute top-0 left-0 w-full h-full flex flex-col gap-6 pb-8 overflow-y-auto hide-scroll"
        >
          {chatHistory &&
            chatHistory.map((message, index) => {
              if (message.role === "user") {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-end gap-2"
                  >
                    <p className="bg-black/5 rounded-full px-6 text-sm text-black/70 p-4">
                      {message.content}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="gap-2">
                    <MarkdownRenderer content={message.content} />
                  </div>
                );
              }
            })}
          {currentProcessingSessionId &&
            isChatLoading &&
            currentProcessingSessionId === currentSessionId && (
              <div className="bg-black/5 rounded-full px-6 text-sm text-black/70 p-4 w-fit">
                <Icon icon="svg-spinners:3-dots-bounce" className="w-5 h-5" />
              </div>
            )}
        </div>
      </div>
      <form
        className="w-full flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addChat(chatQuery);
        }}
      >
        <Input
          placeholder="Ask me anything..."
          className="border flex-1 border-black/50 rounded-full text-lg bg-black/5 px-4 py-2 w-full"
          variant="outline"
          isClearable
          value={chatQuery}
          onChange={handleChatQueryChange}
          onClear={() => {
            dispatch(setChatQuery(""));
          }}
          isDisabled={isChatLoading}
        />
        <Button
          variant="outline"
          size="icon"
          isDisabled={isChatLoading || !chatQuery}
          type="submit"
          className="flex items-center justify-start bg-black text-background rounded-full gap-2 p-4"
        >
          {isChatLoading ? (
            <Icon icon="lucide:loader" className="w-5 h-5 animate-spin" />
          ) : (
            <Icon icon="lucide:arrow-up" className="w-5 h-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
