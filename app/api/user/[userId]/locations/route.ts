import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  // In a real app, you would fetch user's visited locations from database
  // For now, return mock data
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

  return NextResponse.json({
    success: true,
    data: mockUserLocations,
  })
}
