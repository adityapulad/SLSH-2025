"use client"

import { QRScanner } from "@/components/qr-scanner"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ScanPage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="font-semibold text-lg">QR Scanner</h1>
          <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Points Display */}
      {user && (
        <div className="bg-white border-b px-4 py-2">
          <div className="text-center">
            <span className="text-sm text-gray-600">Current Points: </span>
            <span className="font-semibold text-green-600">{user.ecoPoints}</span>
          </div>
        </div>
      )}

      {/* Scanner Component */}
      <QRScanner />
    </div>
  )
}
