import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  // Legacy plain-text/Markdown content — kept for backwards compatibility
  content?: string;
  // New block-based content system
  contentBlocks?: any[];
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
  // Journal-specific fields
  tripDate?: string;
  tripLocation?: string;
  travelRoute?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    // Legacy content field — not required, kept for migration
    content: { type: String },
    // Block-based content system
    contentBlocks: { type: [Schema.Types.Mixed], default: [] },
    thumbnail: { type: String },
    cover: { type: String },
    // SEO fields
    seoTitle: { type: String },
    seoDescription: { type: String },
    canonicalUrl: { type: String },
    ogImage: { type: String },
    // Meta
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: String, required: true, default: "Admin" },
    authorAvatar: { type: String },
    readTime: { type: String },
    category: { type: String, required: true, default: "Uncategorized" },
    excerpt: { type: String, required: true, default: "" },
    featured: { type: Boolean, default: false },
    // Journal-specific
    tripDate: { type: String },
    tripLocation: { type: String },
    travelRoute: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", BlogSchema);
