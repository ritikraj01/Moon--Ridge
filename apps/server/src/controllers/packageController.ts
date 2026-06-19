import { Request, Response } from "express";
import Package from "../models/Package";
import Review from "../models/Review";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import path from "path";
import {
  enrichPackageResponse,
  getStartingOffer,
  normalizeNumberOfPersons,
  normalizePlansForStorage,
  validatePlans,
} from "../utils/packagePlans";

function preparePackageBody(body: Record<string, unknown>) {
  const plans = normalizePlansForStorage(
    body.plans as Parameters<typeof normalizePlansForStorage>[0]
  );
  const planError = validatePlans(plans);
  if (planError) {
    return { error: planError as string };
  }

  const pricing = Number(body.pricing) || 0;
  const numberOfPersons = normalizeNumberOfPersons(body.numberOfPersons);

  if (pricing < 0) {
    return { error: "Base package price must be zero or greater" };
  }

  const resolvedPricing =
    plans.length > 0
      ? getStartingOffer(pricing, plans, numberOfPersons).price
      : pricing;

  return {
    ...body,
    plans,
    pricing: resolvedPricing,
    numberOfPersons,
  };
}

export const getPackages = async (req: Request, res: Response) => {
  try {
    const packages = await Package.find().lean();
    res.json(
      packages.map((pkg) => enrichPackageResponse(pkg as Record<string, unknown>))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching packages", error });
  }
};

export const getPackageBySlug = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findOne({ slug: req.params.slug }).lean();
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const reviews = await Review.find({ packageId: pkg._id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(
      enrichPackageResponse({
        ...(pkg as Record<string, unknown>),
        reviews,
      })
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching package", error });
  }
};

export const createPackage = async (req: Request, res: Response) => {
  try {
    const prepared = preparePackageBody(req.body);
    if ("error" in prepared) {
      return res.status(400).json({ message: prepared.error });
    }

    const newPackage = new Package(prepared);
    await newPackage.save();
    res
      .status(201)
      .json(
        enrichPackageResponse(
          newPackage.toObject() as unknown as Record<string, unknown>
        )
      );
  } catch (error) {
    res.status(500).json({ message: "Error creating package", error });
  }
};

export const updatePackage = async (req: Request, res: Response) => {
  try {
    const prepared = preparePackageBody(req.body);
    if ("error" in prepared) {
      return res.status(400).json({ message: prepared.error });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      prepared,
      { new: true, runValidators: true }
    );
    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.json(
      enrichPackageResponse(
        updatedPackage.toObject() as unknown as Record<string, unknown>
      )
    );
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
      return res.status(400).json({ message: "No file provided" });
    }

    const isAudio = req.file.mimetype.startsWith("audio/") ||
                    /\.(mp3|wav|m4a)$/i.test(req.file.originalname);

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
            { 
              folder: "travel-booking",
              resource_type: isAudio ? "video" : "image"
            },
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

      const fileExt = path.extname(req.file.originalname) || (isAudio ? ".mp3" : ".jpg");
      const prefix = isAudio ? "audio" : "img";
      const filename = `${prefix}_${Date.now()}_${Math.round(Math.random() * 1e9)}${fileExt}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);

      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      const localUrl = `${baseUrl}/uploads/${filename}`;
      return res.status(200).json({ url: localUrl, isMock: true });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "File upload failed", error: error.message || error });
  }
};
