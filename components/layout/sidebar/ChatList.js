"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

const ITEM_BASE_CLASSES =
  "w-full justify-start gap-2.5 h-9 px-2.5 text-xs font-normal transition-all duration-200 border-0";

const ITEM_ACTIVE_CLASSES = "bg-foreground/10 text-foreground font-medium";

const ITEM_INACTIVE_CLASSES =
  "bg-transparent text-foreground/60 hover:text-foreground/80 hover:bg-foreground/5";

const ChatList = ({ activeId, workflowId, status }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const storedSessions = localStorage.getItem("chatSessions");

    if (storedSessions) {
      try {
        const parsedSessions = JSON.parse(storedSessions);

        const filteredSessions = parsedSessions.filter(
          (session) => session.workflowId === workflowId
        );

        setSessions(filteredSessions);
      } catch (error) {
        console.error("Failed to parse chat sessions", error);
        setSessions([]);
      }
    } else {
      setSessions([]);
    }
  }, [workflowId, activeId]);

  if (!sessions || sessions.length === 0) {
    return (
      <div className="px-2 py-4 text-center text-xs text-foreground/40 italic">
        No recent history
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 mt-1">
      {sessions.map((session) => {
        const isActive = activeId === session.id;

        return (
          <Link
            key={session.id}
            className="w-full"
            href={`/${session.id}?workflowId=${workflowId}&status=${status}`}
          >
            <Button
              variant="ghost"
              className={`${ITEM_BASE_CLASSES} ${
                isActive ? ITEM_ACTIVE_CLASSES : ITEM_INACTIVE_CLASSES
              }`}
            >
              <MessageSquare
                size={14}
                className={isActive ? "text-foreground" : "text-foreground/40"}
              />

              <span className="truncate w-full text-left">
                {session.name || "Untitled Chat"}
              </span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default ChatList;
