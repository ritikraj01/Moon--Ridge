"use client";
 
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { ChecklistBlock } from "@/lib/blog-types";
import MarkdownRenderer from "../MarkdownRenderer";
 
interface Props {
  block: ChecklistBlock;
}
 
export default function ChecklistBlock({ block }: Props) {
  if (!block.items || block.items.length === 0) return null;
 
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="my-10 rounded-2xl border border-border/50 bg-card/20 overflow-hidden"
    >
      {block.title && (
        <div className="px-6 py-4 bg-amber-500/10 border-b border-border/50">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Check size={14} />
            {block.title}
          </h3>
        </div>
      )}
      <ul className="p-6 space-y-3">
        {block.items.map((item, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className="flex items-start gap-3"
          >
            <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
              item.checked
                ? "bg-amber-500 text-black"
                : "border border-red-500/30 bg-red-500/10 text-red-400"
            }`}>
              {item.checked ? (
                <Check size={12} strokeWidth={3} />
              ) : (
                <X size={12} strokeWidth={3} />
              )}
            </div>
            <MarkdownRenderer content={item.text} className="text-sm leading-relaxed text-foreground/90 w-full" />
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

