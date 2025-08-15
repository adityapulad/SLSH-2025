"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AppHeader } from "@/components/app-header"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ArrowLeft, Gift, Star, TreePine, Coffee, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RewardsPage() {
  const { user, isGuest } = useAuth()
  const router = useRouter()

  if (isGuest || !user) {
    router.push("/login")
    return null
  }

  const rewards = [
    {
      id: 1,
      title: "Free Coffee",
      description: "Get a free coffee at partner cafes",
      points: 100,
      icon: Coffee,
      available: user.ecoPoints >= 100,
    },
    {
      id: 2,
      title: "Eco-Friendly Bag",
      description: "Sustainable jute bag from local artisans",
      points: 250,
      icon: ShoppingBag,
      available: user.ecoPoints >= 250,
    },
    {
      id: 3,
      title: "Tree Planting",
      description: "Plant a tree in your name",
      points: 500,
      icon: TreePine,
      available: user.ecoPoints >= 500,
    },
    {
      id: 4,
      title: "Premium Features",
      description: "Unlock premium app features for 1 month",
      points: 750,
      icon: Star,
      available: user.ecoPoints >= 750,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader />

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Rewards</h1>
        </div>

        {/* Points Balance */}
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-1">Your Eco Points</h2>
                <div className="text-3xl font-bold">{user.ecoPoints}</div>
              </div>
              <Gift className="h-12 w-12 opacity-80" />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to next reward</span>
                <span>{user.ecoPoints}/1000</span>
              </div>
              <Progress value={(user.ecoPoints / 1000) * 100} className="bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h2>
          <div className="space-y-4">
            {rewards.map((reward) => {
              const IconComponent = reward.icon
              return (
                <Card key={reward.id} className={`${reward.available ? "border-green-200 bg-green-50" : "opacity-60"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          reward.available ? "bg-green-100" : "bg-gray-100"
                        }`}
                      >
                        <IconComponent className={`h-6 w-6 ${reward.available ? "text-green-600" : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{reward.title}</h3>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{reward.points} points</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={!reward.available}
                        className={reward.available ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        {reward.available ? "Redeem" : "Locked"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How to Earn Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">10</span>
              </div>
              <span className="text-sm">Refill water bottle at eco-stations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">15</span>
              </div>
              <span className="text-sm">Properly dispose waste at designated areas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">25</span>
              </div>
              <span className="text-sm">Visit new eco-friendly locations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">50</span>
              </div>
              <span className="text-sm">Complete daily eco-challenges</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileNavigation />
    </div>
  )
}
