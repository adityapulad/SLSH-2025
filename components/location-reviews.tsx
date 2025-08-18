"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Star, ThumbsUp, ThumbsDown, Camera, Send, Filter, CheckCircle, MoreHorizontal, Flag } from "lucide-react"
import type { Review, EcoLocation } from "@/types"
import { useAuth } from "@/contexts/auth-context"

interface LocationReviewsProps {
  location: EcoLocation
  onReviewSubmit?: (review: Partial<Review>) => void
}

export function LocationReviews({ location, onReviewSubmit }: LocationReviewsProps) {
  const { user } = useAuth()
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
    images: [] as string[],
  })
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating" | "helpful">("newest")

  const handleRatingClick = (rating: number) => {
    setNewReview((prev) => ({ ...prev, rating }))
  }

  const handleSubmitReview = () => {
    if (!user || !newReview.title.trim() || !newReview.content.trim()) return

    const review: Partial<Review> = {
      userId: user.id,
      userName: user.name,
      userProfilePicture: user.profilePicture,
      locationId: location.id,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      images: newReview.images,
      likes: 0,
      dislikes: 0,
      userLikes: [],
      userDislikes: [],
      isVerifiedVisit: true, // Would check if user actually visited
      visitDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      helpful: 0,
      tags: [],
    }

    onReviewSubmit?.(review)
    setNewReview({ rating: 5, title: "", content: "", images: [] })
    setShowWriteReview(false)
  }

  const handleLikeReview = (reviewId: string) => {
    // Implementation would update review likes
    console.log("Like review:", reviewId)
  }

  const handleDislikeReview = (reviewId: string) => {
    // Implementation would update review dislikes
    console.log("Dislike review:", reviewId)
  }

  const filteredReviews =
    location.reviews?.filter((review) => (filterRating ? review.rating === filterRating : true)) || []

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "rating":
        return b.rating - a.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const ratingDistribution = location.reviews?.reduce(
    (acc, review) => {
      acc[review.rating as keyof typeof acc] = (acc[review.rating as keyof typeof acc] || 0) + 1
      return acc
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  ) || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reviews & Ratings</span>
            <Button onClick={() => setShowWriteReview(!showWriteReview)} className="bg-green-600 hover:bg-green-700">
              Write Review
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{location.averageRating?.toFixed(1) || "0.0"}</div>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(location.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Based on {location.totalReviews || 0} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          location.totalReviews
                            ? (ratingDistribution[rating as keyof typeof ratingDistribution] / location.totalReviews) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Form */}
      {showWriteReview && user && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Rating Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRatingClick(i + 1)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Review Title</label>
              <Input
                placeholder="Summarize your experience..."
                value={newReview.title}
                onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                placeholder="Share your experience at this location..."
                value={newReview.content}
                onChange={(e) => setNewReview((prev) => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Add Photos (Optional)</label>
              <Button variant="outline" className="w-full bg-transparent">
                <Camera className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!newReview.title.trim() || !newReview.content.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Sort */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filter by rating:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={filterRating === null ? "default" : "outline"}
                  onClick={() => setFilterRating(null)}
                >
                  All
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    size="sm"
                    variant={filterRating === rating ? "default" : "outline"}
                    onClick={() => setFilterRating(rating)}
                  >
                    {rating}★
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="rating">Highest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to share your experience!</p>
            </CardContent>
          </Card>
        ) : (
          sortedReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.userProfilePicture || "/placeholder.svg"} />
                    <AvatarFallback>
                      {review.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{review.userName}</h4>
                        {review.isVerifiedVisit && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified Visit
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h5 className="font-medium mb-2">{review.title}</h5>
                    <p className="text-gray-700 mb-4">{review.content}</p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeReview(review.id)}
                        className="text-gray-600 hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {review.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDislikeReview(review.id)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {review.dislikes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600">
                        <Flag className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
