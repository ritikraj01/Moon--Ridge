import mongoose, { Schema, Document } from "mongoose";

export type LocationCategory =
  | "city"
  | "lake"
  | "pass"
  | "monastery"
  | "valley"
  | "school"
  | "town"
  | "permit";

export interface ILocation extends Document {
  name: string;
  slug: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  altitude: string;
  distanceFromLeh: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  bestTimeToVisit: string;
  highlights: string[];
  nearbyAttractions: string[];
  travelTips: string[];
  relatedBlogs: string[];     // blog slugs
  relatedPackages: string[];  // package slugs
  createdAt?: Date;
  updatedAt?: Date;
}

const LocationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: ["city", "lake", "pass", "monastery", "valley", "school", "town", "permit"],
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    altitude: { type: String, default: "" },
    distanceFromLeh: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    images: [{ type: String }],
    bestTimeToVisit: { type: String, default: "" },
    highlights: [{ type: String }],
    nearbyAttractions: [{ type: String }],
    travelTips: [{ type: String }],
    relatedBlogs: [{ type: String }],
    relatedPackages: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<ILocation>("Location", LocationSchema);
