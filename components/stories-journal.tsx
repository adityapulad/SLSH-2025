"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Calendar, Star } from "lucide-react"
import { useStories } from "@/contexts/stories-context"
import { StoryViewer } from "./story-viewer"
import type { CulturalStory } from "@/types"

export function StoriesJournal() {
  const { unlockedStories } = useStories()
  const [selectedStory, setSelectedStory] = useState<CulturalStory | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0)

  const filteredStories = unlockedStories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStorySelect = (story: CulturalStory, index: number) => {
    setSelectedStory(story)
    setSelectedStoryIndex(index)
  }

  const handleNextStory = () => {
    if (selectedStoryIndex < filteredStories.length - 1) {
      const nextIndex = selectedStoryIndex + 1
      setSelectedStory(filteredStories[nextIndex])
      setSelectedStoryIndex(nextIndex)
    }
  }

  const handlePreviousStory = () => {
    if (selectedStoryIndex > 0) {
      const prevIndex = selectedStoryIndex - 1
      setSelectedStory(filteredStories[prevIndex])
      setSelectedStoryIndex(prevIndex)
    }
  }

  if (unlockedStories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🏔️</div>
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Himachali Stories Yet</h3>
            <p className="text-gray-600 mb-4">
              Explore the mystical valleys, ancient temples, and cultural heritage sites of Himachal Pradesh.
              Scan QR codes at eco-locations to unlock fascinating stories of DevBhoomi!
            </p>
            <div className="text-sm text-blue-600 mb-4">
              🏛️ Temple legends • 🕉️ Buddhist wisdom • 🏔️ Mountain folklore
            </div>
            <Button className="bg-green-600 hover:bg-green-700">Start Exploring HP</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🏔️ Himachal Pradesh Story Journal</h1>
          <p className="text-gray-600 mb-4">
            {unlockedStories.length} cultural {unlockedStories.length === 1 ? "story" : "stories"} from DevBhoomi unlocked
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-green-800">🏛️ Heritage Tales</div>
                <div className="text-green-600">Ancient temples & monuments</div>
              </div>
              <div>
                <div className="font-semibold text-blue-800">🕉️ Cultural Wisdom</div>
                <div className="text-blue-600">Tibetan & Himachali traditions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => (
            <Card
              key={story.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleStorySelect(story, index)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-2">{story.title}</CardTitle>
                  <Badge className="bg-green-100 text-green-800 text-xs ml-2">
                    <Star className="h-3 w-3 mr-1" />
                    Unlocked
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {story.images.length > 0 && (
                    <img
                      src={story.images[0] || "/placeholder.svg"}
                      alt={story.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <p className="text-sm text-gray-600 line-clamp-3">{story.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>Cultural Story</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Recently unlocked</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStories.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No stories found</h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </div>
        )}
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
          showNavigation={filteredStories.length > 1}
          onNext={selectedStoryIndex < filteredStories.length - 1 ? handleNextStory : undefined}
          onPrevious={selectedStoryIndex > 0 ? handlePreviousStory : undefined}
        />
      )}
    </div>
  )
}
