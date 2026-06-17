"use client";

import { motion } from "framer-motion";
import type { RichTextBlock } from "@/lib/blog-types";

interface Props {
  block: RichTextBlock;
}

export default function RichTextBlock({ block }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="prose prose-invert prose-amber max-w-none mb-6
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg
        prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-em:text-foreground/80
        prose-blockquote:border-l-amber-500 prose-blockquote:text-muted-foreground prose-blockquote:not-italic
        prose-ul:text-foreground/90 prose-ol:text-foreground/90
        prose-li:marker:text-amber-500
        prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground
        [&_mark]:bg-amber-500/30 [&_mark]:text-foreground [&_mark]:rounded-sm [&_mark]:px-1"
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  );
}
