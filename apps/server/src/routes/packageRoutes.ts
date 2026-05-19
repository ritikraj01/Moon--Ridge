import { Router } from "express";
import multer from "multer";
import {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
  uploadImage,
} from "../controllers/packageController";
import { protect, admin } from "../middleware/auth";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

router.get("/", getPackages);
router.get("/:slug", getPackageBySlug);
router.post("/", protect, admin, createPackage);
router.put("/:id", protect, admin, updatePackage);
router.delete("/:id", protect, admin, deletePackage);
router.post("/upload", protect, admin, upload.single("image"), uploadImage);

export default router;
