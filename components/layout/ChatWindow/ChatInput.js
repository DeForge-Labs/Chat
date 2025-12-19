import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInput({ query, setQuery, isLoading, onSend }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative flex items-end w-full border border-foreground/15 rounded-xl bg-background shadow-xs focus-within:ring-1 ring-foreground/20 transition-all duration-200">
        <Textarea
          rows={1}
          value={query}
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          onChange={(e) => setQuery(e.target.value)}
          style={{ height: "auto", minHeight: "56px", resize: "none" }}
          className="w-full border-0 shadow-none focus-visible:ring-0 has-focus-visible:ring-0 focus-visible:ring-offset-0 min-h-22 max-h-50 resize-none py-2 px-2 bg-transparent! text-base"
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />

        <div className="pb-3 pr-3">
          <Button
            size="icon"
            onClick={onSend}
            className="h-8 w-8 rounded-lg transition-all"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <div className="w-3 h-3 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <p className="text-center text-[10px] text-foreground/40 mt-3 select-none">
        AI generated responses may be inaccurate. Please verify important
        information.
      </p>
    </div>
  );
}
