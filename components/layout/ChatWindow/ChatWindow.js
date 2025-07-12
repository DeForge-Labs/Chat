"use client";

import { useSelector } from "react-redux";
import IntroWindow from "./IntroWindow";

export default function ChatWindow() {
  const currentSessionId = useSelector((state) => state.chat.currentSessionId);

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center w-[60%] gap-8">
        {!currentSessionId && <IntroWindow />}
      </div>
    </div>
  );
}
