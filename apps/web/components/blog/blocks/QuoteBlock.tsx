"use client";

import { motion } from "framer-motion";
import type { QuoteBlock } from "@/lib/blog-types";
import MarkdownRenderer from "../MarkdownRenderer";

interface Props {
  block: QuoteBlock;
}

export default function QuoteBlock({ block }: Props) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-12 relative"
    >
      {/* Decorative large quote */}
      <span
        aria-hidden="true"
        className="absolute -top-6 -left-2 text-8xl text-amber-500/20 font-serif leading-none select-none"
      >
        "
      </span>
      <div className="border-l-4 border-amber-500 pl-8 py-2">
        <MarkdownRenderer content={block.content} className="text-xl md:text-2xl font-medium italic text-foreground/90 leading-relaxed" />
        {block.attribution && (
          <footer className="mt-4 text-sm font-medium text-amber-400">
            — {block.attribution}
          </footer>
        )}
      </div>
    </motion.blockquote>
  );
}
