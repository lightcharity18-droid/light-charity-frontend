"use client"

import { googlePlacesService, DonationCenterFromPlaces } from './google-places'

export interface DonationCenter {
  _id: string
  name: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    fullAddress: string
  }
  location: {
    type: string
    coordinates: [number, number] // [longitude, latitude]
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  operatingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  bloodTypesAccepted: string[]
  bloodInventory: Array<{
    bloodType: string
    unitsAvailable: number
    lastUpdated: string
  }>
  services: string[]
  capacity: {
    dailyDonors: number
    appointmentSlots: number
  }
  status: string
  rating: {
    average: number
    count: number
  }
  features: string[]
}

export interface RouteInfo {
  duration: string
  distance: number
  polyline?: string
  steps?: any[]
}

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export const donationCentersAPI = {
  // Get all donation centers (from database)
  getAllCenters: async (params?: {
    bloodType?: string
    city?: string
    state?: string
    latitude?: number
    longitude?: number
    radius?: number
    limit?: number
    page?: number
  }): Promise<{ success: boolean; data: DonationCenter[]; count: number }> => {
    try {
      const queryParams = new URLSearchParams()
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString())
          }
        })
      }

      const response = await fetch(`${API_BASE_URL}/api/donation-centers?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching donation centers:', error)
      throw error
    }
  },

  // Get centers from Google Places API
  getCentersFromGooglePlaces: async (params: {
    latitude: number
    longitude: number
    radius?: number
  }): Promise<{ success: boolean; data: DonationCenterFromPlaces[]; count: number }> => {
    try {
      console.log('🔍 Fetching centers from Google Places API...')
      const centers = await googlePlacesService.findDonationCenters(
        params.latitude,
        params.longitude,
        params.radius || 25000
      )
      
      return {
        success: true,
        data: centers,
        count: centers.length
      }
    } catch (error) {
      console.error('Error fetching centers from Google Places:', error)
      return {
        success: false,
        data: [],
        count: 0
      }
    }
  },

  // Get centers from both sources (database + Google Places)
  getAllCentersCombined: async (params?: {
    bloodType?: string
    city?: string
    state?: string
    latitude?: number
    longitude?: number
    radius?: number
    limit?: number
    page?: number
    useGooglePlaces?: boolean
  }): Promise<{ success: boolean; data: (DonationCenter | DonationCenterFromPlaces)[]; count: number }> => {
    try {
      const results: (DonationCenter | DonationCenterFromPlaces)[] = []
      
      // Get from database first
      try {
        const dbResponse = await donationCentersAPI.getAllCenters(params)
        if (dbResponse.success) {
          results.push(...dbResponse.data)
          console.log(`📊 Found ${dbResponse.data.length} centers from database`)
        }
      } catch (error) {
        console.warn('Database query failed, continuing with Google Places only:', error)
      }
      
      // Get from Google Places if requested and we have coordinates
      if (params?.useGooglePlaces && params.latitude && params.longitude) {
        try {
          const placesResponse = await donationCentersAPI.getCentersFromGooglePlaces({
            latitude: params.latitude,
            longitude: params.longitude,
            radius: params.radius
          })
          
          if (placesResponse.success) {
            results.push(...placesResponse.data)
            console.log(`🗺️ Found ${placesResponse.data.length} centers from Google Places`)
          }
        } catch (error) {
          console.warn('Google Places query failed:', error)
        }
      }
      
      // Remove duplicates based on name and location
      const uniqueResults = Array.from(
        new Map(
          results.map(center => [
            `${center.name}-${center.location.coordinates[0]}-${center.location.coordinates[1]}`,
            center
          ])
        ).values()
      )
      
      console.log(`🎯 Total unique centers found: ${uniqueResults.length}`)
      
      return {
        success: true,
        data: uniqueResults,
        count: uniqueResults.length
      }
    } catch (error) {
      console.error('Error fetching combined centers:', error)
      throw error
    }
  },

  // Get center by ID
  getCenterById: async (id: string): Promise<{ success: boolean; data: DonationCenter }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donation-centers/${id}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching donation center:', error)
      throw error
    }
  },

  // Calculate route to a center
  calculateRoute: async (params: {
    originLat: number
    originLng: number
    destinationLat: number
    destinationLng: number
    travelMode?: string
  }): Promise<{ success: boolean; data: RouteInfo }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donation-centers/routes/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error calculating route:', error)
      throw error
    }
  },

  // Calculate multiple routes
  calculateMultipleRoutes: async (params: {
    originLat: number
    originLng: number
    destinations: Array<{ id: string; lat: number; lng: number }>
    travelMode?: string
  }): Promise<{ success: boolean; data: Array<{ destinationId: string; success: boolean; duration?: string; distance?: number; error?: string }> }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/donation-centers/routes/multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error calculating multiple routes:', error)
      throw error
    }
  }
}

// Helper functions
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export const formatDuration = (duration: string): string => {
  // Duration comes in format like "1234s"
  const seconds = parseInt(duration.replace('s', ''))
  const minutes = Math.round(seconds / 60)
  
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} hr`
  }
  
  return `${hours} hr ${remainingMinutes} min`
}

export const getCurrentDayHours = (center: DonationCenter | DonationCenterFromPlaces): { open: string; close: string; closed: boolean } => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[new Date().getDay()]
  return center.operatingHours[today] || { open: '', close: '', closed: true }
}

export const isOpenNow = (center: DonationCenter | DonationCenterFromPlaces): boolean => {
  const todayHours = getCurrentDayHours(center)
  
  if (todayHours.closed || !todayHours.open || !todayHours.close) {
    return false
  }
  
  const now = new Date()
  const currentTime = now.getHours() * 100 + now.getMinutes()
  
  const openTime = parseInt(todayHours.open.replace(':', ''))
  const closeTime = parseInt(todayHours.close.replace(':', ''))
  
  return currentTime >= openTime && currentTime <= closeTime
}

export const getBloodTypeColor = (bloodType: string): string => {
  const colors: { [key: string]: string } = {
    'A+': 'bg-red-100 text-red-800',
    'A-': 'bg-red-200 text-red-900',
    'B+': 'bg-blue-100 text-blue-800',
    'B-': 'bg-blue-200 text-blue-900',
    'AB+': 'bg-purple-100 text-purple-800',
    'AB-': 'bg-purple-200 text-purple-900',
    'O+': 'bg-green-100 text-green-800',
    'O-': 'bg-green-200 text-green-900'
  }
  
  return colors[bloodType] || 'bg-gray-100 text-gray-800'
}