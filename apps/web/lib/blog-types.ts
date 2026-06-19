// ============================================================
// MOONRIDGE — Rich Content Blog Types
// ============================================================

// ── Individual Block Definitions ─────────────────────────────

export interface HeroBlock {
  type: "hero";
  imageUrl?: string;
  videoUrl?: string;
  title?: string;
  subtitle?: string;
  readTime?: string;
  author?: string;
}

export interface HeadingBlock {
  type: "heading";
  content: string;
  level?: 2 | 3 | 4;
}

export interface ParagraphBlock {
  type: "paragraph";
  content: string;
}

export interface RichTextBlock {
  type: "richText";
  html: string; // TipTap HTML output
}

export interface ImageBlock {
  type: "image";
  imageUrl: string;
  caption?: string;
  altText?: string;
}

export interface GalleryBlock {
  type: "gallery";
  images: { url: string; caption?: string; altText?: string }[];
  columns?: 2 | 3 | 4;
}

export interface ImageTextBlock {
  type: "imageText";
  imageUrl: string;
  altText?: string;
  content: string; // plain text or TipTap HTML
  position: "left" | "right";
  caption?: string;
}

export interface VideoBlock {
  type: "video";
  url: string;
  platform?: "youtube" | "vimeo" | "cloudinary" | "other";
  caption?: string;
  autoplay?: boolean;
}

export interface TravelInfoTableRow {
  label: string;
  value: string;
}

export interface TravelInfoTableBlock {
  type: "travelInfoTable";
  title?: string;
  rows: TravelInfoTableRow[];
}

export type HighlightCardVariant = "tip" | "warning" | "packing" | "info" | "altitude";

export interface HighlightCardBlock {
  type: "highlightCard";
  variant: HighlightCardVariant;
  title: string;
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlock {
  type: "faq";
  title?: string;
  items: FAQItem[];
}

export interface QuoteBlock {
  type: "quote";
  content: string;
  attribution?: string;
}

export type CalloutVariant = "info" | "warning" | "success" | "danger";

export interface CalloutBlock {
  type: "callout";
  variant: CalloutVariant;
  title?: string;
  content: string;
}

export interface TimelineItem {
  time?: string; // e.g. "Day 1" or "Morning"
  title: string;
  description?: string;
}

export interface TimelineBlock {
  type: "timeline";
  title?: string;
  items: TimelineItem[];
}

export interface ChecklistItem {
  text: string;
  checked?: boolean;
}

export interface ChecklistBlock {
  type: "checklist";
  title?: string;
  items: ChecklistItem[];
}

export interface RelatedPackageBlock {
  type: "relatedPackage";
  packageSlug: string;
  ctaText?: string;
}

export interface MapBlock {
  type: "map";
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  embedUrl?: string;
  caption?: string;
}

export interface DividerBlock {
  type: "divider";
  style?: "line" | "dots" | "mountains" | "ornament";
  label?: string;
}

export interface AudioPhraseBlock {
  type: "audioPhrase";
  phrase: string;
  translation: string;
  audioUrl: string;
  note?: string;
}

export interface LanguageGuidePhrase {
  phrase: string;
  translation: string;
  audioUrl: string;
}

export interface LanguageGuideBlock {
  type: "languageGuide";
  title: string;
  phrases: LanguageGuidePhrase[];
}

// ── Discriminated Union ───────────────────────────────────────

export type ContentBlock =
  | HeroBlock
  | HeadingBlock
  | ParagraphBlock
  | RichTextBlock
  | ImageBlock
  | GalleryBlock
  | ImageTextBlock
  | VideoBlock
  | TravelInfoTableBlock
  | HighlightCardBlock
  | FAQBlock
  | QuoteBlock
  | CalloutBlock
  | TimelineBlock
  | ChecklistBlock
  | RelatedPackageBlock
  | MapBlock
  | DividerBlock
  | AudioPhraseBlock
  | LanguageGuideBlock;

export type BlockType = ContentBlock["type"];

// ── Blog Document Interface ───────────────────────────────────

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  // Legacy plain-text/Markdown content (kept for migration compatibility)
  content?: string;
  // New block-based content
  contentBlocks?: ContentBlock[];
  thumbnail?: string;
  cover?: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  // Meta
  status: "draft" | "published";
  author: string;
  authorAvatar?: string;
  readTime?: string;
  category: string;
  excerpt: string;
  featured: boolean;
  // Journal-specific
  tripDate?: string;
  tripLocation?: string;
  travelRoute?: string;
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// ── Block Palette Metadata ────────────────────────────────────

export interface BlockPaletteItem {
  type: BlockType;
  label: string;
  description: string;
  icon: string; // emoji or icon name
  defaultData: Omit<ContentBlock, "type">;
}

export const BLOCK_PALETTE: BlockPaletteItem[] = [
  {
    type: "hero",
    label: "Hero Section",
    description: "Full-width image with overlay title",
    icon: "🌄",
    defaultData: { title: "Article Title", subtitle: "Subtitle goes here" },
  },
  {
    type: "heading",
    label: "Heading",
    description: "Section heading (H2, H3, H4)",
    icon: "H",
    defaultData: { content: "New Heading", level: 2 },
  },
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Plain text paragraph",
    icon: "¶",
    defaultData: { content: "Write your paragraph here..." },
  },
  {
    type: "richText",
    label: "Rich Text",
    description: "Bold, italic, links, lists, blockquotes",
    icon: "✍",
    defaultData: { html: "<p>Start writing...</p>" },
  },
  {
    type: "image",
    label: "Image",
    description: "Single image with caption",
    icon: "🖼",
    defaultData: { imageUrl: "", caption: "" },
  },
  {
    type: "gallery",
    label: "Image Gallery",
    description: "Multiple images in a grid",
    icon: "🗃",
    defaultData: { images: [], columns: 3 },
  },
  {
    type: "imageText",
    label: "Image + Text",
    description: "Side-by-side image and text",
    icon: "⬜",
    defaultData: { imageUrl: "", content: "", position: "left" },
  },
  {
    type: "video",
    label: "Video",
    description: "YouTube, Vimeo, or Cloudinary embed",
    icon: "▶",
    defaultData: { url: "" },
  },
  {
    type: "travelInfoTable",
    label: "Travel Info Table",
    description: "Best time, duration, budget table",
    icon: "📋",
    defaultData: { rows: [{ label: "Best Time", value: "" }] },
  },
  {
    type: "highlightCard",
    label: "Highlight Card",
    description: "Travel tip, warning, or packing advice",
    icon: "💡",
    defaultData: { variant: "tip", title: "Travel Tip", content: "" },
  },
  {
    type: "faq",
    label: "FAQ Section",
    description: "Collapsible question & answer pairs",
    icon: "❓",
    defaultData: { items: [{ question: "Question?", answer: "Answer" }] },
  },
  {
    type: "quote",
    label: "Quote",
    description: "Inspirational travel quote",
    icon: "❝",
    defaultData: { content: "The mountains are calling and I must go.", attribution: "" },
  },
  {
    type: "callout",
    label: "Callout Box",
    description: "Info, warning, success, or danger notice",
    icon: "📢",
    defaultData: { variant: "info", title: "", content: "" },
  },
  {
    type: "timeline",
    label: "Timeline",
    description: "Travel itinerary or road trip timeline",
    icon: "🗺",
    defaultData: { items: [{ time: "Day 1", title: "", description: "" }] },
  },
  {
    type: "checklist",
    label: "Checklist",
    description: "Packing list or things to carry",
    icon: "✅",
    defaultData: { title: "What to Pack", items: [{ text: "Item 1", checked: false }] },
  },
  {
    type: "relatedPackage",
    label: "Related Package",
    description: "Embed a travel package card",
    icon: "🧳",
    defaultData: { packageSlug: "", ctaText: "Book This Package" },
  },
  {
    type: "map",
    label: "Map",
    description: "Interactive Leaflet map location",
    icon: "📍",
    defaultData: { address: "", latitude: 34.1526, longitude: 77.5771, zoom: 12 },
  },
  {
    type: "divider",
    label: "Divider",
    description: "Section separator",
    icon: "─",
    defaultData: { style: "line", label: "" },
  },
  {
    type: "audioPhrase",
    label: "Audio Phrase",
    description: "Pronunciation phrase with custom audio player",
    icon: "🔊",
    defaultData: { phrase: "Julley", translation: "Hello / Thank You / Goodbye", audioUrl: "", note: "" },
  },
  {
    type: "languageGuide",
    label: "Language Guide",
    description: "Multiple audio phrases in a beautiful card",
    icon: "🗣️",
    defaultData: { title: "Essential Ladakhi Phrases", phrases: [{ phrase: "Julley", translation: "Hello / Thank You / Goodbye", audioUrl: "" }] },
  },
];
