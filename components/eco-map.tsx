"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Navigation,
  Star,
  Droplets,
  Utensils,
  Recycle,
  Building,
  QrCode,
  BookOpen,
  Layers,
  Satellite,
  MapIcon,
  ChevronRight,
  Menu,
  X,
  Filter,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useStories } from "@/contexts/stories-context"
import type { EcoLocation } from "@/types"
import { fetchLocations } from "@/lib/api"

interface EcoMapProps {
  onLocationSelect?: (location: EcoLocation) => void
}

export function EcoMap({ onLocationSelect }: EcoMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<EcoLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [allLocations, setAllLocations] = useState<EcoLocation[]>([])
  const [filteredLocations, setFilteredLocations] = useState<EcoLocation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mapType, setMapType] = useState<"roadmap" | "satellite" | "terrain">("roadmap")
  const [mapCenter, setMapCenter] = useState({ lat: 31.1048, lng: 77.1734 }) // Shimla, HP
  const [zoom, setZoom] = useState(9)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showLocationDetails, setShowLocationDetails] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)

  const router = useRouter()
  const { unlockStory } = useStories()

  const mapRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const liveRegionRef = useRef<HTMLDivElement>(null)
  const locationDetailsRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const categories = {
    "water-refill": {
      name: "Water Refill Stations",
      icon: <Droplets className="h-4 w-4 text-blue-600" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    "eco-restaurant": {
      name: "Eco-Friendly Restaurants",
      icon: <Utensils className="h-4 w-4 text-green-600" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    "waste-disposal": {
      name: "Waste Disposal Points",
      icon: <Recycle className="h-4 w-4 text-orange-600" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    "cultural-heritage": {
      name: "Cultural Heritage Sites",
      icon: <Building className="h-4 w-4 text-purple-600" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    "eco-accommodation": {
      name: "Eco-Accommodations",
      icon: <Building className="h-4 w-4 text-indigo-600" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) return

    const touchY = e.touches[0].clientY
    const diff = touchStartY - touchY

    // Prevent default scrolling when swiping on location details
    if (showLocationDetails && Math.abs(diff) > 10) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartY) return

    const touchY = e.changedTouches[0].clientY
    const diff = touchStartY - touchY

    // Swipe down to close location details (threshold: 50px)
    if (showLocationDetails && diff < -50) {
      setShowLocationDetails(false)
      setSelectedLocation(null)
    }

    setTouchStartY(null)
  }

  const groupLocationsByCategory = (locations: EcoLocation[]) => {
    const grouped: Record<string, EcoLocation[]> = {}

    locations.forEach((location) => {
      const category = location.type
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(location)
    })

    return grouped
  }

  const loadLocations = async () => {
    setIsLoading(true)
    try {
      const response = await fetchLocations()
      if (response.success && response.data) {
        setAllLocations(response.data)
        setFilteredLocations(response.data)
      }
    } catch (error) {
      console.error("Failed to load locations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLocations()
    requestLocationPermission()
  }, [])

  // Request user location permission
  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser")
      return
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        })
      })

      const userPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      setUserLocation(userPos)
      setLocationPermission("granted")

      // If user is in Himachal Pradesh area, center map on their location
      if (userPos.lat >= 30.0 && userPos.lat <= 33.0 && userPos.lng >= 75.0 && userPos.lng <= 79.0) {
        setMapCenter(userPos)
        setZoom(12)
      }
    } catch (error) {
      console.log("Error getting location:", error)
      setLocationPermission("denied")
    }
  }

  useEffect(() => {
    const searchLocations = async () => {
      let filtered = allLocations

      if (selectedCategory) {
        filtered = filtered.filter((location) => location.type === selectedCategory)
      }

      if (searchQuery.trim()) {
        try {
          const response = await fetchLocations({
            search: searchQuery,
            type: selectedCategory || undefined,
          })
          if (response.success && response.data) {
            filtered = response.data
          }
        } catch (error) {
          console.error("Search failed:", error)
          filtered = filtered.filter(
            (location) =>
              location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
              location.type.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        }
      }

      setFilteredLocations(filtered)

      if (liveRegionRef.current) {
        const categoryText = selectedCategory
          ? ` in ${categories[selectedCategory as keyof typeof categories]?.name}`
          : ""
        const searchText = searchQuery ? ` matching "${searchQuery}"` : ""
        liveRegionRef.current.textContent = `Found ${filtered.length} eco-locations${categoryText}${searchText}`
      }
    }

    const timeoutId = setTimeout(searchLocations, 300)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, allLocations, selectedCategory])

  const getLocationIcon = (type: EcoLocation["type"]) => {
    switch (type) {
      case "water-refill":
        return <Droplets className="h-4 w-4 text-blue-600" aria-hidden="true" />
      case "eco-restaurant":
        return <Utensils className="h-4 w-4 text-green-600" aria-hidden="true" />
      case "waste-disposal":
        return <Recycle className="h-4 w-4 text-orange-600" aria-hidden="true" />
      case "cultural-heritage":
        return <Building className="h-4 w-4 text-purple-600" aria-hidden="true" />
      case "eco-accommodation":
        return <Building className="h-4 w-4 text-indigo-600" aria-hidden="true" />
      default:
        return <MapPin className="h-4 w-4 text-gray-600" aria-hidden="true" />
    }
  }

  const getLocationTypeDescription = (type: EcoLocation["type"]) => {
    switch (type) {
      case "water-refill":
        return "Water refill station"
      case "eco-restaurant":
        return "Eco-friendly restaurant"
      case "waste-disposal":
        return "Waste disposal point"
      case "cultural-heritage":
        return "Cultural heritage site"
      case "eco-accommodation":
        return "Eco-accommodation"
      default:
        return "Eco-location"
    }
  }

  const handleLocationClick = (location: EcoLocation) => {
    setSelectedLocation(location)
    onLocationSelect?.(location)

    setMapCenter({ lat: location.latitude, lng: location.longitude })
    setZoom(15)

    setShowLocationDetails(true)
    setIsSidebarOpen(false)

    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Selected ${location.name}, ${getLocationTypeDescription(location.type)} with ${location.ecoRating} star eco-rating. Map centered on location.`
    }
  }

  const recenterMap = () => {
    setSelectedLocation(null)
    setShowLocationDetails(false)
    setMapCenter({ lat: 31.1048, lng: 77.1734 }) // Back to Shimla
    setZoom(9)

    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = "Map recentered to Himachal Pradesh"
    }
  }

  const handleCheckIn = () => {
    router.push("/scan")
  }

  const handleUnlockStory = async () => {
    if (selectedLocation?.story) {
      const success = await unlockStory(selectedLocation.story.id)
      if (success) {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = `Story unlocked for ${selectedLocation.name}`
        }
      }
    }
  }

  const getGoogleMapsEmbedUrl = () => {
    let markersParam = ""

    // Add selected location marker
    if (selectedLocation) {
      markersParam = `&markers=color:red%7C${selectedLocation.latitude},${selectedLocation.longitude}`
    }

    // Add user location marker if available
    if (userLocation && !selectedLocation) {
      markersParam = `&markers=color:blue%7Clabel:You%7C${userLocation.lat},${userLocation.lng}`
    } else if (userLocation && selectedLocation) {
      markersParam += `&markers=color:blue%7Clabel:You%7C${userLocation.lat},${userLocation.lng}`
    }

    const baseUrl = `https://maps.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&t=${mapType}&z=${zoom}&output=embed${markersParam}`
    return baseUrl
  }

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
    setSelectedLocation(null)
    setShowLocationDetails(false)
    if (window.innerWidth < 640) {
      setShowFilters(false)
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading Himachal Pradesh eco-locations...</p>
        </div>
      </div>
    )
  }

  const groupedLocations = groupLocationsByCategory(filteredLocations)

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col sm:flex-row safe-area-inset">
      <div className="sm:hidden bg-white border-b border-gray-200 p-3 z-[1001] safe-area-pt">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 h-10 px-4 active:scale-95 transition-transform"
          >
            <Menu className="h-4 w-4" />
            <span className="font-medium">Locations ({filteredLocations.length})</span>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-3 active:scale-95 transition-transform"
              aria-label="Toggle filters"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setMapType(mapType === "roadmap" ? "satellite" : mapType === "satellite" ? "terrain" : "roadmap")
              }
              className="h-10 px-3 active:scale-95 transition-transform"
              aria-label={`Switch to ${mapType === "roadmap" ? "satellite" : mapType === "satellite" ? "terrain" : "roadmap"} view`}
            >
              {mapType === "roadmap" ? (
                <MapIcon className="h-4 w-4" />
              ) : mapType === "satellite" ? (
                <Satellite className="h-4 w-4" />
              ) : (
                <Layers className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={recenterMap}
              className="h-10 px-3 active:scale-95 transition-transform bg-transparent"
              aria-label="Recenter map to Himachal Pradesh"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <label htmlFor="mobile-location-search" className="sr-only">
              Search eco-locations in Himachal Pradesh
            </label>
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              id="mobile-location-search"
              placeholder="Search eco-locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 h-11 text-base"
            />
          </div>

          {(showFilters || isSearchFocused) && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-200">
              <Button
                size="sm"
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => handleCategorySelect(null)}
                className="text-xs h-8 px-3 active:scale-95 transition-transform"
              >
                All ({allLocations.length})
              </Button>
              {Object.entries(categories).map(([key, category]) => {
                const count = allLocations.filter((loc) => loc.type === key).length
                return (
                  <Button
                    key={key}
                    size="sm"
                    variant={selectedCategory === key ? "default" : "outline"}
                    onClick={() => handleCategorySelect(key)}
                    className={`text-xs h-8 px-3 active:scale-95 transition-transform flex items-center gap-1 ${
                      selectedCategory === key ? category.color : ""
                    }`}
                  >
                    {category.icon}
                    <span>{count}</span>
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div
        ref={sidebarRef}
        className={`
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0 sm:relative
        fixed inset-y-0 left-0 z-[1002]
        w-full sm:w-96 
        bg-white border-r border-gray-200 
        flex flex-col
        transition-transform duration-300 ease-out
        ${isSidebarOpen ? "sm:static" : ""}
        safe-area-inset
      `}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sm:hidden flex items-center justify-between p-4 border-b border-gray-200 safe-area-pt">
          <h2 className="text-lg font-semibold">Eco-Locations</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 h-10 w-10 active:scale-95 transition-transform"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden sm:block p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <label htmlFor="location-search" className="sr-only">
              Search eco-locations in Himachal Pradesh by name, address, or type
            </label>
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              id="location-search"
              ref={searchRef}
              placeholder="Search eco-locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-describedby="search-help"
            />
            <div id="search-help" className="sr-only">
              Search by location name, address, or type. Click on locations to view on map.
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => handleCategorySelect(null)}
              className="text-xs h-8 px-2"
            >
              All ({allLocations.length})
            </Button>
            {Object.entries(categories).map(([key, category]) => {
              const count = allLocations.filter((loc) => loc.type === key).length
              return (
                <Button
                  key={key}
                  size="sm"
                  variant={selectedCategory === key ? "default" : "outline"}
                  onClick={() => handleCategorySelect(key)}
                  className={`text-xs h-8 px-2 ${selectedCategory === key ? category.color : ""}`}
                >
                  <span className="sm:hidden">{category.icon}</span>
                  <span className="hidden sm:flex items-center gap-1">
                    {category.icon}
                    <span>{count}</span>
                  </span>
                  <span className="sm:hidden ml-1">{count}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-3 sm:p-4">
            {Object.entries(groupedLocations).map(([categoryKey, locations]) => {
              const category = categories[categoryKey as keyof typeof categories]
              if (!category || locations.length === 0) return null

              return (
                <div key={categoryKey} className="mb-6">
                  <div
                    className={`flex items-center gap-2 mb-3 p-2 rounded-lg ${category.bgColor} ${category.borderColor} border`}
                  >
                    {category.icon}
                    <h3 className={`font-semibold text-sm sm:text-base ${category.color}`}>
                      {category.name} ({locations.length})
                    </h3>
                  </div>

                  <div className="space-y-3 ml-2">
                    {locations.map((location) => (
                      <Card
                        key={location.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
                          selectedLocation?.id === location.id
                            ? "ring-2 ring-green-500 bg-green-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleLocationClick(location)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            handleLocationClick(location)
                          }
                        }}
                        aria-label={`${location.name} - ${getLocationTypeDescription(location.type)} with ${location.ecoRating} star rating`}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">{getLocationIcon(location.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                    {location.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div
                                      className="flex items-center"
                                      role="img"
                                      aria-label={`${location.ecoRating} out of 5 star eco-rating`}
                                    >
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-3 w-3 ${
                                            i < location.ecoRating ? "text-yellow-400 fill-current" : "text-gray-300"
                                          }`}
                                          aria-hidden="true"
                                        />
                                      ))}
                                    </div>
                                    {location.story && !location.story.isUnlocked && (
                                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                                        <BookOpen className="h-2 w-2 mr-1" aria-hidden="true" />
                                        Story
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                    {location.description}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" aria-hidden="true" />
                                    {location.address}
                                  </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}

            {filteredLocations.length === 0 && (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
                <p className="text-gray-600 text-sm">
                  {searchQuery ? `No eco-locations match "${searchQuery}"` : "No locations in this category"}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory(null)
                  }}
                  className="mt-4 active:scale-95 transition-transform"
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-[1001] backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          onTouchStart={(e) => e.preventDefault()}
        />
      )}

      {/* Map container remains mostly unchanged */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="absolute inset-0 h-full w-full">
          <iframe
            src={getGoogleMapsEmbedUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Himachal Pradesh Eco-Locations Map"
            className="absolute inset-0"
          />
        </div>

        <a
          href="#map-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
        >
          Skip to map content
        </a>

        <div ref={liveRegionRef} aria-live="polite" aria-atomic="true" className="sr-only" />

        <div className="hidden sm:flex absolute top-4 right-4 z-[1000] flex-col gap-2">
          <Button
            onClick={() =>
              setMapType(mapType === "roadmap" ? "satellite" : mapType === "satellite" ? "terrain" : "roadmap")
            }
            size="sm"
            className="bg-white/95 text-gray-700 hover:bg-white shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-10 h-10 p-0"
            variant="outline"
            aria-label={`Switch to ${mapType === "roadmap" ? "satellite" : mapType === "satellite" ? "terrain" : "roadmap"} view`}
            title={`Current: ${mapType} view`}
          >
            {mapType === "roadmap" ? (
              <MapIcon className="h-4 w-4" />
            ) : mapType === "satellite" ? (
              <Satellite className="h-4 w-4" />
            ) : (
              <Layers className="h-4 w-4" />
            )}
          </Button>
          {userLocation && (
            <Button
              onClick={() => {
                setMapCenter(userLocation)
                setZoom(15)
                setSelectedLocation(null)
                setShowLocationDetails(false)
                if (liveRegionRef.current) {
                  liveRegionRef.current.textContent = "Map centered on your location"
                }
              }}
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-10 h-10 p-0"
              variant="outline"
              aria-label="Center map on your location"
              title="Go to my location"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={recenterMap}
            size="sm"
            className="bg-white/95 text-gray-700 hover:bg-white shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-10 h-10 p-0"
            variant="outline"
            aria-label="Recenter map to Himachal Pradesh"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
          </Button>
          {locationPermission === "denied" && (
            <Button
              onClick={requestLocationPermission}
              size="sm"
              className="bg-orange-600 text-white hover:bg-orange-700 shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-10 h-10 p-0"
              variant="outline"
              aria-label="Request location access"
              title="Enable location"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          )}
        </div>

        {selectedLocation && (
          <div
            ref={locationDetailsRef}
            className={`
              ${showLocationDetails ? "translate-y-0" : "translate-y-full"}
              sm:translate-y-0 sm:relative
              fixed bottom-0 left-0 right-0 sm:absolute sm:bottom-4 sm:right-4 sm:left-auto
              z-[1000] w-full sm:w-80
              transition-transform duration-300 ease-out
              safe-area-pb
            `}
            role="dialog"
            aria-labelledby="location-title"
            aria-describedby="location-description"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Card className="shadow-2xl bg-white/95 backdrop-blur-sm rounded-t-xl sm:rounded-xl">
              <div className="sm:hidden w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2 mb-1"></div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle id="location-title" className="text-lg font-semibold">
                      {selectedLocation.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="flex items-center"
                        role="img"
                        aria-label={`${selectedLocation.ecoRating} out of 5 star eco-rating`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedLocation.ecoRating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getLocationTypeDescription(selectedLocation.type)}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedLocation(null)
                      setShowLocationDetails(false)
                    }}
                    className="text-gray-500 hover:text-gray-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 p-2 h-10 w-10 active:scale-95 transition-transform"
                    aria-label="Close location details"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <img
                    src={selectedLocation.image || "/placeholder.svg"}
                    alt={`Photo of ${selectedLocation.name}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <p id="location-description" className="text-sm text-gray-600">
                    {selectedLocation.description}
                  </p>

                  <div className="flex items-center gap-4 py-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{selectedLocation.averageRating?.toFixed(1) || "0.0"}</span>
                    </div>
                    <span className="text-sm text-gray-600">{selectedLocation.totalReviews || 0} reviews</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/location/${selectedLocation.id}/reviews`)}
                      className="text-green-600 hover:text-green-700 p-0 h-auto"
                    >
                      View all reviews
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 h-12 active:scale-95 transition-transform"
                      onClick={handleCheckIn}
                    >
                      <QrCode className="h-4 w-4 mr-2" aria-hidden="true" />
                      Check In
                    </Button>

                    {selectedLocation.story && !selectedLocation.story.isUnlocked && (
                      <Button
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 h-12 active:scale-95 transition-transform"
                        onClick={handleUnlockStory}
                      >
                        <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                        Unlock Story
                      </Button>
                    )}

                    {selectedLocation.story && selectedLocation.story.isUnlocked && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent h-12 active:scale-95 transition-transform"
                        onClick={() => router.push("/stories")}
                      >
                        <BookOpen className="h-4 w-4 mr-2" aria-hidden="true" />
                        View Stories
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
