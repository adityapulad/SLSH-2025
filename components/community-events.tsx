"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, CheckCircle } from "lucide-react"
import { mockCommunityEvents } from "@/data/mock-data"

export function CommunityEvents() {
  const [rsvpedEvents, setRsvpedEvents] = useState<Set<string>>(new Set())

  const handleRSVP = (eventId: string) => {
    setRsvpedEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEventTypeColor = (title: string) => {
    if (title.toLowerCase().includes("cleanup")) return "bg-green-100 text-green-800"
    if (title.toLowerCase().includes("workshop")) return "bg-blue-100 text-blue-800"
    if (title.toLowerCase().includes("market")) return "bg-orange-100 text-orange-800"
    if (title.toLowerCase().includes("trek")) return "bg-purple-100 text-purple-800"
    return "bg-indigo-100 text-indigo-800"
  }

  const getLocationEmoji = (location: string) => {
    if (location.includes("Shimla")) return "🏔️"
    if (location.includes("Manali")) return "🏂"
    if (location.includes("Kullu")) return "🍎"
    if (location.includes("Parvati")) return "🌿"
    if (location.includes("Dharamshala")) return "🕉️"
    return "🏞️"
  }

  const isEventSoon = (date: Date) => {
    const now = new Date()
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffInHours <= 24 && diffInHours > 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Himachal Pradesh Community Events</h1>
          <p className="text-gray-600">Join local eco-warriors across the hills and valleys of DevBhoomi</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-800">🏔️ Mountain Cleanups</div>
              <div className="text-sm text-green-600">Keep our hills pristine</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-800">🌱 Sustainable Living</div>
              <div className="text-sm text-blue-600">Learn eco-friendly practices</div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {mockCommunityEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
                      {isEventSoon(event.date) && (
                        <Badge className="bg-red-100 text-red-800 text-xs">Starting Soon</Badge>
                      )}
                    </div>
                    <Badge className={`text-xs ${getEventTypeColor(event.title)}`}>
                      {event.title.toLowerCase().includes("cleanup")
                        ? "Environmental"
                        : event.title.toLowerCase().includes("workshop")
                          ? "Educational"
                          : event.title.toLowerCase().includes("market")
                            ? "Community"
                            : "Cultural"}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(event.date)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{event.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{getLocationEmoji(event.location)}</span>
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.attendees} attending
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </span>
                    </div>
                  </div>

                  {/* Attendee Progress Bar */}
                  {event.maxAttendees && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((event.attendees / event.maxAttendees) * 100, 100)}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      {rsvpedEvents.has(event.id) && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>You're attending</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleRSVP(event.id)}
                      variant={rsvpedEvents.has(event.id) ? "outline" : "default"}
                      className={
                        rsvpedEvents.has(event.id)
                          ? "border-green-600 text-green-600 hover:bg-green-50"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    >
                      {rsvpedEvents.has(event.id) ? "Cancel RSVP" : "RSVP"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Want to organize an event?</h3>
            <p className="text-green-700 mb-4">
              Help build the community by organizing cleanup drives, workshops, or cultural events in your area.
            </p>
            <Button className="bg-green-600 hover:bg-green-700">Suggest an Event</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
