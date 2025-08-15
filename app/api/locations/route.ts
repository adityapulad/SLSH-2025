import { type NextRequest, NextResponse } from "next/server"
import { mockEcoLocations } from "@/data/mock-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const search = searchParams.get("search")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius")

  let filteredLocations = [...mockEcoLocations]

  // Filter by type
  if (type && type !== "all") {
    filteredLocations = filteredLocations.filter((location) => location.type === type)
  }

  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase()
    filteredLocations = filteredLocations.filter(
      (location) =>
        location.name.toLowerCase().includes(searchLower) || location.address.toLowerCase().includes(searchLower),
    )
  }

  // Filter by proximity (if coordinates provided)
  if (lat && lng && radius) {
    const userLat = Number.parseFloat(lat)
    const userLng = Number.parseFloat(lng)
    const searchRadius = Number.parseFloat(radius)

    filteredLocations = filteredLocations.filter((location) => {
      const distance = calculateDistance(userLat, userLng, location.latitude, location.longitude)
      return distance <= searchRadius
    })
  }

  return NextResponse.json({
    success: true,
    data: filteredLocations,
    total: filteredLocations.length,
  })
}

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
