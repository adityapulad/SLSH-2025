"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Phone, Loader2 } from "lucide-react"

interface PhoneAuthButtonProps {
  userType: "user" | "admin"
}

export function PhoneAuthButton({ userType }: PhoneAuthButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithPhone } = useAuth() // Using new loginWithPhone method
  const router = useRouter()

  const handleSendOTP = async () => {
    if (!phoneNumber) return

    setIsLoading(true)
    try {
      // Simulate OTP sending
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep("otp")
    } catch (error) {
      console.error("Failed to send OTP:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) return

    setIsLoading(true)
    try {
      await loginWithPhone(phoneNumber, otp, userType) // Using enhanced auth method

      setIsOpen(false)
      setStep("phone")
      setPhoneNumber("")
      setOtp("")

      // Redirect based on user type
      if (userType === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("OTP verification failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-3 bg-transparent">
          <Phone className="h-4 w-4" />
          Continue with Phone
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === "phone" ? "Enter Phone Number" : "Verify OTP"}</DialogTitle>
        </DialogHeader>

        {step === "phone" ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button onClick={handleSendOTP} disabled={!phoneNumber || isLoading} className="w-full">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send OTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="mt-1 text-center text-lg tracking-widest"
              />
            </div>
            <div className="text-sm text-gray-600 text-center">OTP sent to {phoneNumber}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("phone")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleVerifyOTP} disabled={!otp || otp.length !== 6 || isLoading} className="flex-1">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Verify
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
