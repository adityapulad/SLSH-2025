"use client"

import { useAuth } from "@/contexts/auth-context"
import { useGamification } from "@/contexts/gamification-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MapPin, 
  Calendar, 
  Trophy, 
  Droplets, 
  Trash2, 
  Footprints, 
  Camera,
  Settings,
  Edit,
  Star,
  TreePine
} from "lucide-react"

export function UserDashboard() {
  const { user } = useAuth()
  const { totalPoints, todayStats } = useGamification()

  if (!user) {
    return (
      <div className="p-4">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* User Profile Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-2">
                <Badge variant="secondary" className="mr-2">
                  <Trophy className="h-3 w-3 mr-1" />
                  {totalPoints} Eco-Points
                </Badge>
                <Badge variant="outline">
                  Level {Math.floor(totalPoints / 100) + 1}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Today's Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-500">Bottles Refilled</div>
            </div>
            <div className="text-center">
              <Trash2 className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-500">Waste Disposed</div>
            </div>
            <div className="text-center">
              <Footprints className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8.2</div>
              <div className="text-sm text-gray-500">km Walked</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Himachal Pradesh Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Himachal Pradesh Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <TreePine className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Mountain Explorer</div>
                <div className="text-xs text-gray-600">Visited 8 hill stations</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Droplets className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Himalayan Water Guardian</div>
                <div className="text-xs text-gray-600">50 refills in HP</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Trash2 className="h-6 w-6 text-orange-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Clean Hills Champion</div>
                <div className="text-xs text-gray-600">25 waste disposals</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Star className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Cultural Heritage Seeker</div>
                <div className="text-xs text-gray-600">Unlocked 5 HP stories</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Camera className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Shimla Specialist</div>
                <div className="text-xs text-gray-600">Completed Mall Road trail</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <MapPin className="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <div className="font-medium text-sm">DevBhoomi Devotee</div>
                <div className="text-xs text-gray-600">Visited 3 temples</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Himachal Pradesh Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Himachal Pradesh Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Regions Explored</span>
              <span className="text-sm text-gray-600">3/12</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-green-600">✓ Shimla</div>
              <div className="text-green-600">✓ Kullu</div>
              <div className="text-green-600">✓ Dharamshala</div>
              <div className="text-gray-400">○ Manali</div>
              <div className="text-gray-400">○ Kasauli</div>
              <div className="text-gray-400">○ Dalhousie</div>
              <div className="text-gray-400">○ Chamba</div>
              <div className="text-gray-400">○ Kinnaur</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity in Himachal Pradesh */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Activity in HP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <Droplets className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <div className="font-medium text-sm">Himalayan Water Refill</div>
                  <div className="text-xs text-gray-600">Mall Road, Shimla • +8 pts (3 bonus)</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">2 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <div className="font-medium text-sm">Heritage Site Check-in</div>
                  <div className="text-xs text-gray-600">Ridge, Shimla • +15 pts (10 bonus)</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">5 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <Trash2 className="h-5 w-5 text-orange-500 mr-3" />
                <div>
                  <div className="font-medium text-sm">Mountain Clean-up</div>
                  <div className="text-xs text-gray-600">Christ Church, Shimla • +25 pts (5 bonus)</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">1 day ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-purple-500 mr-3" />
                <div>
                  <div className="font-medium text-sm">Cultural Story Unlocked</div>
                  <div className="text-xs text-gray-600">Jakhu Temple • British Era Tale</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">2 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Notifications
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Data Export
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
