"use client";

import { useSelector } from "react-redux";
import IntroWindow from "./IntroWindow";
import ChatHistory from "./ChatHistory";

export default function ChatWindow() {
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      {!currentSessionId && <IntroWindow />}
      {currentSessionId && <ChatHistory />}
    </div>
  );
}
