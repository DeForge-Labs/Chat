"use client";
import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setCurrentSessionId } from "@/redux/slice/chatSlice";
import ChatList from "./ChatList";
import SearchButton from "./SearchButton";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isExpanding, setIsExpanding] = React.useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    if (isCollapsed) {
      setIsExpanding(true);
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      className="bg-black/5 border-black/20 border-r flex flex-col"
      initial={false}
      animate={{
        width: isCollapsed ? "54px" : "256px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        className="flex p-4 w-full items-center justify-between h-[66px]"
        style={{
          paddingLeft: isCollapsed ? "0.6rem" : "1rem",
          paddingRight: isCollapsed ? "0.6rem" : "1rem",
        }}
      >
        <div className="flex items-center gap-2 h-[32px]">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="logo"
                initial={isExpanding ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{
                  duration: isExpanding ? 0.3 : 0,
                  delay: isExpanding ? 0.1 : 0,
                }}
                onAnimationComplete={() => setIsExpanding(false)}
              >
                <Image
                  src="/logo/logo-black.svg"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="hover:scale-110 transition duration-200"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <Button
              variant="outline"
              size="icon"
              onPress={toggleSidebar}
              className="rounded-lg p-2 hover:bg-black/10"
            >
              <Icon
                icon="lucide:panel-right"
                className="text-black/60 text-lg"
              />
            </Button>
          )}

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                key="chat-text"
                className="font-bold inline-block text-2xl"
                initial={isExpanding ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{
                  duration: isExpanding ? 0.3 : 0,
                  delay: isExpanding ? 0.2 : 0,
                }}
              >
                Chat
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              key="collapse-button"
              initial={isExpanding ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{
                duration: isExpanding ? 0.3 : 0,
                delay: isExpanding ? 0.1 : 0,
              }}
            >
              <Button
                variant="outline"
                size="icon"
                onPress={toggleSidebar}
                className="rounded-lg p-2 hover:bg-black/10"
              >
                <Icon
                  icon="lucide:panel-right"
                  className="text-black/60 text-lg"
                />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col px-2 text-sm text-black/60">
        <Button
          variant="outline"
          size="icon"
          onPress={() => {
            dispatch(setCurrentSessionId(null));
          }}
          className="flex items-center justify-start gap-2 p-2 py-2 rounded-lg"
        >
          <Icon icon="lucide:message-circle-plus" className="w-5 h-5" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.p
                key="new-chat-text"
                initial={isExpanding ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{
                  duration: isExpanding ? 0.3 : 0,
                  delay: isExpanding ? 0.3 : 0,
                }}
              >
                New Chat
              </motion.p>
            )}
          </AnimatePresence>
        </Button>

        <SearchButton isCollapsed={isCollapsed} isExpanding={isExpanding} />
      </div>

      {!isCollapsed && (
        <div className="border border-t border-black/10 mx-6 my-4"></div>
      )}

      {!isCollapsed && <ChatList />}
    </motion.div>
  );
}
