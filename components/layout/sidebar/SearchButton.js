"use client";

import { useRouter } from "next/navigation";
import { Search, MessageSquare } from "lucide-react";
import React, { useState, useCallback, useMemo, useEffect } from "react";

import SearchDialog from "./SearchDialog";

import { Button } from "@/components/ui/button";

const SearchButton = ({
  status,
  workflowId,
  isCollapsed,
  buttonLabel = "Search",
  placeholder = "Search chats...",
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [searchValue, setSearchValue] = useState("");
  const [localSessions, setLocalSessions] = useState([]);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("chatSessions");

      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const filtered = parsed.filter((s) => s.workflowId === workflowId);

          setLocalSessions(filtered);
        } catch (e) {
          console.error("Error parsing sessions", e);
          setLocalSessions([]);
        }
      }
    }
  }, [open, workflowId]);

  const initialQuickActions = useMemo(
    () => [
      {
        id: "new-chat",
        category: "Actions",
        title: "Start New Chat",
        icon: <Search className="size-4" />,
        description: "Create a new AI agent workflow",
        redirect: `/?workflowId=${workflowId}${
          status ? `&status=${status}` : ""
        }`,
      },
    ],
    [workflowId, status]
  );

  const results = useMemo(() => {
    const sessionResults = localSessions.map((session) => ({
      id: session.id,
      category: "Recent Chats",
      title: session.name || "Untitled Chat",
      icon: <MessageSquare className="size-4" />,
      redirect: `/${session.id}?workflowId=${workflowId}${
        status ? `&status=${status}` : ""
      }`,
      description: `Chat created on ${new Date(
        session.timestamp
      ).toLocaleDateString()}`,
    }));

    return [...initialQuickActions, ...sessionResults];
  }, [localSessions, initialQuickActions, workflowId, status]);

  const handleOpenDialog = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSelect = (result) => {
    if (result.redirect) {
      router.push(result.redirect);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpenDialog}
        aria-label="Open search"
        className={`flex gap-2 bg-background font-normal shadow-sm hover:bg-foreground/5 dark:bg-transparent rounded-sm border border-foreground/20 text-xs text-foreground/60 h-9 transition-all duration-200 ${
          isCollapsed
            ? "w-10 px-0 justify-center border-none bg-transparent shadow-none"
            : "w-full justify-start px-3"
        }`}
      >
        <Search size={14} aria-hidden="true" />
        {!isCollapsed && <span>{buttonLabel}</span>}
      </Button>

      <SearchDialog
        open={open}
        loading={false}
        setOpen={setOpen}
        results={results}
        onSelect={handleSelect}
        placeholder={placeholder}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
    </>
  );
};

export default React.memo(SearchButton);
