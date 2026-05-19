import { Response } from "express";
import Review from "../models/Review";
import Package from "../models/Package";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createOrUpdateReview = async (req: any, res: Response) => {
  try {
    const { packageId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment is required" });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    // Check if the user already reviewed this package
    let review = await Review.findOne({ userId, packageId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = new Review({
        userId,
        packageId,
        rating,
        comment,
      });
      await review.save();
    }

    // Recalculate average rating and number of reviews for the package
    const reviews = await Review.find({ packageId });
    const numOfReviews = reviews.length;
    const averageRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / numOfReviews;

    // Update package
    await Package.findByIdAndUpdate(packageId, {
      averageRating: parseFloat(averageRating.toFixed(1)),
      numOfReviews,
    });

    // Populate user details for returning
    const populatedReview = await Review.findById(review._id).populate(
      "userId",
      "name avatar"
    );

    res.status(200).json({
      message: "Review submitted successfully",
      review: populatedReview,
      averageRating: parseFloat(averageRating.toFixed(1)),
      numOfReviews,
    });
  } catch (error: any) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Error submitting review", error: error.message });
  }
};

export const getPackageReviews = async (req: any, res: Response) => {
  try {
    const { packageId } = req.params;
    const reviews = await Review.find({ packageId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};
