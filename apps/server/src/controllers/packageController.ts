import { Request, Response } from "express";
import Package from "../models/Package";
import Review from "../models/Review";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import path from "path";

export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching packages", error });
  }
};

export const getPackageBySlug = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug });
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const reviews = await Review.find({ packageId: pkg._id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ ...pkg.toObject(), reviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching package", error });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  try {
    const newPackage = new Package(req.body);
    await newPackage.save();
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: "Error creating package", error });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: "Error updating package", error });
  }
};

export const deletePackage = async (req: Request, res: Response) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json({ message: "Package deleted successfully", deletedPackage });
  } catch (error) {
    res.status(500).json({ message: "Error deleting package", error });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Check if Cloudinary credentials are valid
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_SECRET !== "your_api_secret";

    if (isCloudinaryConfigured) {
      // Upload buffer stream to Cloudinary
      const uploadStream = () => {
        return new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "travel-booking" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file!.buffer);
        });
      };

      const result = await uploadStream();
      return res.status(200).json({ url: result.secure_url });
    } else {
      // Fallback: Save file locally in development
      console.warn("Cloudinary not configured (using local fallback).");
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExt = path.extname(req.file.originalname) || ".jpg";
      const filename = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);

      const localUrl = `${process.env.BASE_URL}/uploads/${filename}`;
      return res.status(200).json({ url: localUrl, isMock: true });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message || error });
  }
};
