import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string; // made optional
  cover?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: "draft" | "published";
  author: string;
  authorAvatar?: string;
  readTime?: string;
  category: string;
  excerpt: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    cover: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: String, required: true, default: "Admin" },
    authorAvatar: { type: String },
    readTime: { type: String },
    category: { type: String, required: true, default: "Uncategorized" },
    excerpt: { type: String, required: true, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", BlogSchema);
