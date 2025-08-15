"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useGamification } from "./gamification-context"
import { mockEcoLocations } from "@/data/mock-data"
import type { CulturalStory } from "@/types"

interface StoriesContextType {
  unlockedStories: CulturalStory[]
  unlockStory: (storyId: string) => Promise<boolean>
  getStoryByLocation: (locationId: string) => CulturalStory | undefined
  checkGeofencing: (userLat: number, userLng: number) => void
  nearbyStories: Array<{ story: CulturalStory; distance: number }>
  showGeofenceNotification: boolean
  geofenceStory: CulturalStory | null
  dismissGeofenceNotification: () => void
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined)

// Simulate user movement for geofencing demo
const GEOFENCE_RADIUS = 0.01 // ~1km in degrees

export function StoriesProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth()
  const { earnPoints } = useGamification()
  const [unlockedStories, setUnlockedStories] = useState<CulturalStory[]>([])
  const [nearbyStories, setNearbyStories] = useState<Array<{ story: CulturalStory; distance: number }>>([])
  const [showGeofenceNotification, setShowGeofenceNotification] = useState(false)
  const [geofenceStory, setGeofenceStory] = useState<CulturalStory | null>(null)

  // Initialize with some pre-unlocked Himachal Pradesh stories
  useEffect(() => {
    const allStories = mockEcoLocations.filter((location) => location.story).map((location) => location.story!)

    // For demo, unlock the first 3 stories to showcase Himachal Pradesh heritage
    const initialStories = allStories.slice(0, 3)
    initialStories.forEach(story => {
      story.isUnlocked = true
    })

    if (initialStories.length > 0) {
      setUnlockedStories(initialStories)
    }
  }, [])

  // Simulate geofencing check
  const checkGeofencing = (userLat: number, userLng: number) => {
    const locationsWithStories = mockEcoLocations.filter((location) => location.story && !location.story.isUnlocked)

    const nearby = locationsWithStories
      .map((location) => {
        const distance = Math.sqrt(Math.pow(location.latitude - userLat, 2) + Math.pow(location.longitude - userLng, 2))
        return { story: location.story!, distance }
      })
      .filter((item) => item.distance <= GEOFENCE_RADIUS)
      .sort((a, b) => a.distance - b.distance)

    setNearbyStories(nearby)

    // Show notification for closest story
    if (nearby.length > 0 && !showGeofenceNotification) {
      setGeofenceStory(nearby[0].story)
      setShowGeofenceNotification(true)
    }
  }

  // Simulate user movement for demo in Himachal Pradesh
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate user moving around Shimla area
      const baseLat = 31.1048 // Shimla latitude
      const baseLng = 77.1734 // Shimla longitude
      const randomLat = baseLat + (Math.random() - 0.5) * 0.02
      const randomLng = baseLng + (Math.random() - 0.5) * 0.02
      checkGeofencing(randomLat, randomLng)
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [showGeofenceNotification])

  const unlockStory = async (storyId: string): Promise<boolean> => {
    const location = mockEcoLocations.find((loc) => loc.story?.id === storyId)
    if (!location || !location.story) return false

    const story = location.story
    if (story.isUnlocked) return true

    // Unlock the story
    story.isUnlocked = true
    setUnlockedStories((prev) => [...prev, story])

    // Award points for unlocking story
    await earnPoints("story-unlock", 25, location.id)

    // Update user's unlocked stories list
    if (user) {
      updateUser({
        unlockedStories: [...user.unlockedStories, storyId],
      })
    }

    return true
  }

  const getStoryByLocation = (locationId: string): CulturalStory | undefined => {
    const location = mockEcoLocations.find((loc) => loc.id === locationId)
    return location?.story
  }

  const dismissGeofenceNotification = () => {
    setShowGeofenceNotification(false)
    setGeofenceStory(null)
  }

  return (
    <StoriesContext.Provider
      value={{
        unlockedStories,
        unlockStory,
        getStoryByLocation,
        checkGeofencing,
        nearbyStories,
        showGeofenceNotification,
        geofenceStory,
        dismissGeofenceNotification,
      }}
    >
      {children}
    </StoriesContext.Provider>
  )
}

export function useStories() {
  const context = useContext(StoriesContext)
  if (context === undefined) {
    throw new Error("useStories must be used within a StoriesProvider")
  }
  return context
}
