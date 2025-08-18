import { prisma } from "@/lib/db"
import { mockEcoLocations } from "@/data/mock-data"
import type { EcoLocation } from "@/types"

export interface LocationQueryFilters {
  type?: string | null
  search?: string | null
  lat?: number | null
  lng?: number | null
  radius?: number | null
}

export async function useDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export async function getLocations(filters: LocationQueryFilters = {}): Promise<EcoLocation[]> {
  try {
    const isDb = await useDatabase()
    if (!isDb) throw new Error("db disabled")
    await ensureSeeded()
    const dbLocations = await prisma.ecoLocation.findMany({ include: { story: true } })
    const mapped: EcoLocation[] = dbLocations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      type: loc.type as EcoLocation["type"],
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address,
      description: loc.description,
      ecoRating: loc.ecoRating,
      image: loc.image,
      qrCode: loc.qrCode,
      availableActions: (loc.actionsJson as any) ?? [],
      reviews: [],
      averageRating: loc.averageRating,
      totalReviews: loc.totalReviews,
      story: loc.story
        ? {
            id: loc.story.id,
            title: loc.story.title,
            content: loc.story.content,
            images: (loc.story.images as any) ?? [],
            locationId: loc.story.locationId,
            isUnlocked: false,
          }
        : undefined,
    }))
    return filterLocations(mapped, filters)
  } catch {
    return filterLocations([...mockEcoLocations], filters)
  }
}

export async function getLocationById(id: string): Promise<EcoLocation | undefined> {
  try {
    const isDb = await useDatabase()
    if (!isDb) throw new Error("db disabled")
    await ensureSeeded()
    const loc = await prisma.ecoLocation.findUnique({ where: { id }, include: { story: true } })
    if (!loc) return undefined
    const mapped: EcoLocation = {
      id: loc.id,
      name: loc.name,
      type: loc.type as EcoLocation["type"],
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address,
      description: loc.description,
      ecoRating: loc.ecoRating,
      image: loc.image,
      qrCode: loc.qrCode,
      availableActions: (loc.actionsJson as any) ?? [],
      reviews: [],
      averageRating: loc.averageRating,
      totalReviews: loc.totalReviews,
      story: loc.story
        ? {
            id: loc.story.id,
            title: loc.story.title,
            content: loc.story.content,
            images: (loc.story.images as any) ?? [],
            locationId: loc.story.locationId,
            isUnlocked: false,
          }
        : undefined,
    }
    return mapped
  } catch {
    return mockEcoLocations.find((l) => l.id === id)
  }
}

export interface RecordCheckinInput {
  userId: string
  locationId: string
  locationName: string
  action: string
  actionDescription: string
  basePoints: number
  bonusPoints: number
  totalPoints: number
  bonusReasons: string[]
  coordinates: { latitude: number; longitude: number }
  address: string
  timestamp: string
  region: string
  checkinType: string
}

export async function recordCheckin(checkin: RecordCheckinInput): Promise<void> {
  try {
    const isDb = await useDatabase()
    if (!isDb) return
    await prisma.checkin.create({
      data: {
        id: `${checkin.userId}:${checkin.timestamp}`,
        userId: checkin.userId,
        locationId: checkin.locationId,
        locationName: checkin.locationName,
        action: checkin.action,
        actionDescription: checkin.actionDescription,
        basePoints: checkin.basePoints,
        bonusPoints: checkin.bonusPoints,
        totalPoints: checkin.totalPoints,
        bonusReasons: (checkin.bonusReasons as unknown) as any,
        latitude: checkin.coordinates.latitude,
        longitude: checkin.coordinates.longitude,
        address: checkin.address,
        timestamp: new Date(checkin.timestamp),
        region: checkin.region,
        checkinType: checkin.checkinType,
      },
    })
  } catch {
    // ignore and continue falling back to stateless mock behavior
  }
}

function filterLocations(locations: EcoLocation[], filters: LocationQueryFilters): EcoLocation[] {
  let filtered = [...locations]

  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((l) => l.type === filters.type)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (l) => l.name.toLowerCase().includes(searchLower) || l.address.toLowerCase().includes(searchLower),
    )
  }

  if (filters.lat != null && filters.lng != null && filters.radius != null) {
    const userLat = Number(filters.lat)
    const userLng = Number(filters.lng)
    const searchRadius = Number(filters.radius)
    filtered = filtered.filter((l) => calculateDistance(userLat, userLng, l.latitude, l.longitude) <= searchRadius)
  }

  return filtered
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

async function ensureSeeded(): Promise<void> {
  const count = await prisma.ecoLocation.count()
  if (count > 0) return

  // Seed EcoLocations first
  for (const loc of mockEcoLocations) {
    await prisma.ecoLocation.upsert({
      where: { id: loc.id },
      update: {},
      create: {
        id: loc.id,
        name: loc.name,
        type: loc.type,
        latitude: loc.latitude,
        longitude: loc.longitude,
        address: loc.address,
        description: loc.description,
        ecoRating: loc.ecoRating,
        image: loc.image,
        qrCode: loc.qrCode,
        averageRating: loc.averageRating,
        totalReviews: loc.totalReviews,
        actionsJson: (loc.availableActions as unknown) as any,
      },
    })

    if (loc.story) {
      await prisma.culturalStory.upsert({
        where: { id: loc.story.id },
        update: {},
        create: {
          id: loc.story.id,
          title: loc.story.title,
          content: loc.story.content,
          images: (loc.story.images as unknown) as any,
          locationId: loc.id,
        },
      })
    }
  }
}

import { prisma } from "@/lib/db"
import { mockEcoLocations } from "@/data/mock-data"
import type { EcoLocation } from "@/types"

export interface LocationQueryFilters {
  type?: string | null
  search?: string | null
  lat?: number | null
  lng?: number | null
  radius?: number | null
}

export async function useDatabase(): Promise<boolean> {
  try {
    // Quick probe to determine if DB is set up and reachable
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export async function getLocations(filters: LocationQueryFilters = {}): Promise<EcoLocation[]> {
  const isDb = await useDatabase()
  if (!isDb) {
    return filterLocations([...mockEcoLocations], filters)
  }

  const dbLocations = await prisma.ecoLocation.findMany({
    include: { story: true },
  })

  const mapped: EcoLocation[] = dbLocations.map((loc) => ({
    id: loc.id,
    name: loc.name,
    type: loc.type as EcoLocation["type"],
    latitude: loc.latitude,
    longitude: loc.longitude,
    address: loc.address,
    description: loc.description,
    ecoRating: loc.ecoRating,
    image: loc.image,
    qrCode: loc.qrCode,
    availableActions: (loc.actionsJson as any) ?? [],
    reviews: [],
    averageRating: loc.averageRating,
    totalReviews: loc.totalReviews,
    story: loc.story
      ? {
          id: loc.story.id,
          title: loc.story.title,
          content: loc.story.content,
          images: (loc.story.images as any) ?? [],
          locationId: loc.story.locationId,
          isUnlocked: false,
        }
      : undefined,
  }))

  return filterLocations(mapped, filters)
}

export async function getLocationById(id: string): Promise<EcoLocation | undefined> {
  const isDb = await useDatabase()
  if (!isDb) {
    return mockEcoLocations.find((l) => l.id === id)
  }

  const loc = await prisma.ecoLocation.findUnique({ where: { id }, include: { story: true } })
  if (!loc) return undefined

  const mapped: EcoLocation = {
    id: loc.id,
    name: loc.name,
    type: loc.type as EcoLocation["type"],
    latitude: loc.latitude,
    longitude: loc.longitude,
    address: loc.address,
    description: loc.description,
    ecoRating: loc.ecoRating,
    image: loc.image,
    qrCode: loc.qrCode,
    availableActions: (loc.actionsJson as any) ?? [],
    reviews: [],
    averageRating: loc.averageRating,
    totalReviews: loc.totalReviews,
    story: loc.story
      ? {
          id: loc.story.id,
          title: loc.story.title,
          content: loc.story.content,
          images: (loc.story.images as any) ?? [],
          locationId: loc.story.locationId,
          isUnlocked: false,
        }
      : undefined,
  }

  return mapped
}

export interface RecordCheckinInput {
  userId: string
  locationId: string
  locationName: string
  action: string
  actionDescription: string
  basePoints: number
  bonusPoints: number
  totalPoints: number
  bonusReasons: string[]
  coordinates: { latitude: number; longitude: number }
  address: string
  timestamp: string
  region: string
  checkinType: string
}

export async function recordCheckin(checkin: RecordCheckinInput): Promise<void> {
  const isDb = await useDatabase()
  if (!isDb) return

  await prisma.checkin.create({
    data: {
      id: checkin.userId + ":" + checkin.timestamp,
      userId: checkin.userId,
      locationId: checkin.locationId,
      locationName: checkin.locationName,
      action: checkin.action,
      actionDescription: checkin.actionDescription,
      basePoints: checkin.basePoints,
      bonusPoints: checkin.bonusPoints,
      totalPoints: checkin.totalPoints,
      bonusReasons: checkin.bonusReasons as unknown as any,
      latitude: checkin.coordinates.latitude,
      longitude: checkin.coordinates.longitude,
      address: checkin.address,
      timestamp: new Date(checkin.timestamp),
      region: checkin.region,
      checkinType: checkin.checkinType,
    },
  })
}

function filterLocations(locations: EcoLocation[], filters: LocationQueryFilters): EcoLocation[] {
  let filtered = [...locations]

  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((l) => l.type === filters.type)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (l) => l.name.toLowerCase().includes(searchLower) || l.address.toLowerCase().includes(searchLower),
    )
  }

  if (filters.lat != null && filters.lng != null && filters.radius != null) {
    const userLat = Number(filters.lat)
    const userLng = Number(filters.lng)
    const searchRadius = Number(filters.radius)

    filtered = filtered.filter((l) => calculateDistance(userLat, userLng, l.latitude, l.longitude) <= searchRadius)
  }

  return filtered
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

