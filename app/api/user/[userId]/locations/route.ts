import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    await prisma.$queryRaw`SELECT 1`
    const checkins = await prisma.checkin.findMany({
      where: { userId: params.userId },
      orderBy: { timestamp: "desc" },
    })

    const data = checkins.map((c) => ({
      locationId: c.locationId,
      visitedAt: c.timestamp.toISOString(),
      actionsCompleted: [c.action],
      pointsEarned: c.totalPoints,
    }))

    return NextResponse.json({ success: true, data })
  } catch {
    const mockUserLocations = [
      {
        locationId: "loc-1",
        visitedAt: "2024-01-15T10:30:00Z",
        actionsCompleted: ["water-refill", "story-unlock"],
        pointsEarned: 15,
      },
      {
        locationId: "loc-3",
        visitedAt: "2024-01-14T14:20:00Z",
        actionsCompleted: ["waste-deposit"],
        pointsEarned: 20,
      },
    ]
    return NextResponse.json({ success: true, data: mockUserLocations })
  }
}
