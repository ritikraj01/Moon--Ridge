"use client";

import { motion } from "framer-motion";
import type { HeadingBlock } from "@/lib/blog-types";

interface Props {
  block: HeadingBlock;
}

const TAG_MAP = { 2: "h2", 3: "h3", 4: "h4" } as const;

const SIZE_MAP = {
  2: "text-3xl md:text-4xl font-bold tracking-tight mt-14 mb-5",
  3: "text-2xl md:text-3xl font-semibold tracking-tight mt-10 mb-4",
  4: "text-xl md:text-2xl font-semibold tracking-tight mt-8 mb-3",
};

export default function HeadingBlock({ block }: Props) {
  const level = block.level ?? 2;
  const Tag = TAG_MAP[level];
  const sizeClass = SIZE_MAP[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Tag className={`${sizeClass} text-foreground border-l-4 border-amber-500 pl-4`}>
        {block.content}
      </Tag>
    </motion.div>
  );
}
