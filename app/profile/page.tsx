"use client"

import { UserDashboard } from "@/components/user-dashboard"
import { PageHeader } from "@/components/page-header"
import { MobileNavigation } from "@/components/mobile-navigation"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <PageHeader
        title="Profile"
        rightAction="settings"
        onRightAction={() => {
          // Handle settings action
          console.log("Settings clicked")
        }}
      />

      <UserDashboard />

      <MobileNavigation />
    </div>
  )
}
