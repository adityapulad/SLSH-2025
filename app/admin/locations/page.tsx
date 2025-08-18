"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus, MapPin, Star, MoreHorizontal, Droplets, Trash2, Coffee, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function AdminLocationsPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  if (!isAdmin || !user) {
    router.push("/login")
    return null
  }

  const locations = [
    {
      id: "1",
      name: "Himalayan Eco Cafe",
      type: "eco-restaurant",
      address: "Mall Road, Shimla, HP",
      rating: 4.8,
      status: "active",
      visits: 1250,
      icon: Coffee,
    },
    {
      id: "2",
      name: "Mountain Water Station",
      type: "water-refill",
      address: "Ridge Road, Manali, HP",
      rating: 4.9,
      status: "active",
      visits: 890,
      icon: Droplets,
    },
    {
      id: "3",
      name: "Eco Waste Center",
      type: "waste-disposal",
      address: "Green Valley, Dharamshala, HP",
      rating: 4.6,
      status: "active",
      visits: 567,
      icon: Trash2,
    },
    {
      id: "4",
      name: "Cultural Heritage Site",
      type: "cultural-site",
      address: "Old Town, Kullu, HP",
      rating: 4.7,
      status: "pending",
      visits: 234,
      icon: Camera,
    },
  ]

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "water-refill":
        return "bg-blue-100 text-blue-800"
      case "eco-restaurant":
        return "bg-green-100 text-green-800"
      case "waste-disposal":
        return "bg-orange-100 text-orange-800"
      case "cultural-site":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeName = (type: string) => {
    switch (type) {
      case "water-refill":
        return "Water Refill"
      case "eco-restaurant":
        return "Eco Restaurant"
      case "waste-disposal":
        return "Waste Disposal"
      case "cultural-site":
        return "Cultural Site"
      default:
        return type
    }
  }

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
              <h1 className="text-xl font-bold text-gray-900">Location Management</h1>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search locations by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => {
            const IconComponent = location.icon
            return (
              <Card key={location.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(location.type)}`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{location.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{location.address}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{location.rating}</span>
                    </div>
                    <div className="text-sm text-gray-500">{location.visits} visits</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(location.type)}>{getTypeName(location.type)}</Badge>
                    <Badge variant={location.status === "active" ? "default" : "secondary"}>{location.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredLocations.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-500">Try adjusting your search terms or add a new location.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
