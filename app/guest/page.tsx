"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TreePine, MapPin, Info, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function GuestPage() {
  const [isGuestSession, setIsGuestSession] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const guestSession = localStorage.getItem("guestSession")
    if (!guestSession) {
      router.push("/login")
      return
    }
    setIsGuestSession(true)
  }, [router])

  if (!isGuestSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <TreePine className="h-6 w-6 text-green-600 mr-2" />
            <h1 className="text-lg font-bold text-gray-900">PrithviPath</h1>
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Guest</span>
          </div>
          <Link href="/login">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Welcome Message */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Welcome, Guest!</h3>
                <p className="text-sm text-blue-800">
                  You're exploring PrithviPath in guest mode. Sign up to unlock rewards, track your impact, and access
                  all features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limited Features */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <MapPin className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Explore Locations</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Discover eco-friendly spots and sustainable tourism locations across India.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                View Map
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow opacity-60">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <TreePine className="h-6 w-6 text-gray-400 mr-2" />
                <h3 className="font-semibold text-gray-500">Eco Rewards</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Track your sustainable actions and earn eco-points. Available for registered users only.
              </p>
              <Button variant="outline" disabled className="w-full bg-transparent">
                Sign Up Required
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <TreePine className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start Your Eco Journey?</h3>
            <p className="text-gray-600 mb-4">
              Join thousands of sustainable travelers making a positive impact across India.
            </p>
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700">Create Account</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
