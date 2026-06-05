import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  title: string;
  slug: string;
  destination: string;
  duration: number; // in days
  description: string;
  highlights: string[];
  itinerary: { day: number; title: string; activities: string[] }[];
  inclusions: string[];
  exclusions: string[];
  gallery: string[];
  FAQs: { question: string; answer: string }[];
  plans: {
    name: string;
    price: number; // total package price
    numberOfPersons: number;
    features: string[];
  }[];
  pricing: number; // base / starting total package price
  numberOfPersons: number; // travelers covered by base price (when no tiered plans)
  availability: boolean;
  averageRating?: number;
  numOfReviews?: number;
}

const PackageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    destination: { type: String, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    itinerary: [
      {
        day: { type: Number },
        title: { type: String },
        activities: [{ type: String }],
      },
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    gallery: [{ type: String }],
    FAQs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
    plans: [
      {
        name: { type: String },
        price: { type: Number },
        numberOfPersons: { type: Number, min: 1, default: 1 },
        features: [{ type: String }],
      },
    ],
    pricing: { type: Number, required: true },
    numberOfPersons: { type: Number, min: 1, default: 1 },
    availability: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IPackage>("Package", PackageSchema);
