"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, BarChart3, Settings, Shield, TreePine, TrendingUp, Activity, Database } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth()
  const router = useRouter()

  if (!isAdmin || !user) {
    router.push("/login")
    return null
  }

  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Eco Locations",
      value: "156",
      change: "+3",
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Points Earned",
      value: "45.2K",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Sessions",
      value: "1,234",
      change: "+5%",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Location Management",
      description: "Add and manage eco-friendly locations",
      icon: MapPin,
      href: "/admin/locations",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Analytics",
      description: "View detailed usage analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "System Settings",
      description: "Configure app settings and features",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "New user registered",
      user: "Priya Sharma",
      time: "2 minutes ago",
      type: "user",
    },
    {
      id: 2,
      action: "Location added",
      user: "Admin",
      time: "15 minutes ago",
      type: "location",
    },
    {
      id: 3,
      action: "System backup completed",
      user: "System",
      time: "1 hour ago",
      type: "system",
    },
    {
      id: 4,
      action: "User reported issue",
      user: "Rajesh Kumar",
      time: "2 hours ago",
      type: "issue",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <TreePine className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">PrithviPath Admin</h1>
                <p className="text-sm text-gray-500">System Management Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon
                    return (
                      <Link key={index} href={action.href}>
                        <Button
                          variant="outline"
                          className="w-full h-auto p-4 flex items-start gap-4 hover:shadow-md transition-shadow bg-transparent"
                        >
                          <div
                            className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold text-gray-900">{action.title}</div>
                            <div className="text-sm text-gray-500 mt-1">{action.description}</div>
                          </div>
                        </Button>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "user"
                            ? "bg-blue-500"
                            : activity.type === "location"
                              ? "bg-green-500"
                              : activity.type === "system"
                                ? "bg-purple-500"
                                : "bg-red-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.user}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">Database</div>
                    <div className="text-sm text-gray-500">Operational</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">API Services</div>
                    <div className="text-sm text-gray-500">All systems normal</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-gray-900">Backup Status</div>
                    <div className="text-sm text-gray-500">Last backup: 2h ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
