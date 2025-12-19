// "use client";

// import axios from "axios";
// import { toast } from "sonner";
// import { ArrowUp, User, Bot } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import MarkdownRenderer from "@/components/ui/markdownRenderer";

// export default function ChatHistory({ chatId, workflowId }) {
//   const [query, setQuery] = useState("");
//   const [history, setHistory] = useState([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isInitializing, setIsInitializing] = useState(true);

//   const scrollContainerRef = useRef(null);

//   const scrollToBottom = () => {
//     if (scrollContainerRef.current) {
//       scrollContainerRef.current.scrollTo({
//         top: scrollContainerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [history, isLoading]);

//   useEffect(() => {
//     const loadHistory = () => {
//       setIsInitializing(true);

//       const storedHistory = localStorage.getItem(`chatHistory_${chatId}`);

//       if (storedHistory) {
//         try {
//           setHistory(JSON.parse(storedHistory));
//         } catch (e) {
//           console.error("Failed to parse history", e);
//           setHistory([]);
//         }
//       } else {
//         setHistory([]);
//       }
//       setIsInitializing(false);
//     };

//     loadHistory();
//   }, [chatId]);

//   const handleSendMessage = async () => {
//     if (!query.trim() || isLoading) return;

//     const currentQuery = query;
//     setQuery("");
//     setIsLoading(true);

//     const optimisticHistory = [
//       ...history,
//       { role: "user", content: currentQuery },
//     ];

//     setHistory(optimisticHistory);

//     try {
//       const apiCall = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_URL}/chatbot/message/${workflowId}`,
//         {
//           Message: currentQuery,
//           queryId: chatId,
//         },
//         { timeout: 300000 }
//       );

//       if (!apiCall.data.success) {
//         toast.error(apiCall.data.message || "Failed to fetch response");
//         setIsLoading(false);

//         return;
//       }

//       const botResponse = apiCall.data.value.Message;

//       const newHistory = [
//         ...optimisticHistory,
//         {
//           role: "assistant",
//           content: botResponse || "No response generated.",
//         },
//       ];

//       setHistory(newHistory);

//       localStorage.setItem(`chatHistory_${chatId}`, JSON.stringify(newHistory));

//       updateSessionList(chatId, currentQuery, workflowId);
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateSessionList = (id, firstMessage, wfId) => {
//     const allSessionsStr = localStorage.getItem("chatSessions");
//     let allSessions = allSessionsStr ? JSON.parse(allSessionsStr) : [];

//     const exists = allSessions.find((s) => s.id === id);

//     if (!exists) {
//       const newSession = {
//         id,
//         workflowId: wfId,
//         name: firstMessage,
//         timestamp: new Date().toISOString(),
//       };

//       const updatedSessions = [newSession, ...allSessions];
//       localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   if (isInitializing) {
//     return null;
//   }

//   return (
//     <div className="flex flex-col h-full w-full max-w-3xl mx-auto p-4 relative">
//       <div className="flex-1 relative overflow-hidden mb-4">
//         <div
//           ref={scrollContainerRef}
//           className="absolute inset-0 overflow-y-auto hide-scroll flex flex-col gap-6 py-4"
//         >
//           {history.length > 0 &&
//             history.map((message, index) => {
//               const isUser = message.role === "user";

//               return (
//                 <div
//                   key={index}
//                   className={`flex gap-4 ${
//                     isUser ? "flex-row-reverse" : "flex-row"
//                   }`}
//                 >
//                   <div className="shrink-0 mt-1">
//                     <div
//                       className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                         isUser ? "bg-foreground/10" : "bg-primary/10"
//                       }`}
//                     >
//                       {isUser ? <User size={16} /> : <Bot size={16} />}
//                     </div>
//                   </div>

//                   <div
//                     className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm ${
//                       isUser
//                         ? "bg-foreground/5 text-foreground"
//                         : "bg-background text-foreground"
//                     }`}
//                   >
//                     {isUser ? (
//                       message.content
//                     ) : (
//                       <MarkdownRenderer content={message.content} />
//                     )}
//                   </div>
//                 </div>
//               );
//             })}

//           {isLoading && (
//             <div className="flex gap-4">
//               <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                 <Bot size={16} />
//               </div>

//               <div className="flex items-center gap-1 bg-background px-4 py-3">
//                 <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
//                 <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
//                 <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="w-full relative">
//         <div className="relative flex items-end w-full border border-foreground/30 rounded-lg bg-background shadow-sm focus-within:ring-1 ring-ring">
//           <Textarea
//             rows={1}
//             value={query}
//             disabled={isLoading}
//             onKeyDown={handleKeyDown}
//             placeholder="Ask anything..."
//             onChange={(e) => setQuery(e.target.value)}
//             style={{ height: "auto", minHeight: "56px", resize: "none" }}
//             className="w-full border-0 focus-visible:ring-0 min-h-12.5 max-h-50 resize-none py-3 px-4 bg-transparent"
//             onInput={(e) => {
//               e.target.style.height = "auto";
//               e.target.style.height = `${e.target.scrollHeight}px`;
//             }}
//           />

//           <div className="pb-2 pr-2">
//             <Button
//               size="icon"
//               onClick={handleSendMessage}
//               className="h-8 w-8 rounded-md"
//               disabled={isLoading || !query.trim()}
//             >
//               {isLoading ? (
//                 <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <ArrowUp className="w-4 h-4" />
//               )}
//             </Button>
//           </div>
//         </div>

//         <p className="text-center text-[10px] text-foreground/40 mt-2">
//           AI generated responses may be inaccurate. Please verify important
//           information.
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import axios from "axios";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export default function ChatHistory({ chatId, workflowId }) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  useEffect(() => {
    const loadHistory = () => {
      setIsInitializing(true);
      const storedHistory = localStorage.getItem(`chatHistory_${chatId}`);

      if (storedHistory) {
        try {
          setHistory(JSON.parse(storedHistory));
        } catch (e) {
          console.error("Failed to parse history", e);
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
      setIsInitializing(false);
    };

    loadHistory();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!query.trim() || isLoading) return;

    const currentQuery = query;
    setQuery("");
    setIsLoading(true);

    const optimisticHistory = [
      ...history,
      { role: "user", content: currentQuery },
    ];

    setHistory(optimisticHistory);

    try {
      const apiCall = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chatbot/message/${workflowId}`,
        {
          Message: currentQuery,
          queryId: chatId,
        },
        { timeout: 300000 }
      );

      if (!apiCall.data.success) {
        toast.error(apiCall.data.message || "Failed to fetch response");
        setIsLoading(false);

        return;
      }

      const botResponse = apiCall.data.value.Message;

      const newHistory = [
        ...optimisticHistory,
        {
          role: "assistant",
          content: botResponse || "No response generated.",
        },
      ];

      setHistory(newHistory);

      localStorage.setItem(`chatHistory_${chatId}`, JSON.stringify(newHistory));
      updateSessionList(chatId, currentQuery, workflowId);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSessionList = (id, firstMessage, wfId) => {
    const allSessionsStr = localStorage.getItem("chatSessions");

    let allSessions = allSessionsStr ? JSON.parse(allSessionsStr) : [];

    const exists = allSessions.find((s) => s.id === id);

    if (!exists) {
      const newSession = {
        id,
        workflowId: wfId,
        name: firstMessage,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        "chatSessions",
        JSON.stringify([newSession, ...allSessions])
      );
    }
  };

  if (isInitializing) return null;

  return (
    <div className="flex flex-col h-full w-full relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full hide-scroll"
      >
        <div className="max-w-3xl mx-auto w-full p-4 pb-0 flex flex-col gap-6 min-h-0">
          <MessageList history={history} isLoading={isLoading} />
        </div>
      </div>

      <div className="w-full p-4 pt-2">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput
            query={query}
            setQuery={setQuery}
            isLoading={isLoading}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
