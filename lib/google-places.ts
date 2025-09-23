"use client"

export interface GooglePlace {
  place_id: string
  name: string
  vicinity: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  user_ratings_total?: number
  types: string[]
  business_status?: string
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  opening_hours?: {
    open_now: boolean
    weekday_text: string[]
  }
  formatted_address?: string
  formatted_phone_number?: string
  website?: string
}

export interface GooglePlacesResponse {
  results: GooglePlace[]
  status: string
  next_page_token?: string
}

export interface DonationCenterFromPlaces {
  id: string
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
  placeId: string
  businessStatus: string
}

class GooglePlacesService {
  private apiKey: string
  private baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY')
    }
  }

  // Search for donation centers using multiple strategies
  async findDonationCenters(
    latitude: number, 
    longitude: number, 
    radius: number = 25000
  ): Promise<DonationCenterFromPlaces[]> {
    console.log('🔍 Searching for donation centers using Google Places API...')
    
    const searches = [
      // Strategy 1: Hospital + blood donation keyword
      this.nearbySearch(latitude, longitude, radius, 'hospital', 'blood donation'),

      // Strategy 2: Hospital + blood bank keyword
      this.nearbySearch(latitude, longitude, radius, 'hospital', 'blood bank'),

      // Strategy 3: Health + blood donation keyword
      this.nearbySearch(latitude, longitude, radius, 'health', 'blood donation'),

      // Strategy 4: Text search for blood donation
      this.textSearch(`blood donation center near ${latitude},${longitude}`),

      // Strategy 5: Text search for blood bank
      this.textSearch(`blood bank near ${latitude},${longitude}`),

      // Strategy 6: Text search for Red Cross
      this.textSearch(`Red Cross blood donation near ${latitude},${longitude}`),

      // Strategy 7: Text search for American Red Cross
      this.textSearch(`American Red Cross near ${latitude},${longitude}`),

      // Strategy 8: Text search for hospital blood center
      this.textSearch(`hospital blood center near ${latitude},${longitude}`)
    ]

    try {
      const results = await Promise.allSettled(searches)
      let allPlaces: GooglePlace[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.results) {
          console.log(`✅ Strategy ${index + 1} found ${result.value.results.length} places`)
          allPlaces.push(...result.value.results)
        } else if (result.status === 'rejected') {
          console.warn(`❌ Strategy ${index + 1} failed:`, result.reason)
        }
      })

      // Remove duplicates based on place_id
      const uniquePlaces = Array.from(
        new Map(allPlaces.map(place => [place.place_id, place])).values()
      )

      console.log(`🎯 Found ${uniquePlaces.length} unique places after deduplication`)

      // Convert to our format and get detailed information
      const donationCenters = await Promise.all(
        uniquePlaces.map(place => this.convertToDonationCenter(place))
      )

      // Filter out places that are likely not donation centers
      const filteredCenters = donationCenters.filter(center => 
        this.isLikelyDonationCenter(center)
      )

      console.log(`🏥 Filtered to ${filteredCenters.length} likely donation centers`)
      return filteredCenters

    } catch (error) {
      console.error('❌ Error searching for donation centers:', error)
      throw error
    }
  }

  // Nearby search with type and keyword
  private async nearbySearch(
    lat: number, 
    lng: number, 
    radius: number, 
    type: string, 
    keyword: string
  ): Promise<GooglePlacesResponse> {
    const url = `${this.baseUrl}/api/donation-centers/places/search?` + new URLSearchParams({
      location: `${lat},${lng}`,
      radius: radius.toString(),
      type: type,
      keyword: keyword
    })

    console.log(`🔍 Nearby search: ${type} + "${keyword}"`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  // Text search for more flexible queries
  private async textSearch(query: string): Promise<GooglePlacesResponse> {
    const url = `${this.baseUrl}/api/donation-centers/places/search?` + new URLSearchParams({
      query: query
    })

    console.log(`🔍 Text search: "${query}"`)
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  // Get detailed place information
  private async getPlaceDetails(placeId: string): Promise<any> {
    const url = `${this.baseUrl}/api/donation-centers/places/details?` + new URLSearchParams({
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,types,business_status'
    })

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.result
  }

  // Convert Google Place to our DonationCenter format
  private async convertToDonationCenter(place: GooglePlace): Promise<DonationCenterFromPlaces> {
    let details: any = null

    try {
      // Try to get detailed information
      details = await this.getPlaceDetails(place.place_id)
      console.log(`✅ Got details for ${place.name}`)
    } catch (error) {
      console.warn(`⚠️ Failed to get details for ${place.name} (${place.place_id}):`, error.message || error)
      // Continue with basic info if details fail
    }

    // Use details if available, otherwise fall back to basic place info
    const addressSource = details?.formatted_address || place.formatted_address || place.vicinity || ''
    const addressParts = addressSource.split(', ')

    // Parse operating hours
    const operatingHours = details?.opening_hours ?
      this.parseOperatingHours(details.opening_hours) :
      this.getDefaultOperatingHours()

    return {
      id: place.place_id,
      placeId: place.place_id,
      name: place.name,
      address: {
        street: addressParts[0] || '',
        city: addressParts[1] || '',
        state: addressParts[2] || '',
        zipCode: addressParts[3] || '',
        country: addressParts[4] || 'USA',
        fullAddress: addressSource
      },
      location: {
        type: 'Point',
        coordinates: [place.geometry.location.lng, place.geometry.location.lat]
      },
      contact: {
        phone: details?.formatted_phone_number,
        website: details?.website
      },
      operatingHours: operatingHours,
      bloodTypesAccepted: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Default assumption
      bloodInventory: [], // Would need separate API or data source
      services: ['blood_donation'], // Default assumption
      capacity: {
        dailyDonors: 50, // Default assumption
        appointmentSlots: 20 // Default assumption
      },
      status: (details?.business_status === 'OPERATIONAL' || place.business_status === 'OPERATIONAL') ? 'active' : 'inactive',
      rating: {
        average: place.rating || 0,
        count: place.user_ratings_total || 0
      },
      features: this.inferFeatures(place.types),
      businessStatus: details?.business_status || place.business_status || 'OPERATIONAL'
    }
  }

  // Create basic donation center info when details fail
  private createBasicDonationCenter(place: GooglePlace): DonationCenterFromPlaces {
    const addressParts = (place.vicinity || '').split(', ')
    
    return {
      id: place.place_id,
      placeId: place.place_id,
      name: place.name,
      address: {
        street: addressParts[0] || '',
        city: addressParts[1] || '',
        state: addressParts[2] || '',
        zipCode: '',
        country: 'USA',
        fullAddress: place.vicinity || ''
      },
      location: {
        type: 'Point',
        coordinates: [place.geometry.location.lng, place.geometry.location.lat]
      },
      contact: {},
      operatingHours: {},
      bloodTypesAccepted: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      bloodInventory: [],
      services: ['blood_donation'],
      capacity: {
        dailyDonors: 50,
        appointmentSlots: 20
      },
      status: 'active',
      rating: {
        average: place.rating || 0,
        count: place.user_ratings_total || 0
      },
      features: this.inferFeatures(place.types),
      businessStatus: place.business_status || 'UNKNOWN'
    }
  }

  // Get default operating hours when no hours are available
  private getDefaultOperatingHours(): { [key: string]: { open: string; close: string; closed: boolean } } {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const hours: { [key: string]: { open: string; close: string; closed: boolean } } = {}

    days.forEach(day => {
      hours[day] = { open: '', close: '', closed: true }
    })

    return hours
  }

  // Parse Google's opening hours format
  private parseOperatingHours(openingHours?: any): { [key: string]: { open: string; close: string; closed: boolean } } {
    const hours: { [key: string]: { open: string; close: string; closed: boolean } } = {}
    
    if (!openingHours || !openingHours.weekday_text) {
      // Return default hours if no hours available
      return this.getDefaultOperatingHours()
    }

    const dayMap: { [key: string]: string } = {
      'Monday': 'monday',
      'Tuesday': 'tuesday', 
      'Wednesday': 'wednesday',
      'Thursday': 'thursday',
      'Friday': 'friday',
      'Saturday': 'saturday',
      'Sunday': 'sunday'
    }

    openingHours.weekday_text.forEach((dayText: string) => {
      const [dayName, timeText] = dayText.split(': ')
      const day = dayMap[dayName]
      
      if (day) {
        if (timeText === 'Closed') {
          hours[day] = { open: '', close: '', closed: true }
        } else {
          // Parse time like "9:00 AM – 5:00 PM"
          const timeMatch = timeText.match(/(\d{1,2}:\d{2} [AP]M) – (\d{1,2}:\d{2} [AP]M)/)
          if (timeMatch) {
            hours[day] = {
              open: this.convertTo24Hour(timeMatch[1]),
              close: this.convertTo24Hour(timeMatch[2]),
              closed: false
            }
          } else {
            hours[day] = { open: '', close: '', closed: true }
          }
        }
      }
    })

    return hours
  }

  // Convert 12-hour time to 24-hour format
  private convertTo24Hour(time12: string): string {
    const [time, period] = time12.split(' ')
    const [hours, minutes] = time.split(':')
    let hour24 = parseInt(hours)
    
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`
  }

  // Infer features based on place types
  private inferFeatures(types: string[]): string[] {
    const features: string[] = []
    
    if (types.includes('hospital')) features.push('wheelchair_accessible')
    if (types.includes('establishment')) features.push('parking')
    if (types.includes('health')) features.push('wifi')
    
    return features
  }

  // Filter places that are likely donation centers
  private isLikelyDonationCenter(center: DonationCenterFromPlaces): boolean {
    const name = center.name.toLowerCase()
    const address = center.address.fullAddress.toLowerCase()

    // Keywords that suggest it's a donation center
    const donationKeywords = [
      'blood', 'donation', 'donor', 'transfusion', 'hematology',
      'red cross', 'blood bank', 'plasma', 'platelet', 'center',
      'medical center', 'hospital', 'health', 'community'
    ]

    // Check if name or address contains donation-related keywords
    const hasDonationKeyword = donationKeywords.some(keyword =>
      name.includes(keyword) || address.includes(keyword)
    )

    // Exclude places that are clearly not donation centers
    const excludeKeywords = [
      'restaurant', 'hotel', 'gas station', 'pharmacy without blood',
      'dental', 'veterinary', 'animal', 'pet', 'store', 'shop',
      'mall', 'parking', 'atm'
    ]

    const hasExcludeKeyword = excludeKeywords.some(keyword =>
      name.includes(keyword) || address.includes(keyword)
    )

    // Be more lenient - if we found it through our searches, it's likely relevant
    // Only exclude if it clearly has exclude keywords, and require some relevance
    return !hasExcludeKeyword && hasDonationKeyword
  }
}

// Export singleton instance
export const googlePlacesService = new GooglePlacesService()

// Export the service class for testing
export { GooglePlacesService }
