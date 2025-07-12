"use client";

import { Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { setCurrentSessionId } from "@/redux/slice/chatSlice";

export default function ChatList() {
  const chatSessions = useSelector((state) => state.chat.chatSessions);
  const dispatch = useDispatch();
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);
  const currentProcessingSessionId = useSelector(
    (state) => state.chat.currentProcessingSessionId
  );
  const isChatLoading = useSelector((state) => state.chat.isChatLoading);

  return (
    <div className="flex flex-col gap-2 text-black/70 px-4">
      {chatSessions.map((chatSession) => (
        <Button
          variant="outline"
          size="icon"
          key={chatSession.id}
          onPress={() => {
            dispatch(setCurrentSessionId(chatSession.id));
          }}
          className="flex items-center border border-transparent bg-black/5 text-sm justify-between gap-2 px-4 py-2 rounded-lg"
          style={{
            borderRight:
              currentSessionId === chatSession.id ? "1px solid black" : "",
            borderBottom:
              currentSessionId === chatSession.id ? "1px solid black" : "",
            borderTop:
              currentSessionId === chatSession.id ? "1px solid black" : "",
            borderLeft:
              currentSessionId === chatSession.id ? "1px solid black" : "",
          }}
        >
          <div className="flex items-center gap-2">
            <Icon icon="majesticons:chat-line" className="w-4 h-4" />
            {chatSession.name
              ? chatSession.name.length > 15
                ? chatSession.name.slice(0, 15) + "..."
                : chatSession.name
              : "New Chat"}
          </div>

          {currentProcessingSessionId &&
            isChatLoading &&
            currentProcessingSessionId === chatSession.id && (
              <Icon
                icon="svg-spinners:3-dots-bounce"
                className="w-5 h-5 text-black/70"
              />
            )}
        </Button>
      ))}
    </div>
  );
}
