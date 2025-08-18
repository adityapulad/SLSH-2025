"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AdminUser, GuestUser } from "@/types"

interface AuthContextType {
  user: User | AdminUser | GuestUser | null
  login: (email: string, password: string, userType?: "user" | "admin") => Promise<void>
  loginWithGoogle: (userType: "user" | "admin") => Promise<void>
  loginWithPhone: (phoneNumber: string, otp: string, userType: "user" | "admin") => Promise<void>
  loginAsGuest: () => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  isLoading: boolean
  userType: "user" | "admin" | "guest" | null
  isAuthenticated: boolean
  isAdmin: boolean
  isGuest: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUser: User = {
  id: "1",
  name: "Priya Sharma",
  email: "priya@example.com",
  profilePicture: "/indian-woman-smiling.png",
  ecoPoints: 1250,
  totalBottlesSaved: 17,
  totalDistanceWalked: 42,
  badges: [],
  unlockedStories: [],
  createdAt: new Date("2024-01-15"),
  userType: "user",
  authMethod: "google",
}

const mockAdmin: AdminUser = {
  id: "admin-1",
  name: "Rajesh Kumar",
  email: "admin@prithvipath.com",
  profilePicture: "/indian-man-smiling.png",
  ecoPoints: 0,
  totalBottlesSaved: 0,
  totalDistanceWalked: 0,
  badges: [],
  unlockedStories: [],
  createdAt: new Date("2024-01-01"),
  userType: "admin",
  authMethod: "google",
  permissions: [
    {
      id: "1",
      name: "User Management",
      description: "Manage user accounts and data",
      resource: "users",
      actions: ["read", "write", "delete"],
    },
    {
      id: "2",
      name: "Location Management",
      description: "Manage eco-locations and content",
      resource: "locations",
      actions: ["read", "write", "delete"],
    },
  ],
  lastLoginAt: new Date(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | AdminUser | GuestUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkExistingSession = async () => {
      // Check for guest session
      const guestSession = localStorage.getItem("guestSession")
      if (guestSession) {
        const guestUser: GuestUser = {
          id: "guest-" + Date.now(),
          name: "Guest User",
          userType: "guest",
          sessionId: guestSession,
          createdAt: new Date(),
          limitations: ["No progress tracking", "No rewards", "Limited access"],
        }
        setUser(guestUser)
        setIsLoading(false)
        return
      }

      // Check for authenticated session (simulate checking token/session)
      const savedUserType = localStorage.getItem("userType")
      const savedAuthMethod = localStorage.getItem("authMethod")

      if (savedUserType && savedAuthMethod) {
        // Simulate session restoration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (savedUserType === "admin") {
          setUser(mockAdmin)
        } else {
          setUser(mockUser)
        }
      }

      setIsLoading(false)
    }

    checkExistingSession()
  }, [])

  const login = async (email: string, password: string, userType: "user" | "admin" = "user") => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData = userType === "admin" ? mockAdmin : mockUser
      setUser(userData)

      // Store session info
      localStorage.setItem("userType", userType)
      localStorage.setItem("authMethod", "email")
      localStorage.removeItem("guestSession")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (userType: "user" | "admin") => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const userData =
        userType === "admin"
          ? { ...mockAdmin, authMethod: "google" as const }
          : { ...mockUser, authMethod: "google" as const }

      setUser(userData)

      localStorage.setItem("userType", userType)
      localStorage.setItem("authMethod", "google")
      localStorage.removeItem("guestSession")
    } catch (error) {
      console.error("Google login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithPhone = async (phoneNumber: string, otp: string, userType: "user" | "admin") => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const userData =
        userType === "admin"
          ? { ...mockAdmin, authMethod: "phone" as const, email: `${phoneNumber}@phone.auth` }
          : { ...mockUser, authMethod: "phone" as const, email: `${phoneNumber}@phone.auth` }

      setUser(userData)

      localStorage.setItem("userType", userType)
      localStorage.setItem("authMethod", "phone")
      localStorage.removeItem("guestSession")
    } catch (error) {
      console.error("Phone login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsGuest = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sessionId = "guest-" + Date.now()
      const guestUser: GuestUser = {
        id: sessionId,
        name: "Guest User",
        userType: "guest",
        sessionId,
        createdAt: new Date(),
        limitations: ["No progress tracking", "No rewards", "Limited access"],
      }

      setUser(guestUser)
      localStorage.setItem("guestSession", sessionId)
      localStorage.removeItem("userType")
      localStorage.removeItem("authMethod")
    } catch (error) {
      console.error("Guest login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("userType")
    localStorage.removeItem("authMethod")
    localStorage.removeItem("guestSession")
  }

  const updateUser = (updates: Partial<User>) => {
    if (user && user.userType !== "guest") {
      setUser({ ...user, ...updates })
    }
  }

  const userType = user?.userType || null
  const isAuthenticated = !!user
  const isAdmin = user?.userType === "admin"
  const isGuest = user?.userType === "guest"

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        loginWithPhone,
        loginAsGuest,
        logout,
        updateUser,
        isLoading,
        userType,
        isAuthenticated,
        isAdmin,
        isGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
