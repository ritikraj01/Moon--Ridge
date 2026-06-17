"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, ChevronUp, ChevronDown, Trash2, ChevronRight } from "lucide-react";
import { BLOCK_PALETTE } from "@/lib/blog-types";
import type { ContentBlock } from "@/lib/blog-types";

interface Props {
  id: string;
  block: ContentBlock;
  index: number;
  total: number;
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  children: React.ReactNode;
}

export default function BlockWrapper({
  id,
  block,
  index,
  total,
  isEditing,
  onToggleEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  children,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const meta = BLOCK_PALETTE.find((p) => p.type === block.type);

  return (
    <div ref={setNodeRef} style={style as any} className="relative group">
      <motion.div
        layout
        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
          isEditing
            ? "border-amber-500/60 bg-slate-900 shadow-lg shadow-amber-500/10"
            : "border-slate-800 bg-slate-950 hover:border-slate-700"
        }`}
      >
        {/* Block Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
          {/* Drag handle — MUST have type="button" to prevent form submission */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical size={16} />
          </button>

          {/* Block type label */}
          <span className="text-lg" aria-hidden>{meta?.icon}</span>
          <span className="text-xs font-semibold text-slate-400 flex-1 truncate">{meta?.label ?? block.type}</span>

          {/* Controls — all must be type="button" to avoid form submit */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={index === 0}
              className="p-1.5 rounded text-slate-600 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move up"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={index === total - 1}
              className="p-1.5 rounded text-slate-600 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move down"
            >
              <ChevronDown size={14} />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete block"
            >
              <Trash2 size={14} />
            </button>
            <button
              type="button"
              onClick={onToggleEdit}
              className={`p-1.5 rounded transition-colors ${
                isEditing ? "text-amber-400" : "text-slate-600 hover:text-slate-300"
              }`}
              title={isEditing ? "Collapse" : "Edit block"}
            >
              <ChevronRight
                size={14}
                className={`transition-transform duration-200 ${isEditing ? "rotate-90" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Editing Form */}
        {isEditing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
