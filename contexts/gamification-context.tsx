"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { mockBadges } from "@/data/mock-data"
import type { CheckIn } from "@/types"

interface GamificationContextType {
  earnPoints: (action: string, points: number, locationId?: string) => Promise<void>
  unlockBadge: (badgeId: string) => void
  checkBadgeUnlocks: () => void
  dailySteps: number
  stepPoints: number
  lastStepUpdate: Date | null
  simulateSteps: (steps: number) => void
  recentCheckIns: CheckIn[]
  addCheckIn: (checkIn: CheckIn) => void
  todayStats: {
    bottlesRefilled: number
    wasteDisposed: number
    stepsWalked: number
    pointsEarned: number
  }
  totalPoints: number
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined)

// Point values for different actions with Himachal Pradesh bonuses
const ACTION_POINTS = {
  "water-refill": 20,
  "waste-deposit": 30,
  "eco-restaurant-visit": 50,
  "visit": 40,
  "story-unlock": 25,
  "daily-steps-5k": 50,
  "daily-steps-8k": 100,
  "daily-steps-12k": 200,
  "daily-steps-15k": 300,
  // Himachal Pradesh specific bonuses
  "mountain-bonus": 5,
  "heritage-bonus": 10,
  "high-altitude-bonus": 8,
  "cultural-bonus": 12,
}

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth()
  const [dailySteps, setDailySteps] = useState(0)
  const [stepPoints, setStepPoints] = useState(0)
  const [lastStepUpdate, setLastStepUpdate] = useState<Date | null>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([])

  // Simulate step counting (in real app, this would connect to Google Fit)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate gradual step increase throughout the day
      const now = new Date()
      const hourOfDay = now.getHours()
      const baseSteps = Math.floor((hourOfDay / 24) * 8000) // Gradual increase to 8k steps
      const randomVariation = Math.floor(Math.random() * 1000)
      const newSteps = Math.min(baseSteps + randomVariation, 15000)

      if (newSteps !== dailySteps) {
        setDailySteps(newSteps)
        calculateStepPoints(newSteps)
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [dailySteps])

  const calculateStepPoints = (steps: number) => {
    let points = 0
    if (steps >= 15000) points = ACTION_POINTS["daily-steps-15k"]
    else if (steps >= 12000) points = ACTION_POINTS["daily-steps-12k"]
    else if (steps >= 8000) points = ACTION_POINTS["daily-steps-8k"]
    else if (steps >= 5000) points = ACTION_POINTS["daily-steps-5k"]

    const today = new Date().toDateString()
    const lastUpdate = lastStepUpdate?.toDateString()

    // Only award points once per day
    if (points > stepPoints && lastUpdate !== today) {
      const pointsToAdd = points - stepPoints
      setStepPoints(points)
      setLastStepUpdate(new Date())

      if (user && pointsToAdd > 0) {
        updateUser({ ecoPoints: user.ecoPoints + pointsToAdd })

        // Add check-in for step milestone
        const stepCheckIn: CheckIn = {
          id: `step-${Date.now()}`,
          userId: user.id,
          locationId: "steps",
          actionType: `${steps} steps`,
          pointsEarned: pointsToAdd,
          timestamp: new Date(),
        }
        setRecentCheckIns((prev) => [stepCheckIn, ...prev.slice(0, 9)])
      }
    }
  }

  const simulateSteps = (steps: number) => {
    setDailySteps(steps)
    calculateStepPoints(steps)
  }

  const earnPoints = async (action: string, points: number, locationId?: string) => {
    if (!user) return

    // Update user points
    updateUser({
      ecoPoints: user.ecoPoints + points,
      totalBottlesSaved: action === "water-refill" ? user.totalBottlesSaved + 1 : user.totalBottlesSaved,
    })

    // Add to recent check-ins
    const checkIn: CheckIn = {
      id: `${action}-${Date.now()}`,
      userId: user.id,
      locationId: locationId || "unknown",
      actionType: action,
      pointsEarned: points,
      timestamp: new Date(),
    }
    setRecentCheckIns((prev) => [checkIn, ...prev.slice(0, 9)])

    // Check for badge unlocks
    setTimeout(() => checkBadgeUnlocks(), 100)
  }

  const unlockBadge = (badgeId: string) => {
    if (!user) return

    const badge = mockBadges.find((b) => b.id === badgeId)
    if (badge && !badge.isUnlocked) {
      badge.isUnlocked = true
      badge.unlockedAt = new Date()

      // Show notification (in real app, this would be a toast/modal)
      console.log(`Badge unlocked: ${badge.name}!`)
    }
  }

  const checkBadgeUnlocks = () => {
    if (!user) return

    // Check Plastic-Free Pro (50 water refills)
    if (user.totalBottlesSaved >= 50) {
      unlockBadge("1")
    }

    // Check Mountain Guardian (25 waste deposits)
    const wasteDeposits = recentCheckIns.filter((c) =>
      c.actionType === "waste-deposit" || c.actionType.includes("waste")
    ).length
    if (wasteDeposits >= 25) {
      unlockBadge("2")
    }

    // Check Local Patron (10 eco-restaurant visits)
    const restaurantVisits = recentCheckIns.filter((c) =>
      c.actionType === "eco-restaurant-visit" || c.actionType === "visit"
    ).length
    if (restaurantVisits >= 10) {
      unlockBadge("3")
    }

    // Check Story Collector (15 stories unlocked)
    const storiesUnlocked = recentCheckIns.filter((c) => c.actionType === "story-unlock").length
    if (storiesUnlocked >= 15) {
      unlockBadge("4")
    }

    // Check Step Master (100km walked)
    if (user.totalDistanceWalked >= 100) {
      unlockBadge("5")
    }

    // Himachal Pradesh specific badges
    // Himalayan Explorer - Visit 5 different valleys
    const uniqueLocations = [...new Set(recentCheckIns.map(c => c.locationId))].length
    if (uniqueLocations >= 5) {
      unlockBadge("6")
    }

    // High Altitude Hero - Check in at high altitude locations
    const highAltitudeVisits = recentCheckIns.filter(c =>
      c.locationId && (
        c.locationId.includes("shimla") ||
        c.locationId.includes("manali") ||
        c.locationId.includes("dharamshala")
      )
    ).length
    if (highAltitudeVisits >= 3) {
      unlockBadge("7")
    }

    // Cultural Bridge - Unlock cultural stories
    if (storiesUnlocked >= 5) {
      unlockBadge("8")
    }
  }

  const addCheckIn = (checkIn: CheckIn) => {
    setRecentCheckIns((prev) => [checkIn, ...prev.slice(0, 9)])
  }

  // Calculate today's stats
  const todayStats = {
    bottlesRefilled: recentCheckIns.filter(c =>
      c.actionType === "water-refill" &&
      c.timestamp.toDateString() === new Date().toDateString()
    ).length,
    wasteDisposed: recentCheckIns.filter(c =>
      (c.actionType === "waste-deposit" || c.actionType.includes("waste")) &&
      c.timestamp.toDateString() === new Date().toDateString()
    ).length,
    stepsWalked: dailySteps,
    pointsEarned: recentCheckIns
      .filter(c => c.timestamp.toDateString() === new Date().toDateString())
      .reduce((sum, c) => sum + c.pointsEarned, 0) + stepPoints
  }

  const totalPoints = user?.ecoPoints || 0

  return (
    <GamificationContext.Provider
      value={{
        earnPoints,
        unlockBadge,
        checkBadgeUnlocks,
        dailySteps,
        stepPoints,
        lastStepUpdate,
        simulateSteps,
        recentCheckIns,
        addCheckIn,
        todayStats,
        totalPoints,
      }}
    >
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  const context = useContext(GamificationContext)
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider")
  }
  return context
}
