import { Request, Response } from "express";
import Location from "../models/Location";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import path from "path";

// ── GET all locations (optional ?category= filter) ──────────────────────────
export const getLocations = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }
    const locations = await Location.find(filter).sort({ name: 1 }).lean();
    // Serialize ObjectId _id to string so client components can use it directly
    const serialized = locations.map((l) => ({ ...l, _id: String(l._id) }));
    res.json(serialized);
  } catch (error) {
    res.status(500).json({ message: "Error fetching locations", error });
  }
};

// ── GET single location by slug ──────────────────────────────────────────────
export const getLocationBySlug = async (req: Request, res: Response) => {
  try {
    const location = await Location.findOne({ slug: req.params.slug }).lean();
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json({ ...location, _id: String(location._id) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching location", error });
  }
};

// ── CREATE location (admin only) ─────────────────────────────────────────────
export const createLocation = async (req: Request, res: Response) => {
  try {
    const newLocation = new Location(req.body);
    await newLocation.save();
    res.status(201).json(newLocation.toObject());
  } catch (error) {
    res.status(500).json({ message: "Error creating location", error });
  }
};

// ── UPDATE location (admin only) ─────────────────────────────────────────────
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Location not found" });
    res.json(updated.toObject());
  } catch (error) {
    res.status(500).json({ message: "Error updating location", error });
  }
};

// ── DELETE location (admin only) ─────────────────────────────────────────────
export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Location not found" });
    res.json({ message: "Location deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting location", error });
  }
};

// ── UPLOAD image (admin only) — same Cloudinary/local-fallback as packages ───
export const uploadLocationImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_SECRET !== "your_api_secret";

    if (isCloudinaryConfigured) {
      const uploadStream = () =>
        new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "travel-booking/locations" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file!.buffer);
        });

      const result = await uploadStream();
      return res.status(200).json({ url: result.secure_url });
    } else {
      console.warn("Cloudinary not configured — using local fallback.");
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileExt = path.extname(req.file.originalname) || ".jpg";
      const filename = `loc_${Date.now()}_${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);

      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      return res.status(200).json({ url: `${baseUrl}/uploads/${filename}`, isMock: true });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Image upload failed", error: error.message || error });
  }
};
