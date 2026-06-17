"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { BLOCK_PALETTE } from "@/lib/blog-types";
import type { BlockType } from "@/lib/blog-types";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (type: BlockType) => void;
}

const GROUPS = [
  { label: "Text", types: ["heading", "paragraph", "richText", "quote"] },
  { label: "Media", types: ["hero", "image", "gallery", "imageText", "video"] },
  { label: "Travel", types: ["travelInfoTable", "highlightCard", "timeline", "checklist"] },
  { label: "Structure", types: ["faq", "callout", "relatedPackage", "map", "divider"] },
] as const;

export default function BlockPalette({ open, onClose, onAdd }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 38 }}
            className="fixed right-0 top-0 h-full w-80 z-50 bg-slate-950 border-l border-slate-800 overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-800 sticky top-0 bg-slate-950 z-10">
              <div>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Add Block</p>
                <h3 className="text-lg font-bold text-white">Choose a block type</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-8">
              {GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {BLOCK_PALETTE.filter((p) => (group.types as readonly string[]).includes(p.type)).map((item) => (
                      <motion.button
                        type="button"
                        key={item.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { onAdd(item.type); onClose(); }}
                        className="flex flex-col items-start gap-2 p-3 rounded-xl border border-slate-800 hover:border-amber-500/50 bg-slate-900 hover:bg-slate-800 transition-all text-left"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-white leading-tight">{item.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
