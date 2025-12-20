"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, PanelRight, PanelLeft, Sun, Moon } from "lucide-react";

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

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-2">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="w-full h-9" />
    ))}
  </div>
);

const AccordionSection = ({ title, children }) => (
  <Accordion defaultValue={["section-1"]} className="w-full overflow-hidden">
    <AccordionItem className="overflow-hidden" value="section-1">
      <AccordionTrigger
        size="xs"
        className="font-normal text-foreground/60 text-xs py-0"
      >
        {title}
      </AccordionTrigger>

      <AccordionPanel className="mt-2 overflow-y-auto max-h-[calc(100vh-280px)] hide-scroll">
        <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

const FooterControls = ({ isCollapsed, workflowId, status }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-12" />;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isCollapsed) {
    return (
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleTheme}
        className="mx-auto h-10 w-10 rounded-xl bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-all"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-linear-to-br from-foreground/5 to-foreground/0 p-1.5 pr-2 shadow-sm">
      <div className="flex items-center pl-1">
        <Logo
          size={14}
          padding="p-1.5"
          shadow="shadow-none"
          bgColor="bg-transparent"
          className="invert dark:invert-0"
          href={`/?workflowId=${workflowId}&status=${status}`}
        />

        <div className="flex flex-col leading-none space-y-1">
          <span className="text-sm font-bold text-foreground tracking-tight">
            Deforge
          </span>
        </div>
      </div>

      <div className="flex h-8 items-center rounded-lg bg-foreground/5 p-1 ring-1 ring-inset ring-foreground/5">
        {["light", "dark"].map((mode) => {
          const isActive = theme === mode;
          return (
            <button
              key={mode}
              onClick={() => setTheme(mode)}
              className={`relative flex h-full w-8 cursor-pointer items-center justify-center rounded-md transition-all ${
                isActive
                  ? "text-foreground"
                  : "text-foreground/40 hover:text-foreground/70"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-theme"
                  className="absolute inset-0 rounded-md bg-background shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <span className="relative z-10">
                {mode === "light" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SidebarHeader = ({ isCollapsed, setIsCollapsed, workflowId, status }) => (
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
            href={`/?workflowId=${workflowId}&status=${status}`}
          />

          <Separator
            orientation="vertical"
            className="dark:bg-foreground/30 h-5"
          />

          <span className="flex items-center gap-1 text-black font-bold dark:text-white whitespace-nowrap">
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
);

const SidebarActions = ({ isCollapsed, workflowId, status }) => (
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
        className={`bg-foreground/10 ${isCollapsed ? "w-full" : "w-[80%]"}`}
      />
    </div>
  </div>
);

const Sidebar = ({ workflowId, status }) => {
  const params = useParams();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeId = params?.chatId || params?.id || null;

  return (
    <motion.aside
      initial={{ width: "240px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      animate={{ width: isCollapsed ? "60px" : "240px" }}
      className="bg-foreground/5 justify-between relative p-2 px-0 flex h-screen flex-col overflow-hidden"
    >
      <div className="px-2 flex flex-col flex-1 overflow-hidden">
        <SidebarHeader
          status={status}
          workflowId={workflowId}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <SidebarActions
          status={status}
          workflowId={workflowId}
          isCollapsed={isCollapsed}
        />

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

      <div className="p-2 pb-0.5 mt-auto">
        <FooterControls
          status={status}
          workflowId={workflowId}
          isCollapsed={isCollapsed}
        />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
