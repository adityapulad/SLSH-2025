"use client"

import { useAuth } from "@/contexts/auth-context"
import { useGamification } from "@/contexts/gamification-context"
import { Button } from "@/components/ui/button"
import { User, Leaf, Menu, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

export function AppHeader() {
  const { user } = useAuth()
  const { totalPoints } = useGamification()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <Image
            src="/logo.jpg"
            alt="PrithviPath Logo"
            width={32}
            height={32}
            className="rounded-full sm:w-10 sm:h-10 flex-shrink-0"
          />
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">PrithviPath</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Sustainable Travel</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {user && (
            <div className="flex items-center space-x-1 sm:space-x-2 text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-semibold text-sm sm:text-base">{totalPoints || user.ecoPoints}</span>
            </div>
          )}

          {user && (
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs font-semibold h-8"
              onClick={() => window.open("tel:112", "_self")}
            >
              <Phone className="h-3 w-3 mr-1" />
              SOS
            </Button>
          )}

          <div className="sm:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden sm:block">
            <Button variant="ghost" size="sm" onClick={() => router.push("/profile")} className="p-2 h-9 w-9">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden mt-2 py-2 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/profile")
              setIsMenuOpen(false)
            }}
            className="w-full justify-start text-left h-12"
          >
            <User className="h-4 w-4 mr-3" />
            Profile
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              router.push("/map")
              setIsMenuOpen(false)
            }}
            className="w-full justify-start text-left h-12"
          >
            <Leaf className="h-4 w-4 mr-3" />
            Eco Map
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              window.open("tel:112", "_self")
              setIsMenuOpen(false)
            }}
            className="w-full justify-start text-left h-12 bg-red-600 hover:bg-red-700 text-white mt-2"
          >
            <Phone className="h-4 w-4 mr-3" />
            Emergency SOS
          </Button>
        </div>
      )}
    </header>
  )
}
