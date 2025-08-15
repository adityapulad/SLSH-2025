import { type NextRequest, NextResponse } from "next/server"
import { mockEcoLocations } from "@/data/mock-data"

// Himachal Pradesh specific achievements and bonus points
const himachalBonuses = {
  "mountain-location": 5, // Extra points for mountain locations
  "heritage-site": 10,    // Extra points for cultural heritage
  "high-altitude": 8,     // Extra points for high altitude locations
  "local-culture": 12,    // Extra points for cultural interactions
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId, qrCode, action, timestamp } = body

    // Validate required fields
    if (!userId || !qrCode || !action) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: userId, qrCode, and action are required"
      }, { status: 400 })
    }

    // Find the location
    const location = mockEcoLocations.find((loc) => loc.id === params.id)
    if (!location) {
      return NextResponse.json({ success: false, error: "Eco-location not found in Himachal Pradesh network" }, { status: 404 })
    }

    // Validate QR code matches the location's QR code
    if (qrCode !== location.qrCode) {
      return NextResponse.json({
        success: false,
        error: "QR code mismatch. Please scan the correct QR code at this eco-location."
      }, { status: 400 })
    }

    // Find the specific action for this location
    const availableAction = location.availableActions.find(act => act.type === action)
    if (!availableAction) {
      return NextResponse.json({
        success: false,
        error: `Action '${action}' not available at this location`
      }, { status: 400 })
    }

    // Calculate base points
    let pointsEarned = availableAction.points

    // Add Himachal Pradesh specific bonuses
    let bonusPoints = 0
    let bonusReasons: string[] = []

    // Mountain location bonus
    if (location.latitude > 30.0 && location.latitude < 33.0) { // Himachal latitude range
      bonusPoints += himachalBonuses["mountain-location"]
      bonusReasons.push("Mountain location bonus")
    }

    // Heritage site bonus
    if (location.type === "cultural-heritage") {
      bonusPoints += himachalBonuses["heritage-site"]
      bonusReasons.push("Cultural heritage site bonus")
    }

    // High altitude bonus (above 2000m)
    if (location.address.toLowerCase().includes("shimla") ||
        location.address.toLowerCase().includes("manali") ||
        location.address.toLowerCase().includes("dharamshala")) {
      bonusPoints += himachalBonuses["high-altitude"]
      bonusReasons.push("High altitude location bonus")
    }

    const totalPoints = pointsEarned + bonusPoints

    // Create check-in record
    const checkinData = {
      id: `checkin-${Date.now()}-${userId}`,
      userId,
      locationId: params.id,
      locationName: location.name,
      action: availableAction.type,
      actionDescription: availableAction.description,
      basePoints: pointsEarned,
      bonusPoints,
      totalPoints,
      bonusReasons,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      address: location.address,
      timestamp: timestamp || new Date().toISOString(),
      region: "Himachal Pradesh",
      checkinType: "qr-scan"
    }

    // Simulate saving to database (in real app, save to your database)
    console.log("Check-in recorded:", checkinData)

    // Unlock story if available
    let storyUnlocked = false
    if (location.story && action === "story-unlock") {
      storyUnlocked = true
    }

    return NextResponse.json({
      success: true,
      data: {
        checkin: checkinData,
        pointsEarned: totalPoints,
        basePoints: pointsEarned,
        bonusPoints,
        bonusReasons,
        location: location.name,
        action: availableAction.description,
        storyUnlocked,
        story: storyUnlocked ? location.story : null,
        message: `Successfully checked in at ${location.name}! You earned ${totalPoints} eco-points.`,
        nextActions: location.availableActions.filter(act => act.type !== action).slice(0, 2)
      },
    })
  } catch (error) {
    console.error("Check-in API error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to process check-in. Please try again."
    }, { status: 500 })
  }
}
