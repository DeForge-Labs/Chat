"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, PanelRight, PanelLeft } from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import ChatList from "./ChatList";
import SearchButton from "./SearchButton";

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="w-full h-9" />
      ))}
    </div>
  );
};

const AccordionSection = ({ title, children }) => {
  return (
    <Accordion className="w-full overflow-hidden">
      <AccordionItem className="overflow-hidden">
        <AccordionTrigger
          className="font-normal text-foreground/60 text-xs py-0"
          size="xs"
        >
          {title}
        </AccordionTrigger>

        <AccordionPanel className="mt-2 overflow-y-auto max-h-[calc(100vh-280px)] hide-scroll">
          <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const Sidebar = ({ workflowId, status }) => {
  const params = useParams();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeId = params?.chatId || params?.id || null;

  return (
    <motion.aside
      initial={{ width: "240px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      animate={{ width: isCollapsed ? "60px" : "240px" }}
      className="bg-foreground/5 justify-between relative p-2 px-0 flex h-screen flex-col border-r border-foreground/10 overflow-hidden"
    >
      <div className="px-2 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between py-2 mb-4 h-10">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Logo
                  size={16}
                  padding="p-1.5"
                  shadow="shadow-md"
                  rounded="rounded-sm"
                />

                <Separator
                  orientation="vertical"
                  className="dark:bg-foreground/30 h-5"
                />

                <span className="flex items-center gap-1 text-white whitespace-nowrap">
                  Chat
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`h-8 w-8 hover:bg-foreground/10 ${
              isCollapsed ? "mx-auto" : ""
            }`}
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4 text-foreground/70" />
            ) : (
              <PanelRight className="h-4 w-4 text-foreground/70" />
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-0.5 relative">
          <Link
            href={`/?workflowId=${workflowId}&status=${status}`}
            className="w-full mb-1"
          >
            <Button
              variant="outline"
              className={`flex gap-2 font-normal text-xs border border-foreground/20 rounded-sm hover:bg-foreground/10 ${
                isCollapsed
                  ? "w-10 px-0 justify-center mx-auto"
                  : "w-full justify-start"
              }`}
            >
              <Plus className="h-4 w-4 shrink-0" />

              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  New Chat
                </motion.span>
              )}
            </Button>
          </Link>

          <div className={isCollapsed ? "mx-auto" : ""}>
            <SearchButton
              workflowId={workflowId}
              status={status}
              isCollapsed={isCollapsed}
            />
          </div>

          <div className="px-2 my-2 flex justify-center">
            <Separator
              orientation="horizontal"
              className={`bg-foreground/10 ${
                isCollapsed ? "w-full" : "w-[80%]"
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AccordionSection title="Recent Chats">
                <ChatList
                  status={status}
                  activeId={activeId}
                  workflowId={workflowId}
                />
              </AccordionSection>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-col mx-2 px-2 p-2 bg-foreground/5 rounded-sm border border-foreground/20 space-y-1 whitespace-nowrap"
          >
            <div className="font-semibold text-foreground/50 text-[10px]">
              New Update
            </div>

            <div className="text-xs text-foreground/70 truncate">
              Full UI Overhaul and Chat...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};

export default Sidebar;
