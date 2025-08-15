import { type NextRequest, NextResponse } from "next/server"
import { mockEcoLocations } from "@/data/mock-data"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId, qrCode, action } = body

    // Validate required fields
    if (!userId || !qrCode || !action) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Find the location
    const location = mockEcoLocations.find((loc) => loc.id === params.id)
    if (!location) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 })
    }

    // Validate QR code (in real app, this would be more secure)
    const expectedQrCode = `${location.id}-${action}`
    if (qrCode !== expectedQrCode) {
      return NextResponse.json({ success: false, error: "Invalid QR code" }, { status: 400 })
    }

    // Calculate points based on action
    const pointsMap: Record<string, number> = {
      "water-refill": 5,
      "waste-deposit": 20,
      "eco-meal": 15,
      "story-unlock": 10,
    }

    const pointsEarned = pointsMap[action] || 0

    // In a real app, you would save this to a database
    const checkinData = {
      id: `checkin-${Date.now()}`,
      userId,
      locationId: params.id,
      action,
      pointsEarned,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: {
        checkin: checkinData,
        pointsEarned,
        location: location.name,
        action,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }
}
