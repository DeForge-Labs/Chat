"use client";

import React, { memo, useEffect, useState } from "react";
import { Streamdown } from "streamdown";
import { useTheme } from "next-themes";

const MarkdownRenderer = ({ content, isAnimating = false }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentShikiTheme =
    mounted && resolvedTheme === "dark"
      ? ["dracula", "dracula"]
      : ["github-light", "github-light"];

  return (
    <div className="w-full text-foreground/90 leading-relaxed break-words relative">
      <style jsx global>{`
        /* Force newlines to be respected */
        [data-streamdown="code-block"] pre,
        [data-streamdown="code-block"] code {
          white-space: pre !important;
          overflow-x: auto !important;
          font-family: monospace !important;
        }

        /* Container Styling */
        [data-streamdown="code-block"] {
          background-color: ${mounted && resolvedTheme === "dark"
            ? "#1e1e1e"
            : "#f6f8fa"} !important;
          border: 1px solid
            ${mounted && resolvedTheme === "dark" ? "#30363d" : "#d0d7de"} !important;
          border-radius: 0.5rem;
          margin: 1rem 0;
          width: 100%;
        }

        /* Pad the inner code area */
        [data-streamdown="code-block"] pre {
          padding: 1rem !important;
        }

        /* Fix Inline Code (e.g. variable names) */
        [data-streamdown="inline-code"] {
          background-color: rgba(125, 125, 125, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }
      `}</style>

      <Streamdown
        shikiTheme={currentShikiTheme}
        controls={{ code: true, table: true }}
        isAnimating={isAnimating}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 mb-4 space-y-1">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 mb-4 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-foreground/20 pl-4 italic my-4 text-foreground/60">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-500 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src || "/placeholder.svg"}
              alt={alt}
              className="rounded-lg my-4 w-full max-w-full"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 border border-foreground/10 rounded-lg">
              <table className="w-full text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-foreground/5 text-foreground/80">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="p-3 font-semibold border-b border-foreground/10 whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-3 border-b border-foreground/10 text-foreground/70 align-top">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </Streamdown>
    </div>
  );
};

export default memo(MarkdownRenderer);
