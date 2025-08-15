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
  userType: "user" | "admin" | "guest" // Added user type field
  authMethod?: "google" | "phone" | "guest" // Added auth method tracking
}

export interface EcoLocation {
  id: string
  name: string
  type: "water-refill" | "eco-restaurant" | "waste-disposal" | "cultural-site" | "eco-accommodation"
  latitude: number
  longitude: number
  address: string
  description: string
  ecoRating: number // 1-5 stars
  image: string
  story?: CulturalStory
  qrCode: string
  availableActions: EcoAction[]
  reviews: Review[]
  averageRating: number
  totalReviews: number
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

// Admin-specific interface
export interface AdminUser extends User {
  userType: "admin"
  permissions: AdminPermission[]
  lastLoginAt: Date
}

export interface AdminPermission {
  id: string
  name: string
  description: string
  resource: string
  actions: string[]
}

// Guest user interface
export interface GuestUser {
  id: string
  name: string
  userType: "guest"
  sessionId: string
  createdAt: Date
  limitations: string[]
}

export interface Review {
  id: string
  userId: string
  userName: string
  userProfilePicture?: string
  locationId: string
  rating: number // 1-5 stars
  title: string
  content: string
  images?: string[]
  likes: number
  dislikes: number
  userLikes: string[] // Array of user IDs who liked
  userDislikes: string[] // Array of user IDs who disliked
  isVerifiedVisit: boolean // True if user actually checked in at location
  visitDate?: Date
  createdAt: Date
  updatedAt: Date
  helpful: number // Number of users who found this helpful
  tags: ReviewTag[]
}

export interface ReviewTag {
  id: string
  name: string
  color: string
}

export interface ReviewSummary {
  locationId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  topTags: ReviewTag[]
}
