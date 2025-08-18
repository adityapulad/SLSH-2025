"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AppHeader } from "@/components/app-header"
import { MobileNavigation } from "@/components/mobile-navigation"
import { ArrowLeft, Bell, Shield, Globe, Smartphone, HelpCircle, FileText, Star, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function SettingsPage() {
  const { user, isGuest } = useAuth()
  const router = useRouter()

  // Settings state
  const [notifications, setNotifications] = useState(true)
  const [locationServices, setLocationServices] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [soundEffects, setSoundEffects] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  if (isGuest || !user) {
    router.push("/login")
    return null
  }

  const handleEmergencyContacts = () => {
    // Open emergency contacts management
    alert("Emergency contacts feature coming soon!")
  }

  const handleLanguageSettings = () => {
    // Open language selection
    alert("Language settings coming soon!")
  }

  const handlePrivacySettings = () => {
    // Open privacy settings
    alert("Privacy settings coming soon!")
  }

  const handleRateApp = () => {
    // Open app store rating
    window.open("https://play.google.com/store", "_blank")
  }

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: "PrithviPath - Sustainable Tourism",
        text: "Join me on PrithviPath for sustainable travel in India!",
        url: window.location.origin,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin)
      alert("App link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AppHeader />

      <div className="px-3 sm:px-4 py-4 sm:py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Notifications */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-gray-500">Receive alerts about eco-activities</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Sound Effects</Label>
                <p className="text-xs text-gray-500">Play sounds for actions</p>
              </div>
              <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Location Services</Label>
                <p className="text-xs text-gray-500">Allow location tracking for eco-spots</p>
              </div>
              <Switch checked={locationServices} onCheckedChange={setLocationServices} />
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={handlePrivacySettings}
            >
              <Shield className="h-4 w-4" />
              Privacy Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={handleEmergencyContacts}
            >
              <Smartphone className="h-4 w-4" />
              Emergency Contacts
            </Button>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smartphone className="h-5 w-5" />
              App Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-gray-500">Switch to dark theme</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Offline Mode</Label>
                <p className="text-xs text-gray-500">Download maps for offline use</p>
              </div>
              <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={handleLanguageSettings}
            >
              <Globe className="h-4 w-4" />
              Language Settings
            </Button>
          </CardContent>
        </Card>

        {/* Support & Feedback */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5" />
              Support & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={() => router.push("/help")}
            >
              <HelpCircle className="h-4 w-4" />
              Help & FAQ
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 bg-transparent"
              onClick={() => router.push("/terms")}
            >
              <FileText className="h-4 w-4" />
              Terms & Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={handleRateApp}>
              <Star className="h-4 w-4" />
              Rate PrithviPath
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 bg-transparent" onClick={handleShareApp}>
              <Share2 className="h-4 w-4" />
              Share App
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-500">
              <p>PrithviPath v1.0.0</p>
              <p className="mt-1">Sustainable Tourism for India</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <MobileNavigation />
    </div>
  )
}
