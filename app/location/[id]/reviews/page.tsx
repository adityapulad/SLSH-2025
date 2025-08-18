"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { LocationReviews } from "@/components/location-reviews"
import type { EcoLocation } from "@/types"
import { mockEcoLocations } from "@/data/mock-data"

export default function LocationReviewsPage() {
  const params = useParams()
  const router = useRouter()
  const [location, setLocation] = useState<EcoLocation | null>(null)

  useEffect(() => {
    const locationId = params.id as string
    const foundLocation = mockEcoLocations.find((loc) => loc.id === locationId)
    setLocation(foundLocation || null)
  }, [params.id])

  if (!location) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Location not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{location.name}</h1>
              <p className="text-sm text-gray-600">{location.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LocationReviews
          location={location}
          onReviewSubmit={(review) => {
            console.log("New review submitted:", review)
            // In a real app, this would submit to an API
          }}
        />
      </div>
    </div>
  )
}
