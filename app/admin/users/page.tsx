"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Filter, MoreHorizontal, UserPlus, Shield, User, Ban, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  if (!isAdmin || !user) {
    router.push("/login")
    return null
  }

  const users = [
    {
      id: "1",
      name: "Priya Sharma",
      email: "priya@example.com",
      userType: "user",
      ecoPoints: 1250,
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      userType: "user",
      ecoPoints: 890,
      status: "active",
      joinDate: "2024-01-20",
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Admin User",
      email: "admin@prithvipath.com",
      userType: "admin",
      ecoPoints: 0,
      status: "active",
      joinDate: "2024-01-01",
      lastActive: "Online",
    },
    {
      id: "4",
      name: "Inactive User",
      email: "inactive@example.com",
      userType: "user",
      ecoPoints: 45,
      status: "inactive",
      joinDate: "2024-02-01",
      lastActive: "2 weeks ago",
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Eco Points</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={user.userType === "admin" ? "destructive" : "secondary"}>
                          {user.userType === "admin" ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <User className="h-3 w-3 mr-1" />
                              User
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium">{user.ecoPoints.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>
                          {user.status === "active" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <Ban className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{user.lastActive}</td>
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
