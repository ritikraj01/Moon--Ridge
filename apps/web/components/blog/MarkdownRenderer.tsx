"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div
      className={`[&_a]:text-amber-500 hover:[&_a]:text-amber-400 [&_a]:underline [&_a]:underline-offset-4 [&_p:not(:last-child)]:mb-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_em]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/80 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
