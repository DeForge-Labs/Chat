"use client";
import { setCurrentSessionId } from "@/redux/slice/chatSlice";
import { Modal, ModalContent, ModalBody, Input, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SearchButton({ isCollapsed, isExpanding }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const chatSessions = useSelector((state) => state.chat.chatSessions);
  const [isOpen, setIsOpen] = React.useState(false);
  const [filteredChatSessions, setFilteredChatSessions] = React.useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredChatSessions(chatSessions);
    } else {
      const filtered = chatSessions.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChatSessions(filtered);
    }
  }, [searchTerm, chatSessions]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onPress={() => {
          setIsOpen(true);
        }}
        className="flex items-center justify-start gap-2 p-2 py-2 rounded-lg"
      >
        <Icon icon="lucide:search" className="w-5 h-5" />
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.p
              key="search-chats-text"
              initial={isExpanding ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{
                duration: isExpanding ? 0.3 : 0,
                delay: isExpanding ? 0.4 : 0,
              }}
            >
              Search chats
            </motion.p>
          )}
        </AnimatePresence>
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setIsOpen(false);
        }}
        size="2xl"
        scrollBehavior="inside"
        className="bg-background"
        closeButton={<div></div>}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="flex items-center gap-2 pt-7">
                <Input
                  placeholder="Search chats..."
                  className="border flex-1 border-black/50 rounded-2xl text-lg bg-black/5 px-2 py-2 w-full"
                  variant="outline"
                  startContent={
                    <Icon
                      icon="lucide:search"
                      className="text-lg text-black/60 pointer-events-none flex-shrink-0"
                    />
                  }
                  isClearable
                  value={searchTerm}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  onClear={() => {
                    setSearchTerm("");
                  }}
                />

                <div className="mt-2 mb-2 w-full">
                  {filteredChatSessions && filteredChatSessions.length > 0 ? (
                    <ul className="space-y-3 pb-3">
                      {filteredChatSessions.map((chatSession) => (
                        <Button
                          variant="outline"
                          size="icon"
                          key={chatSession.id}
                          onPress={() => {
                            dispatch(setCurrentSessionId(chatSession.id));
                            onClose();
                          }}
                          className="flex items-center border border-transparent w-full bg-black/5 justify-between gap-2 px-4 py-3 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              icon="majesticons:chat-line"
                              className="w-4 h-4"
                            />
                            {chatSession.name
                              ? chatSession.name.length > 30
                                ? chatSession.name.slice(0, 30) + "..."
                                : chatSession.name
                              : "New Chat"}
                          </div>
                        </Button>
                      ))}
                    </ul>
                  ) : (
                    searchTerm && (
                      <p className="text-center text-default-500 py-3">
                        No results found
                      </p>
                    )
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
