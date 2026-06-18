import { Router } from "express";
import multer from "multer";
import {
  getLocations,
  getLocationBySlug,
  createLocation,
  updateLocation,
  deleteLocation,
  uploadLocationImage,
} from "../controllers/locationController";
import { protect, admin } from "../middleware/auth";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

const router = Router();

router.get("/", getLocations);
router.get("/slug/:slug", getLocationBySlug);
router.post("/", protect, admin, createLocation);
router.put("/:id", protect, admin, updateLocation);
router.delete("/:id", protect, admin, deleteLocation);
router.post("/upload", protect, admin, upload.single("image"), uploadLocationImage);

export default router;
