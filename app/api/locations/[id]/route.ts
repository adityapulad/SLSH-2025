import { type NextRequest, NextResponse } from "next/server"
import { mockEcoLocations } from "@/data/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const location = mockEcoLocations.find((loc) => loc.id === params.id)

  if (!location) {
    return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: location,
  })
}
