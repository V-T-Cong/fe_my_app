"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";

interface Review {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
    verified: boolean;
}

interface ProductReviewsProps {
    productId: number;
}

// Mock reviews data
const mockReviews: Review[] = [
    {
        id: "1",
        author: "John Doe",
        avatar: "JD",
        rating: 5,
        date: "2026-01-20",
        comment: "Excellent service! Got my key instantly and it worked perfectly. Highly recommend this seller!",
        helpful: 12,
        verified: true,
    },
    {
        id: "2",
        author: "Sarah Wilson",
        avatar: "SW",
        rating: 4,
        date: "2026-01-18",
        comment: "Very fast delivery. The account works great. Only minor issue was the email took a few minutes to arrive but overall great experience.",
        helpful: 8,
        verified: true,
    },
    {
        id: "3",
        author: "Mike Chen",
        avatar: "MC",
        rating: 5,
        date: "2026-01-15",
        comment: "Best prices I've found online! Transaction was smooth and secure. Will definitely buy again.",
        helpful: 15,
        verified: false,
    },
];

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    const ratingCounts = Array.from({ length: 5 }, (_, i) =>
        reviews.filter(r => r.rating === 5 - i).length
    );

    const handleSubmitReview = () => {
        if (!newComment.trim()) return;

        const newReview: Review = {
            id: Date.now().toString(),
            author: "Guest User",
            avatar: "GU",
            rating: newRating,
            date: new Date().toISOString().split('T')[0],
            comment: newComment,
            helpful: 0,
            verified: false,
        };

        setReviews([newReview, ...reviews]);
        setNewComment("");
        setNewRating(5);
        setShowReviewForm(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b">
                {/* Left: Overall Rating */}
                <div className="text-center md:text-left">
                    <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                        <span className="text-5xl font-bold text-gray-900">
                            {averageRating.toFixed(1)}
                        </span>
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.round(averageRating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
                        </div>
                    </div>
                </div>

                {/* Right: Rating Breakdown */}
                <div className="space-y-2">
                    {ratingCounts.map((count, index) => {
                        const starCount = 5 - index;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={starCount} className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 w-12">
                                    {starCount} star
                                </span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Write Review Button */}
            {!showReviewForm && (
                <div className="mb-8">
                    <Button
                        onClick={() => setShowReviewForm(true)}
                        className="w-full md:w-auto"
                        size="lg"
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Write a Review
                    </Button>
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>

                    {/* Rating Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating
                        </label>
                        <div className="flex gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setNewRating(i + 1)}
                                    className="group"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-all ${i < newRating
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-gray-300 hover:text-amber-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment Textarea */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                        </label>
                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button onClick={handleSubmitReview} disabled={!newComment.trim()}>
                            Submit Review
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowReviewForm(false);
                                setNewComment("");
                                setNewRating(5);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                    {review.avatar}
                                </div>
                            </div>

                            {/* Review Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-gray-900">{review.author}</h4>
                                    {review.verified && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                            ✓ Verified Purchase
                                        </span>
                                    )}
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 mb-3">{review.comment}</p>

                                {/* Helpful Button */}
                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful ({review.helpful})</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
