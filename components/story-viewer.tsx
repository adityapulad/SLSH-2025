"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MapPin, Calendar, Star, ArrowLeft, ArrowRight } from "lucide-react"
import type { CulturalStory } from "@/types"

interface StoryViewerProps {
  story: CulturalStory
  onClose: () => void
  showNavigation?: boolean
  onNext?: () => void
  onPrevious?: () => void
}

export function StoryViewer({ story, onClose, showNavigation, onNext, onPrevious }: StoryViewerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (story.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % story.images.length)
    }
  }

  const previousImage = () => {
    if (story.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + story.images.length) % story.images.length)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold mb-2">{story.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>Cultural Story</span>
                <Badge variant="outline" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Unlocked
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Story Images */}
            {story.images.length > 0 && (
              <div className="relative">
                <img
                  src={story.images[currentImageIndex] || "/placeholder.svg"}
                  alt={story.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                {story.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={previousImage}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      onClick={nextImage}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {story.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Story Content */}
            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{story.content}</div>
            </div>

            {/* Story Metadata */}
            <div className="flex items-center gap-4 pt-4 border-t text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Location Story</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Unlocked Today</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Navigation Footer */}
        {showNavigation && (
          <div className="border-t p-4 flex justify-between">
            <Button variant="outline" onClick={onPrevious} disabled={!onPrevious}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button variant="outline" onClick={onNext} disabled={!onNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
