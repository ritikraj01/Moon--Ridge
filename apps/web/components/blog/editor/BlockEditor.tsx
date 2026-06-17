"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Plus, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContentBlock, BlockType } from "@/lib/blog-types";
import { BLOCK_PALETTE } from "@/lib/blog-types";
import BlockWrapper from "./BlockWrapper";
import BlockPalette from "./BlockPalette";
import BlockRenderer from "../BlockRenderer";
import {
  HeroEditor,
  HeadingEditor,
  ParagraphEditor,
  RichTextEditor,
  ImageEditor,
  GalleryEditor,
  ImageTextEditor,
  VideoEditor,
  TravelInfoTableEditor,
  HighlightCardEditor,
  FAQEditor,
  QuoteEditor,
  CalloutEditor,
  TimelineEditor,
  ChecklistEditor,
  RelatedPackageEditor,
  MapEditor,
  DividerEditor,
} from "./BlockEditors";

interface Props {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  token: string;
}

function createDefaultBlock(type: BlockType): ContentBlock {
  const palette = BLOCK_PALETTE.find((p) => p.type === type);
  return { type, ...(palette?.defaultData ?? {}) } as ContentBlock;
}

function renderEditor(block: ContentBlock, onChange: (b: ContentBlock) => void, token: string) {
  switch (block.type) {
    case "hero": return <HeroEditor block={block} onChange={onChange} token={token} />;
    case "heading": return <HeadingEditor block={block} onChange={onChange} />;
    case "paragraph": return <ParagraphEditor block={block} onChange={onChange} />;
    case "richText": return <RichTextEditor block={block} onChange={onChange} />;
    case "image": return <ImageEditor block={block} onChange={onChange} token={token} />;
    case "gallery": return <GalleryEditor block={block} onChange={onChange} token={token} />;
    case "imageText": return <ImageTextEditor block={block} onChange={onChange} token={token} />;
    case "video": return <VideoEditor block={block} onChange={onChange} />;
    case "travelInfoTable": return <TravelInfoTableEditor block={block} onChange={onChange} />;
    case "highlightCard": return <HighlightCardEditor block={block} onChange={onChange} />;
    case "faq": return <FAQEditor block={block} onChange={onChange} />;
    case "quote": return <QuoteEditor block={block} onChange={onChange} />;
    case "callout": return <CalloutEditor block={block} onChange={onChange} />;
    case "timeline": return <TimelineEditor block={block} onChange={onChange} />;
    case "checklist": return <ChecklistEditor block={block} onChange={onChange} />;
    case "relatedPackage": return <RelatedPackageEditor block={block} onChange={onChange} />;
    case "map": return <MapEditor block={block} onChange={onChange} />;
    case "divider": return <DividerEditor block={block} onChange={onChange} />;
    default: return <p className="text-slate-500 text-sm">Unknown block type</p>;
  }
}

export default function BlockEditor({ blocks, onChange, token }: Props) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const ids = blocks.map((_, i) => `block-${i}`);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromParts = String(active.id).split("-");
    const toParts = String(over.id).split("-");
    const from = parseInt(fromParts[fromParts.length - 1] ?? "0");
    const to = parseInt(toParts[toParts.length - 1] ?? "0");
    onChange(arrayMove(blocks, from, to));
    // Adjust editing index
    setEditingIdx((prev) => {
      if (prev === null) return null;
      if (prev === from) return to;
      if (from < to && prev > from && prev <= to) return prev - 1;
      if (from > to && prev < from && prev >= to) return prev + 1;
      return prev;
    });
  }, [blocks, onChange]);

  const addBlock = useCallback((type: BlockType) => {
    const newBlock = createDefaultBlock(type);
    const newBlocks = [...blocks, newBlock];
    onChange(newBlocks);
    setEditingIdx(newBlocks.length - 1);
  }, [blocks, onChange]);

  const updateBlock = useCallback((idx: number, updated: ContentBlock) => {
    const next = blocks.map((b, i) => (i === idx ? updated : b));
    onChange(next);
  }, [blocks, onChange]);

  const deleteBlock = useCallback((idx: number) => {
    onChange(blocks.filter((_, i) => i !== idx));
    setEditingIdx((prev) => (prev === idx ? null : prev !== null && prev > idx ? prev - 1 : prev));
  }, [blocks, onChange]);

  const moveBlock = useCallback((idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    onChange(arrayMove(blocks, idx, target));
    setEditingIdx(target);
  }, [blocks, onChange]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Content Blocks
          </span>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
            {blocks.length} block{blocks.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              previewMode
                ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
                : "border-slate-700 text-slate-400 hover:border-slate-600"
            }`}
          >
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            {previewMode ? "Exit Preview" : "Preview"}
          </button>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition-colors"
          >
            <Plus size={14} /> Add Block
          </button>
        </div>
      </div>

      {/* Preview Mode */}
      <AnimatePresence mode="wait">
        {previewMode ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[300px] bg-background rounded-2xl border border-slate-700 p-8"
          >
            {blocks.length === 0 ? (
              <div className="text-center text-slate-500 py-16 text-sm">No blocks yet — add some blocks to preview.</div>
            ) : (
              <BlockRenderer contentBlocks={blocks} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {blocks.length === 0 ? (
              <div className="border-2 border-dashed border-slate-800 rounded-2xl py-16 text-center">
                <p className="text-slate-500 text-sm mb-4">No blocks yet.</p>
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  className="px-5 py-2.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-sm font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  + Add your first block
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {blocks.map((block, idx) => (
                      <BlockWrapper
                        key={ids[idx] ?? `block-${idx}`}
                        id={ids[idx] ?? `block-${idx}`}
                        block={block}
                        index={idx}
                        total={blocks.length}
                        isEditing={editingIdx === idx}
                        onToggleEdit={() => setEditingIdx(editingIdx === idx ? null : idx)}
                        onDelete={() => deleteBlock(idx)}
                        onMoveUp={() => moveBlock(idx, -1)}
                        onMoveDown={() => moveBlock(idx, 1)}
                      >
                        {renderEditor(block, (updated) => updateBlock(idx, updated), token)}
                      </BlockWrapper>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {/* Add block button at bottom */}
            {blocks.length > 0 && (
              <motion.button
                type="button"
                onClick={() => setPaletteOpen(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full mt-3 py-3 border-2 border-dashed border-slate-800 hover:border-amber-500/40 rounded-2xl text-slate-500 hover:text-amber-400 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Block
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Block Palette */}
      <BlockPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onAdd={addBlock} />
    </div>
  );
}
