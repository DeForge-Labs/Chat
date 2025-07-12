"use client";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center w-[60%] gap-8">
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
          />

          <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-start bg-black text-background rounded-full gap-2 p-4"
          >
            <Icon icon="lucide:plus" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
