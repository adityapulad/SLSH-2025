// Core data types for PrithviPath app

export interface User {
  id: string
  name: string
  email: string
  profilePicture?: string
  ecoPoints: number
  totalBottlesSaved: number
  totalDistanceWalked: number // in km
  badges: Badge[]
  unlockedStories: string[]
  createdAt: Date
}

export interface EcoLocation {
  id: string
  name: string
  type: "water-refill" | "eco-restaurant" | "waste-disposal" | "cultural-site"
  latitude: number
  longitude: number
  address: string
  description: string
  ecoRating: number // 1-5 stars
  image: string
  story?: CulturalStory
  qrCode: string
  availableActions: EcoAction[]
}

export interface EcoAction {
  id: string
  type: "water-refill" | "waste-deposit" | "visit" | "story-unlock"
  points: number
  icon: string
  description: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  criteria: string
  isUnlocked: boolean
  unlockedAt?: Date
}

export interface CulturalStory {
  id: string
  title: string
  content: string
  images: string[]
  locationId: string
  isUnlocked: boolean
}

export interface CommunityEvent {
  id: string
  title: string
  description: string
  date: Date
  location: string
  attendees: number
  maxAttendees?: number
}

export interface CheckIn {
  id: string
  userId: string
  locationId: string
  actionType: string
  pointsEarned: number
  timestamp: Date
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  profilePicture?: string
  ecoPoints: number
  rank: number
}
