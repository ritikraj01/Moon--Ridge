"use client";

import { motion } from "framer-motion";
import type { TravelInfoTableBlock } from "@/lib/blog-types";

interface Props {
  block: TravelInfoTableBlock;
}

export default function TravelInfoTableBlock({ block }: Props) {
  if (!block.rows || block.rows.length === 0) return null;

  const hasHeaders = block.headers && block.headers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="my-10 rounded-2xl overflow-hidden border border-border/50 bg-card/20"
    >
      {block.title && (
        <div className="px-6 py-4 bg-amber-500/10 border-b border-border/50">
          <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-widest">
            {block.title}
          </h3>
        </div>
      )}
      {hasHeaders ? (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-border/40 bg-slate-900/60">
                {block.headers!.map((header, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3.5 text-xs font-bold text-amber-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {block.rows.map((row, rowIdx) => {
                const cells = row.values || [row.label, row.value];
                return (
                  <motion.tr
                    key={rowIdx}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: rowIdx * 0.03, duration: 0.4 }}
                    className="hover:bg-amber-500/5 transition-colors"
                  >
                    {block.headers!.map((_, colIdx) => (
                      <td
                        key={colIdx}
                        className="px-6 py-3.5 text-sm text-foreground/90 font-medium whitespace-pre-wrap"
                      >
                        {cells[colIdx] || ""}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="divide-y divide-border/30">
          {block.rows.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="flex items-center px-6 py-4 hover:bg-amber-500/5 transition-colors"
            >
              <span className="w-1/3 text-sm font-semibold text-amber-400">{row.label}</span>
              <span className="w-2/3 text-sm text-foreground/90">{row.value}</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
