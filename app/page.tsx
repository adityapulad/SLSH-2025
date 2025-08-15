"use client"

import { useAuth } from "@/contexts/auth-context"
import { useGamification } from "@/contexts/gamification-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppHeader } from "@/components/app-header"
import { MobileNavigation } from "@/components/mobile-navigation"
import { EcoMap } from "@/components/eco-map"
import { Loader2, MapPin, QrCode, Droplets, Trash2, TestTube, Footprints, TreePine } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const { totalPoints, todayStats } = useGamification()
  const router = useRouter()
  const [mapLoading, setMapLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setMapLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading PrithviPath...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Welcome to <span className="text-green-600">PrithviPath</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your indispensable mobile companion for sustainable tourism in India. Discover eco-friendly spots, earn
              rewards, and connect with local culture.
            </p>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 sm:px-8 text-base sm:text-lg h-12 sm:h-14 min-w-[160px]"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader />

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 h-48 sm:h-64 relative overflow-hidden">
          {mapLoading ? (
            <div className="flex items-center justify-center h-full p-4">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Loading Google Maps</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4">Please wait a moment...</p>
                <div className="w-32 sm:w-48 h-2 bg-gray-200 rounded-full mx-auto">
                  <div className="w-20 sm:w-32 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
              <Button
                onClick={() => router.push("/map")}
                className="bg-green-600 hover:bg-green-700 text-white h-11 px-6 text-sm sm:text-base"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Open Interactive Map
              </Button>
            </div>
          )}

          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm">
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                <span className="text-gray-600">Himachal Pradesh</span>
              </div>
              <div className="flex items-center space-x-1">
                <TreePine className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                <span className="text-gray-600">32 Eco-Locations</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Button
            variant="outline"
            className="flex flex-col items-center py-3 sm:py-4 h-auto bg-white hover:bg-gray-50 border-gray-200 min-h-[80px] sm:min-h-[90px]"
            onClick={() => router.push("/scan")}
          >
            <QrCode className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
            <span className="text-xs sm:text-sm font-medium">Scan QR</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center py-3 sm:py-4 h-auto bg-white hover:bg-gray-50 border-gray-200 min-h-[80px] sm:min-h-[90px]"
          >
            <Droplets className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 text-blue-500" />
            <span className="text-xs sm:text-sm font-medium">Refill Water</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center py-3 sm:py-4 h-auto bg-white hover:bg-gray-50 border-gray-200 min-h-[80px] sm:min-h-[90px]"
          >
            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 text-orange-500" />
            <span className="text-xs sm:text-sm font-medium">Dispose Waste</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center py-3 sm:py-4 h-auto bg-white hover:bg-gray-50 border-gray-200 min-h-[80px] sm:min-h-[90px]"
          >
            <TestTube className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2 text-purple-500" />
            <span className="text-xs sm:text-sm font-medium">QR Demo</span>
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Your Impact Today</h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <Droplets className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mx-auto mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">3</div>
                <div className="text-xs sm:text-sm text-gray-500 leading-tight">Bottles Refilled</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mx-auto mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">2</div>
                <div className="text-xs sm:text-sm text-gray-500 leading-tight">Waste Disposed</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 text-center">
                <Footprints className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mx-auto mb-1 sm:mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-gray-900">8.2</div>
                <div className="text-xs sm:text-sm text-gray-500 leading-tight">km Walked</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </div>
  )
}
