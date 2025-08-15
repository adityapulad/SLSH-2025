const API_BASE_URL = "/api"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  total?: number
}

export interface LocationFilters {
  type?: string
  search?: string
  lat?: number
  lng?: number
  radius?: number
}

export interface CheckinRequest {
  userId: string
  qrCode: string
  action: string
}

// Fetch eco-locations with optional filters
export async function fetchLocations(filters: LocationFilters = {}): Promise<ApiResponse<any[]>> {
  const params = new URLSearchParams()

  if (filters.type) params.append("type", filters.type)
  if (filters.search) params.append("search", filters.search)
  if (filters.lat) params.append("lat", filters.lat.toString())
  if (filters.lng) params.append("lng", filters.lng.toString())
  if (filters.radius) params.append("radius", filters.radius.toString())

  const response = await fetch(`${API_BASE_URL}/locations?${params}`)
  return response.json()
}

// Fetch specific location details
export async function fetchLocationDetails(locationId: string): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}/locations/${locationId}`)
  return response.json()
}

// Submit check-in for a location
export async function submitCheckin(locationId: string, checkinData: CheckinRequest): Promise<ApiResponse<any>> {
  const response = await fetch(`${API_BASE_URL}/locations/${locationId}/checkin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkinData),
  })
  return response.json()
}

// Fetch user's location history
export async function fetchUserLocations(userId: string): Promise<ApiResponse<any[]>> {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/locations`)
  return response.json()
}
