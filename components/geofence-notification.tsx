"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, BookOpen, X } from "lucide-react"
import { useStories } from "@/contexts/stories-context"

export function GeofenceNotification() {
  const { showGeofenceNotification, geofenceStory, dismissGeofenceNotification, unlockStory } = useStories()

  if (!showGeofenceNotification || !geofenceStory) return null

  const handleUnlockStory = async () => {
    await unlockStory(geofenceStory.id)
    dismissGeofenceNotification()
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-40 animate-in slide-in-from-top duration-500">
      <Card className="bg-purple-50 border-purple-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-purple-900">Story Nearby!</h3>
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Cultural
                </Badge>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                You're near a location with an unlockable story: "{geofenceStory.title}"
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleUnlockStory} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Unlock Story (+25 pts)
                </Button>
                <Button size="sm" variant="outline" onClick={dismissGeofenceNotification}>
                  Later
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={dismissGeofenceNotification}
              className="flex-shrink-0 text-purple-500 hover:text-purple-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
