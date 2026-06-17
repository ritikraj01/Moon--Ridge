"use client";

import { motion } from "framer-motion";
import type { DividerBlock } from "@/lib/blog-types";

interface Props {
  block: DividerBlock;
}

export default function DividerBlock({ block }: Props) {
  const style = block.style ?? "line";

  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.6 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="my-12 flex items-center justify-center gap-4"
    >
      {style === "line" && (
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      )}

      {style === "dots" && (
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
          <div className="w-2 h-2 rounded-full bg-amber-500/70" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
        </div>
      )}

      {style === "mountains" && (
        <div className="flex items-center gap-2 text-amber-500/40 text-lg">
          ▲ ▲ ▲
        </div>
      )}

      {style === "ornament" && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/30" />
          <span className="text-amber-500/60 text-sm">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/30" />
        </div>
      )}

      {block.label && style === "line" && (
        <>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest px-4 shrink-0">
            {block.label}
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
        </>
      )}
    </motion.div>
  );
}
