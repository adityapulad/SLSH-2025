"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Phone, X } from "lucide-react"

export function SOSButton() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  const handleSOSClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmSOS = async () => {
    setIsActivating(true)
    setShowConfirmation(false)

    // Simulate activation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would trigger an Android Intent to launch Google Personal Safety
    // For web demo, we'll show a success message
    alert("Emergency contacts have been notified with your location. Stay safe!")

    setIsActivating(false)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <>
      {/* SOS Button - Fixed position */}
      <Button
        onClick={handleSOSClick}
        disabled={isActivating}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-lg border-4 border-white"
        size="lg"
      >
        {isActivating ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
        ) : (
          <AlertTriangle className="h-8 w-8 text-white" />
        )}
      </Button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Emergency SOS</h2>
                <p className="text-gray-600 mb-6">
                  This will immediately share your location with your emergency contacts and alert local authorities if
                  configured.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmSOS} className="flex-1 bg-red-600 hover:bg-red-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Activate SOS
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Only use in genuine emergencies. False alarms may result in unnecessary emergency response.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
