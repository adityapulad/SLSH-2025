"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context" // Using auth context instead of direct router
import { useRouter } from "next/navigation"
import { UserX, Loader2 } from "lucide-react"

export function GuestSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { loginAsGuest } = useAuth() // Using new loginAsGuest method
  const router = useRouter()

  const handleGuestSignIn = async () => {
    setIsLoading(true)
    try {
      await loginAsGuest() // Using enhanced auth method
      router.push("/guest")
    } catch (error) {
      console.error("Guest sign-in failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGuestSignIn}
        disabled={isLoading}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center gap-3"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
        Continue as Guest
      </Button>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="text-xs text-yellow-800">
          <strong>Guest limitations:</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>No progress tracking</li>
            <li>No rewards or points</li>
            <li>Limited location access</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
