"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CheckCircle, AlertCircle, Scan, CameraOff, RefreshCw } from "lucide-react"
import { mockEcoLocations } from "@/data/mock-data"
import { useGamification } from "@/contexts/gamification-context"
import { PointsAnimation } from "./points-animation"
import type { EcoLocation } from "@/types"
import jsQR from "jsqr"

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [scannedCode, setScannedCode] = useState("")
  const [scanResult, setScanResult] = useState<{
    success: boolean
    location?: EcoLocation
    action?: any
    points?: number
    basePoints?: number
    bonusPoints?: number
    bonusReasons?: string[]
    message: string
    storyUnlocked?: boolean
    story?: any
    nextActions?: any[]
  } | null>(null)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [animationData, setAnimationData] = useState({ points: 0, action: "" })
  const [stream, setStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { earnPoints } = useGamification()

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prefer back camera on mobile
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        setStream(mediaStream)
        setIsCameraActive(true)
        startQRDetection()
      }
    } catch (error) {
      console.error("Camera access error:", error)
      setCameraError(
        error instanceof Error && error.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access and try again."
          : "Unable to access camera. Please check your camera settings or use manual input.",
      )
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsCameraActive(false)
  }

  // QR Code detection using Canvas
  const startQRDetection = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }

    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && !isScanning) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Get image data for QR detection
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

          // Simple QR detection simulation (in real implementation, use a QR library)
          // For demo purposes, we'll detect based on manual input or demo codes
          detectQRFromImageData(imageData)
        }
      }
    }, 500) // Check every 500ms
  }

  // Real QR detection using jsQR
  const detectQRFromImageData = (imageData: ImageData) => {
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code && code.data) {
        // Found a QR code, process it
        console.log("QR Code detected:", code.data)
        handleScan(code.data)

        // Stop scanning temporarily to prevent multiple scans
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current)
          scanIntervalRef.current = null
        }

        // Restart scanning after a delay
        setTimeout(() => {
          if (isCameraActive && !isScanning) {
            startQRDetection()
          }
        }, 3000)
      }
    } catch (error) {
      console.error("QR detection error:", error)
    }
  }

  const handleScan = async (qrCode: string) => {
    if (isScanning) return

    setIsScanning(true)

    try {
      // Find location by QR code first for UI feedback
      const location = mockEcoLocations.find((loc) => loc.qrCode === qrCode)

      if (!location) {
        setScanResult({
          success: false,
          message: "Invalid QR code. Please scan a valid eco-location QR code from Himachal Pradesh.",
        })
        setIsScanning(false)
        return
      }

      // Get the first available action (in real app, user would select)
      const action = location.availableActions[0]
      if (!action) {
        setScanResult({
          success: false,
          message: "No eco-actions available at this location.",
        })
        setIsScanning(false)
        return
      }

      // Call the enhanced check-in API
      const response = await fetch(`/api/locations/${location.id}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'demo-user-123', // In real app, get from auth context
          qrCode: qrCode,
          action: action.type,
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json()

      if (!result.success) {
        setScanResult({
          success: false,
          message: result.error || "Check-in failed. Please try again.",
        })
        setIsScanning(false)
        return
      }

      // Award points through gamification system
      await earnPoints(action.type, result.data.totalPoints, location.id)

      // Show success result with enhanced data
      setScanResult({
        success: true,
        location,
        action: {
          ...action,
          description: result.data.action
        },
        points: result.data.totalPoints,
        basePoints: result.data.basePoints,
        bonusPoints: result.data.bonusPoints,
        bonusReasons: result.data.bonusReasons,
        message: result.data.message,
        storyUnlocked: result.data.storyUnlocked,
        story: result.data.story,
        nextActions: result.data.nextActions
      })

      // Show points animation
      setAnimationData({
        points: result.data.totalPoints,
        action: result.data.action,
        bonus: result.data.bonusPoints > 0
      })
      setShowPointsAnimation(true)

    } catch (error) {
      console.error('Check-in error:', error)
      setScanResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      })
    }

    setIsScanning(false)
  }

  const handleManualScan = () => {
    if (scannedCode.trim()) {
      handleScan(scannedCode.trim())
    }
  }

  const handleQuickScan = (qrCode: string) => {
    setScannedCode(qrCode)
    handleScan(qrCode)
  }

  const resetScanner = () => {
    setScanResult(null)
    setScannedCode("")
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 safe-area-inset">
      <div className="max-w-md mx-auto space-y-4 sm:space-y-6">
        {/* Scanner Header */}
        <Card>
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
              <QrCode className="h-6 w-6 text-green-600" />
              QR Code Scanner
            </CardTitle>
            <p className="text-sm text-gray-600">Scan QR codes at eco-locations to earn points</p>
          </CardHeader>
        </Card>

        {/* Camera Interface */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="relative">
              <div className="aspect-square bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                {isCameraActive ? (
                  <>
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />
                    {/* Scanning overlay */}
                    <div className="absolute inset-4 border-2 border-green-400 rounded-lg">
                      <div className="absolute inset-0 border border-green-400 rounded-lg animate-pulse" />
                    </div>
                    {isScanning && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Scan className="h-12 w-12 mx-auto mb-2 animate-pulse" />
                          <p className="text-sm">Processing QR Code...</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : cameraError ? (
                  <div className="text-center text-red-400 p-4">
                    <CameraOff className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-sm mb-4">{cameraError}</p>
                    <Button
                      onClick={startCamera}
                      variant="outline"
                      size="sm"
                      className="h-11 px-6 active:scale-95 transition-transform bg-transparent"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Camera
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-sm mb-2">Camera Ready</p>
                    <Button
                      onClick={startCamera}
                      variant="outline"
                      size="sm"
                      className="h-11 px-6 active:scale-95 transition-transform bg-transparent"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {isCameraActive && (
                <div className="flex justify-center gap-2 mb-4">
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    size="sm"
                    className="h-11 px-6 active:scale-95 transition-transform bg-transparent"
                  >
                    <CameraOff className="h-4 w-4 mr-2" />
                    Stop Camera
                  </Button>
                </div>
              )}

              {/* Manual Input */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter QR code manually"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    disabled={isScanning}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleManualScan}
                    disabled={isScanning || !scannedCode.trim()}
                    className="h-11 px-6 active:scale-95 transition-transform"
                  >
                    Scan
                  </Button>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {isCameraActive
                    ? "Point camera at QR code or enter manually"
                    : "Use camera or enter QR code manually"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Scan Options (Demo) */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base sm:text-lg">Demo QR Codes</CardTitle>
            <p className="text-sm text-gray-600">Try these sample QR codes</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockEcoLocations.slice(0, 5).map((location) => (
              <div key={location.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{location.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{location.qrCode}</div>
                  <div className="flex gap-1 mt-1">
                    {location.availableActions.map((action) => (
                      <Badge key={action.id} variant="outline" className="text-xs">
                        +{action.points} pts
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickScan(location.qrCode)}
                  className="h-10 px-4 ml-3 active:scale-95 transition-transform flex-shrink-0"
                >
                  Scan
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Scan Result */}
        {scanResult && (
          <Card className={scanResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                {scanResult.success ? (
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                )}

                <h3
                  className={`font-semibold mb-2 text-base sm:text-lg ${scanResult.success ? "text-green-800" : "text-red-800"}`}
                >
                  {scanResult.success ? "Check-in Successful!" : "Scan Failed"}
                </h3>

                <p className={`text-sm mb-4 ${scanResult.success ? "text-green-700" : "text-red-700"}`}>
                  {scanResult.message}
                </p>

                {scanResult.success && scanResult.location && scanResult.action && (
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="font-medium text-sm sm:text-base">{scanResult.location.name}</div>
                      <div className="text-sm text-gray-600">{scanResult.location.address}</div>
                      <div className="text-xs text-blue-600 mt-1">📍 Himachal Pradesh</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <Badge className="bg-green-100 text-green-800">{scanResult.action.description}</Badge>
                        <Badge className="bg-yellow-100 text-yellow-800">+{scanResult.points} total points</Badge>
                      </div>

                      {scanResult.bonusPoints && scanResult.bonusPoints > 0 && (
                        <div className="text-center">
                          <div className="text-xs text-green-700 font-medium">
                            Base: {scanResult.basePoints} + Bonus: {scanResult.bonusPoints} points
                          </div>
                          {scanResult.bonusReasons && scanResult.bonusReasons.length > 0 && (
                            <div className="text-xs text-green-600 mt-1">
                              🎯 {scanResult.bonusReasons.join(", ")}
                            </div>
                          )}
                        </div>
                      )}

                      {scanResult.storyUnlocked && (
                        <Badge className="bg-purple-100 text-purple-800 w-full justify-center">
                          🏛️ Cultural Story Unlocked!
                        </Badge>
                      )}
                    </div>

                    <img
                      src={scanResult.location.image || "/placeholder.svg"}
                      alt={scanResult.location.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />

                    {scanResult.nextActions && scanResult.nextActions.length > 0 && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-800 mb-2">More actions available:</div>
                        <div className="space-y-1">
                          {scanResult.nextActions.map((nextAction, index) => (
                            <div key={index} className="text-xs text-blue-700">
                              • {nextAction.description} (+{nextAction.points} pts)
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={resetScanner}
                  className="mt-4 h-11 px-6 active:scale-95 transition-transform"
                  variant={scanResult.success ? "default" : "outline"}
                >
                  Scan Another Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p className="font-medium">How to use:</p>
              <div className="text-left space-y-1 text-xs sm:text-sm">
                <p>1. Click "Start Camera" to activate your webcam</p>
                <p>2. Point your camera at a QR code at an eco-location</p>
                <p>3. The code will be detected automatically</p>
                <p>4. Complete the eco-action to earn points</p>
                <p>5. Use manual input if camera is not available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Animation */}
      <PointsAnimation
        points={animationData.points}
        action={animationData.action}
        show={showPointsAnimation}
        onComplete={() => setShowPointsAnimation(false)}
      />
    </div>
  )
}
