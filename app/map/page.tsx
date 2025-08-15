"use client"

import { EcoMap } from "@/components/eco-map"
import { PageHeader } from "@/components/page-header"
import { MobileNavigation } from "@/components/mobile-navigation"
import { GeofenceNotification } from "@/components/geofence-notification"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function MapPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="relative h-screen pb-16">
      <PageHeader
        title="Eco-Map"
        showBack={false}
        rightAction="profile"
        onRightAction={() => router.push("/profile")}
        className="bg-white/90 backdrop-blur-sm"
      />

      <div className="h-full pt-16">
        <EcoMap />
      </div>

      {user && (
        <div className="absolute top-20 left-3 sm:left-4 z-20">
          <div className="bg-green-600 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            {user.ecoPoints} Eco-Points
          </div>
        </div>
      )}

      <GeofenceNotification />

      <MobileNavigation />
    </div>
  )
}
