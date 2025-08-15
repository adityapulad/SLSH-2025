"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { PhoneAuthButton } from "@/components/auth/phone-auth-button"
import { GuestSignIn } from "@/components/auth/guest-signin"
import { TreePine, Shield, Users } from "lucide-react"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("user")

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TreePine className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">PrithviPath</h1>
          </div>
          <p className="text-gray-600">Your sustainable travel companion</p>
        </div>

        {/* Login Options */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="user" className="flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3" />
                  User
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1 text-xs">
                  <Shield className="h-3 w-3" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="guest" className="flex items-center gap-1 text-xs">
                  <TreePine className="h-3 w-3" />
                  Guest
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900">User Portal</h3>
                  <p className="text-sm text-gray-600">Access your eco-journey and rewards</p>
                </div>

                <GoogleAuthButton userType="user" />
                <PhoneAuthButton userType="user" />

                <div className="text-center text-xs text-gray-500 mt-4">Track your sustainable travel impact</div>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900">Admin Portal</h3>
                  <p className="text-sm text-gray-600">Manage locations and user data</p>
                </div>

                <GoogleAuthButton userType="admin" />
                <PhoneAuthButton userType="admin" />

                <div className="text-center text-xs text-gray-500 mt-4">Administrative access required</div>
              </TabsContent>

              <TabsContent value="guest" className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="font-semibold text-gray-900">Guest Access</h3>
                  <p className="text-sm text-gray-600">Explore without creating an account</p>
                </div>

                <GuestSignIn />

                <div className="text-center text-xs text-gray-500 mt-4">Limited features available</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  )
}
