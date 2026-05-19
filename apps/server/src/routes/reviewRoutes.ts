import { Router } from "express";
import {
  createOrUpdateReview,
  getPackageReviews,
} from "../controllers/reviewController";
import { protect } from "../middleware/auth";

const router = Router();

// Submit a review for a package (requires authentication)
router.post("/:packageId", protect, createOrUpdateReview);

// Get all reviews for a package
router.get("/:packageId", getPackageReviews);

export default router;
