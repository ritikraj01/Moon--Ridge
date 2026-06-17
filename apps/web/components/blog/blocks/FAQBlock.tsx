"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FAQBlock } from "@/lib/blog-types";
import MarkdownRenderer from "../MarkdownRenderer";

interface Props {
  block: FAQBlock;
}

export default function FAQBlock({ block }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!block.items || block.items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="my-10"
    >
      {block.title && (
        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">❓</span>
          {block.title}
        </h3>
      )}
      <div className="space-y-3">
        {block.items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
            className="border border-border/50 rounded-xl overflow-hidden bg-card/20 hover:border-amber-500/30 transition-colors"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 hover:bg-amber-500/5 transition-colors"
              aria-expanded={openIdx === idx}
            >
              <span className="font-medium text-foreground text-sm md:text-base leading-snug">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: openIdx === idx ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 text-amber-500"
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {openIdx === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <MarkdownRenderer content={item.answer} className="px-6 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/30" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
