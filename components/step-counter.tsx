"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Footprints, Trophy } from "lucide-react"
import { useGamification } from "@/contexts/gamification-context"

export function StepCounter() {
  const { dailySteps, stepPoints, simulateSteps } = useGamification()

  const stepMilestones = [
    { steps: 5000, points: 50, label: "5K Steps" },
    { steps: 8000, points: 100, label: "8K Steps" },
    { steps: 12000, points: 200, label: "12K Steps" },
    { steps: 15000, points: 300, label: "15K Steps" },
  ]

  const nextMilestone = stepMilestones.find((m) => dailySteps < m.steps)
  const currentMilestone = stepMilestones.filter((m) => dailySteps >= m.steps).pop()
  const progressPercentage = nextMilestone ? (dailySteps / nextMilestone.steps) * 100 : 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Footprints className="h-5 w-5 text-purple-500" />
          Daily Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600">{dailySteps.toLocaleString()}</div>
          <div className="text-sm text-gray-600">steps today</div>
        </div>

        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {nextMilestone.label}</span>
              <span>{nextMilestone.steps - dailySteps} steps to go</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        {currentMilestone && (
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <Trophy className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">
              Earned {currentMilestone.points} points for {currentMilestone.label}!
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {stepMilestones.map((milestone) => (
            <div
              key={milestone.steps}
              className={`p-2 rounded text-center text-xs ${
                dailySteps >= milestone.steps ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-600"
              }`}
            >
              <div className="font-medium">{milestone.label}</div>
              <div>+{milestone.points} pts</div>
            </div>
          ))}
        </div>

        {/* Demo buttons for testing */}
        <div className="space-y-2 pt-4 border-t">
          <div className="text-xs text-gray-500 text-center">Demo Controls</div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" onClick={() => simulateSteps(6000)}>
              6K Steps
            </Button>
            <Button size="sm" variant="outline" onClick={() => simulateSteps(10000)}>
              10K Steps
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
