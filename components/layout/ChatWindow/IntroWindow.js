"use client";

import { useSelector } from "react-redux";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setChatQuery } from "@/redux/slice/chatSlice";
import useChat from "@/hooks/useChat";

export default function IntroWindow() {
  const chatQuery = useSelector((state) => state.chat.chatQuery);
  const dispatch = useDispatch();
  const isChatLoading = useSelector((state) => state.chat.isChatLoading);
  const { startNewChat } = useChat();

  const handleChatQueryChange = (e) => {
    dispatch(setChatQuery(e.target.value));
  };

  return (
    <>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2">
          <Image
            src="/logo/logo-black.svg"
            alt="Logo"
            width={32}
            height={32}
            className="hover:scale-110 transition duration-200"
          />
          <p className="text-4xl font-bold">Chat</p>
        </div>
        <div className="text-black/60 text-xs">
          by <span className="font-bold">Deforge</span>
        </div>
      </div>

      <div className="w-full flex items-center gap-2">
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
          onPress={() => {
            startNewChat();
          }}
          className="flex items-center justify-start bg-black text-background rounded-full gap-2 p-4"
        >
          {isChatLoading ? (
            <Icon icon="lucide:loader" className="w-5 h-5 animate-spin" />
          ) : (
            <Icon icon="lucide:plus" className="w-5 h-5" />
          )}
        </Button>
      </div>

      <div className="w-full flex items-center justify-center gap-2">
        <p className="text-black/60 text-xs text-center w-[350px]">
          The response are generated in real-time and might not be accurate.
          Make sure to double check the response.
        </p>
      </div>
    </>
  );
}
