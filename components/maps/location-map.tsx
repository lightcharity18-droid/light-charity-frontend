"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Loader2, MapPin, Navigation, Clock, Phone, Globe, Star, Database, Map } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useGoogleMaps } from "@/hooks/use-google-maps"
import { 
  donationCentersAPI, 
  DonationCenter, 
  DonationCenterFromPlaces,
  formatDistance, 
  formatDuration, 
  getCurrentDayHours, 
  isOpenNow, 
  getBloodTypeColor 
} from "@/lib/donation-centers"

type CombinedCenter = DonationCenter | DonationCenterFromPlaces

export function LocationMap() {
  const { maps, isLoaded: mapsLoaded, loadError } = useGoogleMaps()
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [bloodFilter, setBloodFilter] = useState<string>("")
  const [radiusFilter, setRadiusFilter] = useState<string>("25")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [useGooglePlaces, setUseGooglePlaces] = useState<boolean>(true)
  const [centers, setCenters] = useState<CombinedCenter[]>([])
  const [filteredCenters, setFilteredCenters] = useState<CombinedCenter[]>([])
  const [selectedCenter, setSelectedCenter] = useState<CombinedCenter | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ [centerId: string]: { duration: string; distance: number } }>({})

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapsLoaded || !maps || !mapRef.current || mapInstanceRef.current) return

    const defaultCenter = userLocation || { lat: 40.7128, lng: -74.0060 } // Default to NYC
    
    mapInstanceRef.current = new maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: userLocation ? 12 : 10,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }]
        }
      ]
    })

    // Initialize directions renderer
    directionsRendererRef.current = new maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: "#3B82F6",
        strokeWeight: 4
      }
    })
    directionsRendererRef.current.setMap(mapInstanceRef.current)
  }, [mapsLoaded, maps, userLocation])

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        console.log('📍 User location obtained:', location)
        setUserLocation(location)
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(location)
          mapInstanceRef.current.setZoom(12)
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        toast({
          title: "Location access denied",
          description: "Unable to get your location. Using default location.",
          variant: "destructive",
        })
        // Set default location (NYC)
        const defaultLocation = { lat: 40.7128, lng: -74.0060 }
        console.log('📍 Using default location (NYC):', defaultLocation)
        setUserLocation(defaultLocation)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [toast])

  // Fetch donation centers
  const fetchCenters = useCallback(async () => {
    try {
      console.log('🔄 Fetching donation centers...')
      setIsLoading(true)
      const params: any = {
        limit: 50
      }
      
      if (userLocation) {
        params.latitude = userLocation.lat
        params.longitude = userLocation.lng
        params.radius = parseInt(radiusFilter)
        console.log('📍 Searching near user location:', userLocation, 'radius:', radiusFilter + 'km')
      } else {
        console.log('📍 No user location, getting all centers')
      }
      
      if (bloodFilter && bloodFilter !== "any") {
        params.bloodType = bloodFilter
        console.log('🩸 Filtering by blood type:', bloodFilter)
      }

      // Use Google Places if enabled and we have coordinates
      if (useGooglePlaces && userLocation) {
        params.useGooglePlaces = true
        console.log('🗺️ Using Google Places API for enhanced search')
      }

      console.log('📡 API request params:', params)
      
      let response
      if (useGooglePlaces && userLocation) {
        response = await donationCentersAPI.getAllCentersCombined(params)
      } else {
        response = await donationCentersAPI.getAllCenters(params)
      }
      
      console.log('📡 API response:', response)
      
      if (response.success) {
        console.log(`✅ Found ${response.count} donation centers:`)
        response.data.forEach((center, index) => {
          const source = 'placeId' in center ? 'Google Places' : 'Database'
          console.log(`${index + 1}. ${center.name} - ${center.address.city}, ${center.address.state} (${source})`)
        })
        setCenters(response.data)
      } else {
        console.error('❌ Failed to fetch centers:', response.message)
        throw new Error("Failed to fetch centers")
      }
    } catch (error) {
      console.error("❌ Error fetching centers:", error)
      toast({
        title: "Error loading centers",
        description: "Failed to load donation centers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [userLocation, radiusFilter, bloodFilter, useGooglePlaces, toast])

  // Filter centers based on search query
  useEffect(() => {
    let filtered = centers
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = centers.filter(center => 
        center.name.toLowerCase().includes(query) ||
        center.address.fullAddress.toLowerCase().includes(query) ||
        center.address.city.toLowerCase().includes(query)
      )
      console.log(`🔍 Filtered ${centers.length} centers to ${filtered.length} by search: "${searchQuery}"`)
    }
    
    setFilteredCenters(filtered)
  }, [centers, searchQuery])

  // Update map markers
  const updateMapMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !maps) return

    console.log(`🗺️ Updating map markers for ${filteredCenters.length} centers`)

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add user location marker
    if (userLocation) {
      const userMarker = new maps.Marker({
        position: userLocation,
        map: mapInstanceRef.current,
        title: "Your Location",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#3B82F6"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new maps.Size(24, 24),
          anchor: new maps.Point(12, 12)
        }
      })
      markersRef.current.push(userMarker)
      console.log('📍 Added user location marker')
    }

    // Add center markers
    filteredCenters.forEach((center, index) => {
      const isGooglePlaces = 'placeId' in center
      const markerColor = isGooglePlaces ? '#10B981' : '#DC2626' // Green for Google Places, Red for Database
      
      const marker = new maps.Marker({
        position: { lat: center.location.coordinates[1], lng: center.location.coordinates[0] },
        map: mapInstanceRef.current!,
        title: `${center.name} (${isGooglePlaces ? 'Google Places' : 'Database'})`,
        label: {
          text: (index + 1).toString(),
          color: "white",
          fontWeight: "bold"
        },
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.2 0 0 7.2 0 16C0 24.8 7.2 32 16 32C24.8 32 32 24.8 32 16C32 7.2 24.8 0 16 0Z" fill="${markerColor}"/>
              <circle cx="16" cy="16" r="12" fill="${markerColor}"/>
            </svg>
          `),
          scaledSize: new maps.Size(32, 32),
          anchor: new maps.Point(16, 32)
        }
      })

      // Add click listener to marker
      marker.addListener('click', () => {
        console.log('🎯 Clicked marker for:', center.name)
        setSelectedCenter(center)
        if (userLocation) {
          calculateRoute(center)
        }
      })

      markersRef.current.push(marker)
    })

    console.log(`🎯 Added ${filteredCenters.length} center markers`)

    // Fit map to show all markers
    if (filteredCenters.length > 0) {
      const bounds = new maps.LatLngBounds()
      
      if (userLocation) {
        bounds.extend(userLocation)
      }
      
      filteredCenters.forEach(center => {
        bounds.extend({ lat: center.location.coordinates[1], lng: center.location.coordinates[0] })
      })
      
      mapInstanceRef.current.fitBounds(bounds)
      console.log('🗺️ Map bounds adjusted to show all markers')
    }
  }, [maps, userLocation, filteredCenters])

  // Calculate route to center
  const calculateRoute = useCallback(async (center: CombinedCenter) => {
    if (!userLocation) return

    try {
      console.log('🗺️ Calculating route to:', center.name)
      const response = await donationCentersAPI.calculateRoute({
        originLat: userLocation.lat,
        originLng: userLocation.lng,
        destinationLat: center.location.coordinates[1],
        destinationLng: center.location.coordinates[0],
        travelMode: 'DRIVE'
      })

      if (response.success && maps && directionsRendererRef.current) {
        console.log('✅ Route calculated:', response.data)
        setRouteInfo(prev => ({
          ...prev,
          [center.id || center._id]: {
            duration: response.data.duration,
            distance: response.data.distance
          }
        }))

        // Display route on map
        const directionsService = new maps.DirectionsService()
        directionsService.route({
          origin: userLocation,
          destination: { lat: center.location.coordinates[1], lng: center.location.coordinates[0] },
          travelMode: maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === 'OK' && directionsRendererRef.current) {
            directionsRendererRef.current.setDirections(result)
            console.log('🗺️ Route displayed on map')
          } else {
            console.error('❌ Failed to display route:', status)
          }
        })
      }
    } catch (error) {
      console.error("❌ Error calculating route:", error)
    }
  }, [userLocation, maps])

  // Get directions (open in Google Maps)
  const getDirections = useCallback((center: CombinedCenter) => {
    if (!userLocation) {
      toast({
        title: "Location required",
        description: "Please allow location access to get directions.",
        variant: "destructive",
      })
      return
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${center.location.coordinates[1]},${center.location.coordinates[0]}&travelmode=driving`
    console.log('🗺️ Opening directions in Google Maps:', url)
    window.open(url, "_blank")
  }, [userLocation, toast])

  // Initialize everything
  useEffect(() => {
    if (loadError) {
      console.error('❌ Google Maps load error:', loadError)
      toast({
        title: "Maps loading error",
        description: "Failed to load Google Maps. Please check your API key configuration.",
        variant: "destructive",
      })
      return
    }

    getUserLocation()
  }, [getUserLocation, loadError, toast])

  useEffect(() => {
    initializeMap()
  }, [initializeMap])

  useEffect(() => {
    if (userLocation) {
      fetchCenters()
    }
  }, [fetchCenters])

  useEffect(() => {
    updateMapMarkers()
  }, [updateMapMarkers])

  if (loadError) {
    return (
      <Card className="w-full shadow-soft">
        <CardHeader>
          <CardTitle>Find Donation Centers</CardTitle>
          <CardDescription>Locate blood donation centers near you</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground">Failed to load Google Maps</p>
            <p className="text-sm text-muted-foreground mt-2">Please check your API key configuration</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-soft">
      <CardHeader>
        <CardTitle>Find Donation Centers</CardTitle>
        <CardDescription>Locate blood donation centers near you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select value={bloodFilter} onValueChange={setBloodFilter}>
              <SelectTrigger id="bloodType">
                <SelectValue placeholder="Any blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any blood type</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radius">Distance (km)</Label>
            <Select value={radiusFilter} onValueChange={setRadiusFilter}>
              <SelectTrigger id="radius">
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="25">25 km</SelectItem>
                <SelectItem value="50">50 km</SelectItem>
                <SelectItem value="100">100 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="flex gap-2">
              <Input 
                id="search" 
                placeholder="Search by name or address" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="button" size="icon" onClick={() => fetchCenters()}>
                <MapPin className="h-4 w-4" />
                <span className="sr-only">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Google Places Toggle */}
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <Switch
            id="google-places"
            checked={useGooglePlaces}
            onCheckedChange={setUseGooglePlaces}
          />
          <Label htmlFor="google-places" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Use Google Places API for enhanced search
          </Label>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Database</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Google Places</span>
            </div>
          </div>
        </div>

        <div className="relative w-full h-[500px] bg-gray-100 rounded-md overflow-hidden">
          {!mapsLoaded || isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {!mapsLoaded ? "Loading Google Maps..." : "Loading donation centers..."}
                </p>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Nearby Centers ({filteredCenters.length})
            </h3>
            {userLocation && (
              <Button variant="outline" size="sm" onClick={getUserLocation}>
                <MapPin className="h-4 w-4 mr-2" />
                Update Location
              </Button>
            )}
          </div>

          {filteredCenters.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No centers found matching your criteria.</p>
              <Button variant="outline" className="mt-2" onClick={() => {
                setBloodFilter("")
                setSearchQuery("")
                setRadiusFilter("50")
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCenters.map((center, index) => {
                const todayHours = getCurrentDayHours(center)
                const isOpen = isOpenNow(center)
                const route = routeInfo[center.id || center._id]
                const isGooglePlaces = 'placeId' in center
                
                return (
                  <div 
                    key={center.id || center._id} 
                    className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                      selectedCenter?.id === center.id || selectedCenter?._id === center._id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedCenter(center)
                      if (userLocation) {
                        calculateRoute(center)
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-lg">{center.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {isGooglePlaces ? (
                                  <>
                                    <Map className="h-3 w-3 mr-1" />
                                    Google Places
                                  </>
                                ) : (
                                  <>
                                    <Database className="h-3 w-3 mr-1" />
                                    Database
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{center.address.fullAddress}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {center.rating.average > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{center.rating.average.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">({center.rating.count})</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {center.bloodTypesAccepted.slice(0, 4).map((bloodType) => (
                            <Badge 
                              key={bloodType} 
                              variant="secondary" 
                              className={`text-xs ${getBloodTypeColor(bloodType)}`}
                            >
                              {bloodType}
                            </Badge>
                          ))}
                          {center.bloodTypesAccepted.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{center.bloodTypesAccepted.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className={isOpen ? "text-green-600" : "text-red-600"}>
                              {todayHours.closed ? "Closed today" : 
                               isOpen ? `Open until ${todayHours.close}` : 
                               `Opens at ${todayHours.open}`}
                            </span>
                          </div>
                          
                          {center.contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{center.contact.phone}</span>
                            </div>
                          )}
                          
                          {center.contact.website && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              <a 
                                href={center.contact.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Website
                              </a>
                            </div>
                          )}
                        </div>

                        {route && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span>🚗 {formatDuration(route.duration)}</span>
                            <span>📍 {formatDistance(route.distance)}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mb-3">
                          {center.features.slice(0, 3).map((feature) => (
                            <Badge key={feature} variant="outline" className="text-xs capitalize">
                              {feature.replace('_', ' ')}
                            </Badge>
                          ))}
                          {center.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{center.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          getDirections(center)
                        }}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      
                      {center.contact.phone && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`tel:${center.contact.phone}`)
                          }}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}