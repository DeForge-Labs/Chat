"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownRenderer({ content }) {

  const [copiedCode, setCopiedCode] = React.useState(null);
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      })
      .catch((err) => console.error('Failed to copy code: ', err));
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          return !inline && match ? (
            <div className="relative group">
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-md"
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
              <button
                onClick={() => handleCopy(codeString)}
                className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                {copiedCode === codeString ? "Copied!" : "Copy"}
              </button>
            </div>
          ) : (
            <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-medium mt-4 mb-2">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-7">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-primary hover:underline"
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
            className="rounded-lg my-4 w-full"
          />
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-border">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted p-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border p-2">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
