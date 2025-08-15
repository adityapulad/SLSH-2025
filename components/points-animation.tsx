"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface PointsAnimationProps {
  points: number
  action: string
  show: boolean
  onComplete: () => void
}

export function PointsAnimation({ points, action, show, onComplete }: PointsAnimationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-300">
      <Card className="mx-4 animate-in zoom-in-95 duration-500">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">+{points} Eco-Points!</h2>
          <p className="text-gray-600 capitalize">{action.replace("-", " ")} completed</p>
          <div className="mt-4 text-sm text-gray-500">Great job being eco-friendly!</div>
        </CardContent>
      </Card>
    </div>
  )
}
