"use client";

import { Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { setCurrentSessionId } from "@/redux/slice/chatSlice";

export default function ChatList() {
  const chatSessions = useSelector((state) => state.chat.chatSessions);
  const dispatch = useDispatch();

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
          className="flex items-center bg-black/5 text-sm justify-start gap-2 px-4 py-2 rounded-lg"
        >
          <Icon icon="majesticons:chat-line" className="w-4 h-4" />
          {chatSession.name
            ? chatSession.name.length > 15
              ? chatSession.name.slice(0, 15) + "..."
              : chatSession.name
            : "New Chat"}
        </Button>
      ))}
    </div>
  );
}
