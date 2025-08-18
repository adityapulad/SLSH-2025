import { type NextRequest, NextResponse } from "next/server"
import { getLocations } from "@/lib/repository"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const search = searchParams.get("search")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius")

  const locations = await getLocations({
    type,
    search,
    lat: lat ? Number.parseFloat(lat) : null,
    lng: lng ? Number.parseFloat(lng) : null,
    radius: radius ? Number.parseFloat(radius) : null,
  })

  return NextResponse.json({ success: true, data: locations, total: locations.length })
}
