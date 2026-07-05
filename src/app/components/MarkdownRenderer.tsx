"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg border border-border bg-[var(--code-bg)] p-4 text-sm leading-relaxed">
              {children}
            </pre>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="rounded bg-[var(--code-inline-bg)] px-1.5 py-0.5 text-sm font-mono text-[var(--code-inline-color)]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
