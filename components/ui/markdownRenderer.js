"use client";

import React, { memo } from "react";
import { Streamdown } from "streamdown";

const MarkdownRenderer = ({ content, isAnimating = false }) => {
  return (
    <div className="w-full text-foreground/90 leading-relaxed wrap-break-word">
      <Streamdown
        controls={{
          code: true,
          table: true,
        }}
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
