import { type NextRequest, NextResponse } from "next/server"
import { getLocationById } from "@/lib/repository"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const location = await getLocationById(params.id)
  if (!location) {
    return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: location })
}
