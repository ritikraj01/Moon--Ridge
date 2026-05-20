"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Star, MessageSquare, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/authStore";

interface ReviewUser {
  _id: string;
  name: string;
  avatar?: string;
}

interface Review {
  _id: string;
  userId: ReviewUser | null;
  packageId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function getReviewUserId(review: Review): string | undefined {
  const userId = review.userId;
  if (!userId) return undefined;
  return typeof userId === "object" ? String(userId._id) : String(userId);
}

interface PackageReviewsProps {
  packageId: string;
  initialReviews: Review[];
  averageRating: number;
  numOfReviews: number;
}

export default function PackageReviews({
  packageId,
  initialReviews = [],
  averageRating = 0,
  numOfReviews = 0,
}: PackageReviewsProps) {
  const { user, token } = useAuthStore();
  
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [avgRating, setAvgRating] = useState<number>(averageRating);
  const [totalReviews, setTotalReviews] = useState<number>(numOfReviews);

  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Calculate rating distributions for progress bars
  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // Index 0 represents 5 stars, ..., Index 4 represents 1 star
    if (reviews.length === 0) return counts.map(() => 0);
    
    reviews.forEach((r) => {
      const idx = 5 - Math.round(r.rating);
      if (idx >= 0 && idx < 5) {
        counts[idx] = (counts[idx] || 0) + 1;
      }
    });

    return counts.map((count) => Math.round((count / reviews.length) * 100));
  }, [reviews]);

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!token) {
      setErrorMessage("You must be logged in to submit a review.");
      return;
    }

    if (rating === 0) {
      setErrorMessage("Please select a rating of at least 1 star.");
      return;
    }

    if (!comment.trim()) {
      setErrorMessage("Please write a comment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/${packageId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      // Success
      setSuccessMessage("Your review has been submitted successfully!");
      setComment("");
      setRating(0);

      // Dynamically update states
      const updatedReview = data.review;
      
      // Update reviews list: replace if user already reviewed, or prepend
      setReviews((prevReviews) => {
        const index = prevReviews.findIndex(
          (r) => getReviewUserId(r) === user?.id
        );
        if (index > -1) {
          const newReviews = [...prevReviews];
          newReviews[index] = updatedReview;
          return newReviews;
        } else {
          return [updatedReview, ...prevReviews];
        }
      });

      setAvgRating(data.averageRating);
      setTotalReviews(data.numOfReviews);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-8" id="reviews-section">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-3xl font-bold">Reviews & Ratings</h2>
        <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" />
      </div>

      {/* Ratings Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-card/40 border border-border p-6 rounded-2xl">
        {/* Average score column */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border">
          <span className="text-6xl font-black text-white mb-2">{avgRating > 0 ? avgRating.toFixed(1) : "N/A"}</span>
          
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const fillType = avgRating >= star 
                ? "fill" 
                : avgRating >= star - 0.5 
                  ? "half" 
                  : "empty";

              return (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    fillType === "fill"
                      ? "text-amber-500 fill-amber-500"
                      : fillType === "half"
                        ? "text-amber-500 fill-amber-500 opacity-70"
                        : "text-zinc-600"
                  }`}
                />
              );
            })}
          </div>

          <span className="text-sm text-muted-foreground font-medium">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Rating bars column */}
        <div className="md:col-span-2 flex flex-col justify-center gap-2.5 p-2">
          {[5, 4, 3, 2, 1].map((stars, idx) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-400 w-12 flex items-center justify-end gap-1">
                {stars} <Star className="w-3.5 h-3.5 text-zinc-500 fill-zinc-500/10" />
              </span>
              <div className="flex-1 h-2.5 bg-zinc-950 border border-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000"
                  style={{ width: `${distribution[idx]}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500 font-semibold w-10 text-right">
                {distribution[idx]}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Write a Review Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" /> Write a Review
          </h3>

          {user ? (
            <Card className="border border-border bg-card/65 backdrop-blur-md p-6 rounded-2xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Rating Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-all hover:scale-115 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            (hoveredRating || rating) >= star
                              ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                              : "text-zinc-600 hover:text-amber-500/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Your Comment
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell others about your experience, the sights, the tour guides, or the itinerary..."
                    className="w-full bg-zinc-950 border border-white/10 hover:border-amber-500/30 focus:border-amber-500/50 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 resize-none leading-relaxed"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Submitting Review...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="border border-white/5 bg-zinc-950/20 p-8 text-center rounded-2xl flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-4 border border-amber-500/20">
                <Star className="w-6 h-6 fill-amber-500/10" />
              </div>
              <h4 className="font-bold text-lg text-white mb-2">Share Your Experience</h4>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                Log in to rate and review this tour package and share your journey with other adventurers!
              </p>
              <Button
                asChild
                className="bg-amber-500 hover:bg-amber-600 text-black rounded-full font-bold px-8 transition-all"
              >
                <Link href="/login">Log In to Review</Link>
              </Button>
            </Card>
          )}
        </div>

        {/* Existing Reviews List */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500/10" /> Customer Reviews ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="bg-zinc-950/10 border border-white/5 p-8 rounded-2xl text-center text-zinc-500">
              <p className="text-sm">No reviews yet for this package. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="p-5 rounded-2xl border border-border/80 bg-card/30 hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {rev.userId?.avatar ? (
                        <img
                          src={rev.userId.avatar}
                          alt={rev.userId.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-sm">
                          {rev.userId?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {rev.userId?.name || "Anonymous Traveler"}
                        </h4>
                        <span className="text-[10px] text-zinc-500 font-semibold">
                          {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-0.5 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            rev.rating >= star
                              ? "text-amber-500 fill-amber-500"
                              : "text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium pl-1">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
