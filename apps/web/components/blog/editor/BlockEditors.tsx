"use client";

// ============================================================
// All individual block editor forms — one export per block type
// ============================================================

import { useRef } from "react";
import type {
  HeroBlock,
  HeadingBlock,
  ParagraphBlock,
  RichTextBlock,
  ImageBlock,
  GalleryBlock,
  ImageTextBlock,
  VideoBlock,
  TravelInfoTableBlock,
  HighlightCardBlock,
  FAQBlock,
  QuoteBlock,
  CalloutBlock,
  TimelineBlock,
  ChecklistBlock,
  RelatedPackageBlock,
  MapBlock,
  DividerBlock,
  HighlightCardVariant,
  CalloutVariant,
} from "@/lib/blog-types";
import { Plus, Trash2 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";

// ── Shared helpers ─────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{children}</label>;
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      // Prevent Enter key from submitting parent <form>
      onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function AddButton({ onClick, label = "Add Item" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500/60 px-3 py-2 rounded-lg transition-colors w-full justify-center"
    >
      <Plus size={14} /> {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
    >
      <Trash2 size={14} />
    </button>
  );
}

// Upload helper
async function uploadImage(file: File, token: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/packages/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url as string;
}

function ImageUploader({
  value,
  onChange,
  token,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  token: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, token);
      onChange(url);
    } catch {
      alert("Image upload failed");
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value && (
        <img src={value} alt="" className="w-full h-32 object-cover rounded-lg border border-slate-700" />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <div className="flex gap-2">
        <Input value={value} onChange={onChange} placeholder="Paste image URL..." />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 py-2 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-lg border border-amber-500/30 hover:bg-amber-500/30 transition-colors whitespace-nowrap"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

// ── TipTap Toolbar ─────────────────────────────────────────────

function TipTapToolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const btn = (active: boolean, action: () => void, label: string) => (
    <button
      type="button"
      onClick={action}
      title={label}
      className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors ${
        active ? "bg-amber-500 text-black" : "text-slate-400 hover:text-white hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-slate-700 bg-slate-900/50">
      {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "B")}
      {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "I")}
      {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), "U")}
      {btn(editor.isActive("highlight"), () => editor.chain().focus().toggleHighlight().run(), "✦")}
      {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "• List")}
      {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "1. List")}
      {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), "❝")}
      <button
        type="button"
        title="Link"
        onClick={() => {
          const url = prompt("Enter URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-colors ${
          editor.isActive("link") ? "bg-amber-500 text-black" : "text-slate-400 hover:text-white hover:bg-slate-700"
        }`}
      >
        🔗
      </button>
    </div>
  );
}

// ── Hero Editor ────────────────────────────────────────────────

export function HeroEditor({ block, onChange, token }: { block: HeroBlock; onChange: (b: HeroBlock) => void; token: string }) {
  const u = (patch: Partial<HeroBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <ImageUploader value={block.imageUrl || ""} onChange={(v) => u({ imageUrl: v })} token={token} label="Background Image" />
      <FieldGroup>
        <Label>Video URL (YouTube/Vimeo — overrides image)</Label>
        <Input value={block.videoUrl || ""} onChange={(v) => u({ videoUrl: v })} placeholder="https://youtube.com/watch?v=..." />
      </FieldGroup>
      <FieldGroup>
        <Label>Overlay Title</Label>
        <Input value={block.title || ""} onChange={(v) => u({ title: v })} placeholder="Article title..." />
      </FieldGroup>
      <FieldGroup>
        <Label>Subtitle</Label>
        <Input value={block.subtitle || ""} onChange={(v) => u({ subtitle: v })} placeholder="A short subtitle..." />
      </FieldGroup>
      <div className="grid grid-cols-2 gap-3">
        <FieldGroup>
          <Label>Read Time</Label>
          <Input value={block.readTime || ""} onChange={(v) => u({ readTime: v })} placeholder="8 min read" />
        </FieldGroup>
        <FieldGroup>
          <Label>Author</Label>
          <Input value={block.author || ""} onChange={(v) => u({ author: v })} placeholder="Author name" />
        </FieldGroup>
      </div>
    </div>
  );
}

// ── Heading Editor ─────────────────────────────────────────────

export function HeadingEditor({ block, onChange }: { block: HeadingBlock; onChange: (b: HeadingBlock) => void }) {
  const u = (patch: Partial<HeadingBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Level</Label>
        <Select
          value={String(block.level ?? 2)}
          onChange={(v) => u({ level: parseInt(v) as 2 | 3 | 4 })}
          options={[{ label: "H2 — Section Heading", value: "2" }, { label: "H3 — Subsection", value: "3" }, { label: "H4 — Small Heading", value: "4" }]}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Heading Text</Label>
        <Input value={block.content} onChange={(v) => u({ content: v })} placeholder="Enter heading..." />
      </FieldGroup>
    </div>
  );
}

// ── Paragraph Editor ───────────────────────────────────────────

export function ParagraphEditor({ block, onChange }: { block: ParagraphBlock; onChange: (b: ParagraphBlock) => void }) {
  return (
    <FieldGroup>
      <Label>Paragraph Text</Label>
      <Textarea value={block.content} onChange={(v) => onChange({ ...block, content: v })} placeholder="Write your paragraph..." rows={5} />
    </FieldGroup>
  );
}

// ── Rich Text Editor ───────────────────────────────────────────

export function RichTextEditor({ block, onChange }: { block: RichTextBlock; onChange: (b: RichTextBlock) => void }) {
  const editor = useEditor({
    // immediatelyRender: true — editor is only used client-side ("use client" directive)
    immediatelyRender: true,
    extensions: [StarterKit, Underline, Link.configure({ openOnClick: false }), Highlight, TextStyle],
    content: block.html || "<p></p>",
    onUpdate: ({ editor }) => onChange({ ...block, html: editor.getHTML() }),
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 text-sm text-white leading-relaxed focus:outline-none prose prose-invert prose-amber max-w-none prose-sm",
      },
    },
  });

  return (
    <div>
      <Label>Rich Text Content</Label>
      <div className="mt-1.5 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
        <TipTapToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// ── Image Editor ───────────────────────────────────────────────

export function ImageEditor({ block, onChange, token }: { block: ImageBlock; onChange: (b: ImageBlock) => void; token: string }) {
  const u = (patch: Partial<ImageBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <ImageUploader value={block.imageUrl} onChange={(v) => u({ imageUrl: v })} token={token} />
      <FieldGroup>
        <Label>Alt Text</Label>
        <Input value={block.altText || ""} onChange={(v) => u({ altText: v })} placeholder="Describe the image..." />
      </FieldGroup>
      <FieldGroup>
        <Label>Caption (optional)</Label>
        <Input value={block.caption || ""} onChange={(v) => u({ caption: v })} placeholder="Image caption..." />
      </FieldGroup>
    </div>
  );
}

// ── Gallery Editor ─────────────────────────────────────────────

export function GalleryEditor({ block, onChange, token }: { block: GalleryBlock; onChange: (b: GalleryBlock) => void; token: string }) {
  const u = (patch: Partial<GalleryBlock>) => onChange({ ...block, ...patch });
  const images = block.images ?? [];

  const addImage = () => u({ images: [...images, { url: "", caption: "" }] });
  const removeImage = (idx: number) => u({ images: images.filter((_, i) => i !== idx) });
  const updateImage = (idx: number, patch: Partial<typeof images[0]>) => {
    const next = images.map((img, i) => (i === idx ? { ...img, ...patch } : img));
    u({ images: next });
  };

  const handleFileAll = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const urls = await Promise.all(files.map((f) => uploadImage(f, token)));
    u({ images: [...images, ...urls.map((url) => ({ url, caption: "" }))] });
  };

  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Columns</Label>
        <Select
          value={String(block.columns ?? 3)}
          onChange={(v) => u({ columns: parseInt(v) as 2 | 3 | 4 })}
          options={[{ label: "2 columns", value: "2" }, { label: "3 columns", value: "3" }, { label: "4 columns", value: "4" }]}
        />
      </FieldGroup>

      <div className="space-y-3">
        {images.map((img, idx) => (
          <div key={idx} className="border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Image {idx + 1}</span>
              <RemoveButton onClick={() => removeImage(idx)} />
            </div>
            {img.url && <img src={img.url} alt="" className="w-full h-24 object-cover rounded-lg border border-slate-700" />}
            <Input value={img.url} onChange={(v) => updateImage(idx, { url: v })} placeholder="Image URL..." />
            <Input value={img.caption || ""} onChange={(v) => updateImage(idx, { caption: v })} placeholder="Caption (optional)" />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <AddButton onClick={addImage} label="Add Image URL" />
        <label className="flex items-center gap-2 text-xs font-semibold text-amber-400 border border-amber-500/30 px-3 py-2 rounded-lg cursor-pointer hover:border-amber-500/60 transition-colors flex-1 justify-center">
          <Plus size={14} /> Upload Files
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileAll} />
        </label>
      </div>
    </div>
  );
}

// ── Image + Text Editor ────────────────────────────────────────

export function ImageTextEditor({ block, onChange, token }: { block: ImageTextBlock; onChange: (b: ImageTextBlock) => void; token: string }) {
  const u = (patch: Partial<ImageTextBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Image Position</Label>
        <Select
          value={block.position}
          onChange={(v) => u({ position: v as "left" | "right" })}
          options={[{ label: "Image on Left", value: "left" }, { label: "Image on Right", value: "right" }]}
        />
      </FieldGroup>
      <ImageUploader value={block.imageUrl} onChange={(v) => u({ imageUrl: v })} token={token} />
      <FieldGroup>
        <Label>Alt Text</Label>
        <Input value={block.altText || ""} onChange={(v) => u({ altText: v })} placeholder="Describe the image..." />
      </FieldGroup>
      <FieldGroup>
        <Label>Text Content</Label>
        <Textarea value={block.content} onChange={(v) => u({ content: v })} placeholder="Write the accompanying text..." rows={6} />
      </FieldGroup>
    </div>
  );
}

// ── Video Editor ───────────────────────────────────────────────

export function VideoEditor({ block, onChange }: { block: VideoBlock; onChange: (b: VideoBlock) => void }) {
  const u = (patch: Partial<VideoBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Video URL</Label>
        <Input value={block.url} onChange={(v) => u({ url: v })} placeholder="YouTube, Vimeo, or Cloudinary URL..." />
      </FieldGroup>
      <FieldGroup>
        <Label>Caption (optional)</Label>
        <Input value={block.caption || ""} onChange={(v) => u({ caption: v })} placeholder="Video caption..." />
      </FieldGroup>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        Supports: youtube.com, youtu.be, vimeo.com, cloudinary.com, .mp4 .webm
      </p>
    </div>
  );
}

// ── Travel Info Table Editor ───────────────────────────────────

export function TravelInfoTableEditor({ block, onChange }: { block: TravelInfoTableBlock; onChange: (b: TravelInfoTableBlock) => void }) {
  const u = (patch: Partial<TravelInfoTableBlock>) => onChange({ ...block, ...patch });
  const rows = block.rows ?? [];
  const addRow = () => u({ rows: [...rows, { label: "", value: "" }] });
  const removeRow = (idx: number) => u({ rows: rows.filter((_, i) => i !== idx) });
  const updateRow = (idx: number, patch: Partial<typeof rows[0]>) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    u({ rows: next });
  };
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Table Title (optional)</Label>
        <Input value={block.title || ""} onChange={(v) => u({ title: v })} placeholder="e.g. Trip Details" />
      </FieldGroup>
      <div className="space-y-2">
        {rows.map((row, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input value={row.label} onChange={(v) => updateRow(idx, { label: v })} placeholder="Label" />
            <Input value={row.value} onChange={(v) => updateRow(idx, { value: v })} placeholder="Value" />
            <RemoveButton onClick={() => removeRow(idx)} />
          </div>
        ))}
      </div>
      <AddButton onClick={addRow} label="Add Row" />
    </div>
  );
}

// ── Highlight Card Editor ──────────────────────────────────────

const HIGHLIGHT_VARIANTS: { label: string; value: HighlightCardVariant }[] = [
  { label: "💡 Travel Tip", value: "tip" },
  { label: "⚠️ Warning", value: "warning" },
  { label: "🏔 Altitude Advisory", value: "altitude" },
  { label: "🎒 Packing Advice", value: "packing" },
  { label: "ℹ️ Info", value: "info" },
];

export function HighlightCardEditor({ block, onChange }: { block: HighlightCardBlock; onChange: (b: HighlightCardBlock) => void }) {
  const u = (patch: Partial<HighlightCardBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Card Type</Label>
        <Select value={block.variant} onChange={(v) => u({ variant: v as HighlightCardVariant })} options={HIGHLIGHT_VARIANTS} />
      </FieldGroup>
      <FieldGroup>
        <Label>Title</Label>
        <Input value={block.title} onChange={(v) => u({ title: v })} placeholder="e.g. Travel Tip" />
      </FieldGroup>
      <FieldGroup>
        <Label>Content</Label>
        <Textarea value={block.content} onChange={(v) => u({ content: v })} placeholder="Write your advice here..." rows={3} />
      </FieldGroup>
    </div>
  );
}

// ── FAQ Editor ─────────────────────────────────────────────────

export function FAQEditor({ block, onChange }: { block: FAQBlock; onChange: (b: FAQBlock) => void }) {
  const u = (patch: Partial<FAQBlock>) => onChange({ ...block, ...patch });
  const items = block.items ?? [];
  const addItem = () => u({ items: [...items, { question: "", answer: "" }] });
  const removeItem = (idx: number) => u({ items: items.filter((_, i) => i !== idx) });
  const updateItem = (idx: number, patch: Partial<typeof items[0]>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    u({ items: next });
  };
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Section Title (optional)</Label>
        <Input value={block.title || ""} onChange={(v) => u({ title: v })} placeholder="Frequently Asked Questions" />
      </FieldGroup>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">FAQ {idx + 1}</span>
              <RemoveButton onClick={() => removeItem(idx)} />
            </div>
            <Input value={item.question} onChange={(v) => updateItem(idx, { question: v })} placeholder="Question?" />
            <Textarea value={item.answer} onChange={(v) => updateItem(idx, { answer: v })} placeholder="Answer..." rows={3} />
          </div>
        ))}
      </div>
      <AddButton onClick={addItem} label="Add FAQ" />
    </div>
  );
}

// ── Quote Editor ───────────────────────────────────────────────

export function QuoteEditor({ block, onChange }: { block: QuoteBlock; onChange: (b: QuoteBlock) => void }) {
  const u = (patch: Partial<QuoteBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Quote</Label>
        <Textarea value={block.content} onChange={(v) => u({ content: v })} placeholder="Enter the travel quote..." rows={4} />
      </FieldGroup>
      <FieldGroup>
        <Label>Attribution (optional)</Label>
        <Input value={block.attribution || ""} onChange={(v) => u({ attribution: v })} placeholder="John Muir" />
      </FieldGroup>
    </div>
  );
}

// ── Callout Editor ─────────────────────────────────────────────

const CALLOUT_VARIANTS: { label: string; value: CalloutVariant }[] = [
  { label: "ℹ️ Info", value: "info" },
  { label: "⚠️ Warning", value: "warning" },
  { label: "✅ Success", value: "success" },
  { label: "🚨 Danger", value: "danger" },
];

export function CalloutEditor({ block, onChange }: { block: CalloutBlock; onChange: (b: CalloutBlock) => void }) {
  const u = (patch: Partial<CalloutBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Variant</Label>
        <Select value={block.variant} onChange={(v) => u({ variant: v as CalloutVariant })} options={CALLOUT_VARIANTS} />
      </FieldGroup>
      <FieldGroup>
        <Label>Title (optional)</Label>
        <Input value={block.title || ""} onChange={(v) => u({ title: v })} placeholder="e.g. Important Permit Notice" />
      </FieldGroup>
      <FieldGroup>
        <Label>Content</Label>
        <Textarea value={block.content} onChange={(v) => u({ content: v })} placeholder="Write the notice content..." rows={3} />
      </FieldGroup>
    </div>
  );
}

// ── Timeline Editor ────────────────────────────────────────────

export function TimelineEditor({ block, onChange }: { block: TimelineBlock; onChange: (b: TimelineBlock) => void }) {
  const u = (patch: Partial<TimelineBlock>) => onChange({ ...block, ...patch });
  const items = block.items ?? [];
  const addItem = () => u({ items: [...items, { time: `Day ${items.length + 1}`, title: "", description: "" }] });
  const removeItem = (idx: number) => u({ items: items.filter((_, i) => i !== idx) });
  const updateItem = (idx: number, patch: Partial<typeof items[0]>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    u({ items: next });
  };
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Timeline Title (optional)</Label>
        <Input value={block.title || ""} onChange={(v) => u({ title: v })} placeholder="Trip Itinerary" />
      </FieldGroup>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Step {idx + 1}</span>
              <RemoveButton onClick={() => removeItem(idx)} />
            </div>
            <Input value={item.time || ""} onChange={(v) => updateItem(idx, { time: v })} placeholder="Day 1 / Morning / 09:00" />
            <Input value={item.title} onChange={(v) => updateItem(idx, { title: v })} placeholder="Event title..." />
            <Textarea value={item.description || ""} onChange={(v) => updateItem(idx, { description: v })} placeholder="Description (optional)" rows={2} />
          </div>
        ))}
      </div>
      <AddButton onClick={addItem} label="Add Step" />
    </div>
  );
}

// ── Checklist Editor ───────────────────────────────────────────

export function ChecklistEditor({ block, onChange }: { block: ChecklistBlock; onChange: (b: ChecklistBlock) => void }) {
  const u = (patch: Partial<ChecklistBlock>) => onChange({ ...block, ...patch });
  const items = block.items ?? [];
  const addItem = () => u({ items: [...items, { text: "", checked: false }] });
  const removeItem = (idx: number) => u({ items: items.filter((_, i) => i !== idx) });
  const updateItem = (idx: number, patch: Partial<typeof items[0]>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    u({ items: next });
  };
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>List Title (optional)</Label>
        <Input value={block.title || ""} onChange={(v) => u({ title: v })} placeholder="What to Pack" />
      </FieldGroup>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.checked || false}
              onChange={(e) => updateItem(idx, { checked: e.target.checked })}
              className="w-4 h-4 accent-amber-500"
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItem(idx, { text: e.target.value })}
              placeholder="Item text..."
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <RemoveButton onClick={() => removeItem(idx)} />
          </div>
        ))}
      </div>
      <AddButton onClick={addItem} label="Add Item" />
    </div>
  );
}

// ── Related Package Editor ─────────────────────────────────────

export function RelatedPackageEditor({ block, onChange }: { block: RelatedPackageBlock; onChange: (b: RelatedPackageBlock) => void }) {
  const u = (patch: Partial<RelatedPackageBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Package Slug</Label>
        <Input value={block.packageSlug} onChange={(v) => u({ packageSlug: v })} placeholder="e.g. leh-ladakh-6-days" />
        <p className="text-[11px] text-slate-500 mt-1">The slug of the travel package to embed.</p>
      </FieldGroup>
      <FieldGroup>
        <Label>Button Text</Label>
        <Input value={block.ctaText || ""} onChange={(v) => u({ ctaText: v })} placeholder="Book This Package" />
      </FieldGroup>
    </div>
  );
}

// ── Map Editor ─────────────────────────────────────────────────

export function MapEditor({ block, onChange }: { block: MapBlock; onChange: (b: MapBlock) => void }) {
  const u = (patch: Partial<MapBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Address</Label>
        <Input value={block.address || ""} onChange={(v) => u({ address: v })} placeholder="Leh, Ladakh, India" />
      </FieldGroup>
      <FieldGroup>
        <Label>Embed URL (optional — overrides address)</Label>
        <Input value={block.embedUrl || ""} onChange={(v) => u({ embedUrl: v })} placeholder="https://maps.google.com/embed?..." />
      </FieldGroup>
      <FieldGroup>
        <Label>Caption</Label>
        <Input value={block.caption || ""} onChange={(v) => u({ caption: v })} placeholder="Location caption..." />
      </FieldGroup>
      <p className="text-[11px] text-slate-500">Google Maps integration will be enabled in a future update.</p>
    </div>
  );
}

// ── Divider Editor ─────────────────────────────────────────────

export function DividerEditor({ block, onChange }: { block: DividerBlock; onChange: (b: DividerBlock) => void }) {
  const u = (patch: Partial<DividerBlock>) => onChange({ ...block, ...patch });
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Label>Style</Label>
        <Select
          value={block.style ?? "line"}
          onChange={(v) => u({ style: v as DividerBlock["style"] })}
          options={[
            { label: "── Line", value: "line" },
            { label: "• • • Dots", value: "dots" },
            { label: "▲ ▲ ▲ Mountains", value: "mountains" },
            { label: "✦ Ornament", value: "ornament" },
          ]}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>Label (optional, only shows on line style)</Label>
        <Input value={block.label || ""} onChange={(v) => u({ label: v })} placeholder="Section label..." />
      </FieldGroup>
    </div>
  );
}
