"use client";

import { useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import { Search, LoaderCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const SearchDialog = ({
  open,
  setOpen,
  onSelect,
  searchValue,
  results = [],
  setSearchValue,
  loading = false,
  placeholder = "Search...",
}) => {
  const router = useRouter();

  const filteredResults = useMemo(() => {
    if (!searchValue.trim()) return results;

    const query = searchValue.toLowerCase();
    return results.filter(
      (result) =>
        result?.title?.toLowerCase().includes(query) ||
        result?.description?.toLowerCase().includes(query)
    );
  }, [searchValue, results]);

  const groupedResults = useMemo(() => {
    const groups = {};

    filteredResults.forEach((result) => {
      const category = result.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(result);
    });

    return groups;
  }, [filteredResults]);

  const handleSelect = useCallback(
    (result) => {
      if (!result?.redirect) {
        return;
      }

      onSelect?.(result);

      try {
        router.push(result.redirect);
      } catch (err) {
        console.error("Navigation error:", err);
      }

      setOpen(false);
      setSearchValue("");
    },
    [onSelect, router, setOpen, setSearchValue]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchValue("");
      }
    },
    [setOpen, setSearchValue]
  );

  const handleOpenChange = useCallback(
    (newOpen) => {
      setOpen(newOpen);

      if (!newOpen) {
        setSearchValue("");
      }
    },
    [setOpen, setSearchValue]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 sm:rounded-lg sm:before:rounded-lg overflow-hidden"
      >
        <DialogTitle className="sr-only">Search Chats</DialogTitle>

        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search
            className="size-4 text-muted-foreground shrink-0"
            aria-hidden="true"
          />

          <Input
            autoFocus
            value={searchValue}
            placeholder={placeholder}
            onChange={(e) => setSearchValue(e.target.value)}
            className="border-0 focus-visible:ring-0 px-0 rounded-sm shadow-none h-auto text-sm"
          />
        </div>

        <div className="max-h-72 overflow-y-auto" role="listbox">
          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <LoaderCircle
                className="size-6 animate-spin text-primary"
                aria-hidden="true"
              />

              <p className="text-sm text-muted-foreground">
                Loading results...
              </p>
            </div>
          ) : Object.keys(groupedResults).length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-muted-foreground">
                {searchValue.trim()
                  ? "No results found."
                  : "Start typing to search..."}
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} role="group" aria-label={category}>
                <div className="px-4 py-2 text-[10px] font-semibold text-muted-foreground bg-muted/50 uppercase tracking-wider">
                  {category}
                </div>

                {items.map((result) => (
                  <button
                    role="option"
                    key={result.id}
                    aria-selected="false"
                    onClick={() => handleSelect(result)}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0 focus:outline-none focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring cursor-pointer"
                  >
                    <div className="flex items-center gap-3 text-sm text-foreground/70">
                      <span
                        className="shrink-0 [&_svg]:size-4"
                        aria-hidden="true"
                      >
                        {result.icon}
                      </span>

                      <span className="font-medium truncate">
                        {result.title}
                      </span>
                    </div>

                    {result.description && (
                      <p className="text-xs text-muted-foreground mt-1 ml-7 line-clamp-1">
                        {result.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
