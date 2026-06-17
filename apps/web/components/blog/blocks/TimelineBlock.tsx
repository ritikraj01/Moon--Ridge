"use client";

import { motion } from "framer-motion";
import type { TimelineBlock } from "@/lib/blog-types";

interface Props {
  block: TimelineBlock;
}

export default function TimelineBlock({ block }: Props) {
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
        <h3 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">🗺</span>
          {block.title}
        </h3>
      )}

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/60 via-amber-500/30 to-transparent" />

        <div className="space-y-8">
          {block.items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="relative flex gap-6 pl-14"
            >
              {/* Dot */}
              <div className="absolute left-0 top-1 w-11 h-11 rounded-full bg-background border-2 border-amber-500 flex items-center justify-center text-amber-500 font-bold text-xs shrink-0 shadow-lg shadow-amber-500/20">
                {idx + 1}
              </div>

              <div className="pb-2">
                {item.time && (
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5 block">
                    {item.time}
                  </span>
                )}
                <h4 className="text-base font-semibold text-foreground mb-1">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
