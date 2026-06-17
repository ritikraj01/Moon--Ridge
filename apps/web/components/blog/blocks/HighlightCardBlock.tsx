"use client";

import { motion } from "framer-motion";
import type { HighlightCardBlock, HighlightCardVariant } from "@/lib/blog-types";
import MarkdownRenderer from "../MarkdownRenderer";

interface Props {
  block: HighlightCardBlock;
}

const VARIANT_CONFIG: Record<
  HighlightCardVariant,
  { icon: string; bg: string; border: string; iconBg: string; titleColor: string }
> = {
  tip: {
    icon: "💡",
    bg: "bg-amber-500/10",
    border: "border-amber-500/40",
    iconBg: "bg-amber-500/20",
    titleColor: "text-amber-400",
  },
  warning: {
    icon: "⚠️",
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    iconBg: "bg-orange-500/20",
    titleColor: "text-orange-400",
  },
  altitude: {
    icon: "🏔",
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
    iconBg: "bg-blue-500/20",
    titleColor: "text-blue-400",
  },
  packing: {
    icon: "🎒",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    iconBg: "bg-emerald-500/20",
    titleColor: "text-emerald-400",
  },
  info: {
    icon: "ℹ️",
    bg: "bg-sky-500/10",
    border: "border-sky-500/40",
    iconBg: "bg-sky-500/20",
    titleColor: "text-sky-400",
  },
};

export default function HighlightCardBlock({ block }: Props) {
  const cfg = VARIANT_CONFIG[block.variant] ?? VARIANT_CONFIG.tip;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5 }}
      className={`my-8 p-6 rounded-2xl border ${cfg.bg} ${cfg.border} flex gap-5 items-start`}
    >
      <div className={`w-12 h-12 rounded-xl ${cfg.iconBg} flex items-center justify-center text-2xl shrink-0`}>
        {cfg.icon}
      </div>
      <div className="w-full">
        <h4 className={`font-semibold text-base mb-1.5 ${cfg.titleColor}`}>{block.title}</h4>
        <MarkdownRenderer content={block.content} className="text-sm text-foreground/80 leading-relaxed" />
      </div>
    </motion.div>
  );
}
