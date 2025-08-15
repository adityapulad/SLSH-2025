"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Droplets, Utensils, Recycle, BookOpen, Footprints } from "lucide-react"
import { useGamification } from "@/contexts/gamification-context"

export function RecentActivity() {
  const { recentCheckIns } = useGamification()

  const getActionIcon = (actionType: string) => {
    if (actionType.includes("water-refill")) return <Droplets className="h-4 w-4 text-blue-500" />
    if (actionType.includes("waste-deposit")) return <Recycle className="h-4 w-4 text-orange-500" />
    if (actionType.includes("restaurant")) return <Utensils className="h-4 w-4 text-green-500" />
    if (actionType.includes("story")) return <BookOpen className="h-4 w-4 text-purple-500" />
    if (actionType.includes("steps")) return <Footprints className="h-4 w-4 text-purple-500" />
    return <Clock className="h-4 w-4 text-gray-500" />
  }

  const formatActionType = (actionType: string) => {
    return actionType.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (recentCheckIns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Start exploring to see your eco-actions here!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentCheckIns.slice(0, 5).map((checkIn) => (
            <div key={checkIn.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {getActionIcon(checkIn.actionType)}
              <div className="flex-1">
                <div className="font-medium text-sm">{formatActionType(checkIn.actionType)}</div>
                <div className="text-xs text-gray-500">{formatTimeAgo(checkIn.timestamp)}</div>
              </div>
              <Badge className="bg-green-100 text-green-800 text-xs">+{checkIn.pointsEarned} pts</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
