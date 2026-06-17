"use client";

import { motion } from "framer-motion";
import type { ParagraphBlock } from "@/lib/blog-types";
import MarkdownRenderer from "../MarkdownRenderer";

interface Props {
  block: ParagraphBlock;
}

export default function ParagraphBlock({ block }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <MarkdownRenderer content={block.content} className="text-base md:text-lg leading-relaxed text-foreground/90 mb-6" />
    </motion.div>
  );
}
