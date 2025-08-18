"use client"

import { CommunityEvents } from "@/components/community-events"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EventsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="font-semibold text-lg">Community Events</h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Events Content */}
      <CommunityEvents />
    </div>
  )
}
