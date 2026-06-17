"use client";

import { motion } from "framer-motion";
import type { CalloutBlock, CalloutVariant } from "@/lib/blog-types";
import MarkdownRenderer from "../MarkdownRenderer";

interface Props {
  block: CalloutBlock;
}

const VARIANT_CONFIG: Record<
  CalloutVariant,
  { icon: string; bg: string; border: string; titleColor: string; badge: string }
> = {
  info: {
    icon: "ℹ️",
    bg: "bg-sky-500/10",
    border: "border-sky-500/40",
    titleColor: "text-sky-300",
    badge: "bg-sky-500/20 text-sky-300",
  },
  warning: {
    icon: "⚠️",
    bg: "bg-amber-500/10",
    border: "border-amber-500/40",
    titleColor: "text-amber-300",
    badge: "bg-amber-500/20 text-amber-300",
  },
  success: {
    icon: "✅",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    titleColor: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  danger: {
    icon: "🚨",
    bg: "bg-red-500/10",
    border: "border-red-500/40",
    titleColor: "text-red-300",
    badge: "bg-red-500/20 text-red-300",
  },
};

export default function CalloutBlock({ block }: Props) {
  const cfg = VARIANT_CONFIG[block.variant] ?? VARIANT_CONFIG.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5 }}
      className={`my-8 rounded-2xl border ${cfg.bg} ${cfg.border} overflow-hidden`}
    >
      <div className="flex items-center gap-3 px-6 py-3 border-b border-inherit">
        <span className="text-xl">{cfg.icon}</span>
        {block.title && (
          <span className={`text-sm font-semibold uppercase tracking-wide ${cfg.titleColor}`}>
            {block.title}
          </span>
        )}
      </div>
      <MarkdownRenderer content={block.content} className="px-6 py-4 text-sm text-foreground/85 leading-relaxed" />
    </motion.div>
  );
}
