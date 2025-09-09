"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Type definitions for geolocation
interface GeolocationAddress {
  city: string
  fullAddress: string
  country: string
  state: string
}
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DonationConfirmationModal } from "./donation-confirmation-modal"

export function DonationForm() {
  const [bloodGroup, setBloodGroup] = useState("")
  const [date, setDate] = useState<Date>()
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [healthCondition, setHealthCondition] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [city, setCity] = useState("")
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    // Try to get user's location when component mounts
    getLocation().catch(console.error)
  }, [])

  const getLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter your location manually.",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 300000 // 5 minutes cache
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
      })

      const { latitude, longitude } = position.coords
      
      // Use reverse geocoding to get address from coordinates
      const address = await reverseGeocode(latitude, longitude)
      
      if (address) {
        setCity(address.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        setLocation(address.fullAddress || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        
        toast({
          title: "Location detected",
          description: `We've found your location: ${address.city || 'Unknown location'}`,
        })
      } else {
        // Fallback to coordinates if reverse geocoding fails
        setCity(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        
        toast({
          title: "Location detected",
          description: "Location coordinates detected. Please verify the address.",
        })
      }
    } catch (error: any) {
      console.error("Error getting location:", error)
      
      let errorMessage = "Please enter your location manually."
      
      if (error.code === 1) {
        errorMessage = "Location access denied. Please enable location permissions or enter manually."
      } else if (error.code === 2) {
        errorMessage = "Location unavailable. Please enter your location manually."
      } else if (error.code === 3) {
        errorMessage = "Location request timed out. Please try again or enter manually."
      }

      toast({
        title: "Location not available",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGettingLocation(false)
    }
  }

  // Reverse geocoding function using a free API
  const reverseGeocode = async (latitude: number, longitude: number): Promise<GeolocationAddress | null> => {
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'LightCharity/1.0' // Required by Nominatim
          }
        }
      )

      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }

      const data = await response.json()
      
      if (data.display_name) {
        const addressParts = data.display_name.split(', ')
        const city = addressParts[1] || addressParts[0] || 'Unknown City'
        
        return {
          city,
          fullAddress: data.display_name,
          country: data.address?.country || '',
          state: data.address?.state || ''
        }
      }
      
      return null
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to schedule a donation.",
        variant: "destructive",
      })
      return
    }

    // Form validation
    if (!bloodGroup) {
      toast({
        title: "Missing information",
        description: "Please select your blood group.",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a donation date.",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Missing information",
        description: "Please enter a donation location.",
        variant: "destructive",
      })
      return
    }

    if (!healthCondition) {
      toast({
        title: "Health confirmation required",
        description: "Please confirm you're in good health to donate.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${API_BASE_URL}/api/donations/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bloodGroup,
          scheduledDate: date.toISOString(),
          location,
          notes,
          healthConfirmed: healthCondition,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to schedule donation')
      }

      // Show confirmation modal
      setShowConfirmation(true)
    } catch (error: any) {
      console.error('Error scheduling donation:', error)
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmationComplete = () => {
    setShowConfirmation(false)

    // Reset form
    setBloodGroup("")
    setDate(undefined)
    setLocation("")
    setNotes("")
    setHealthCondition(false)

    toast({
      title: "Donation scheduled",
      description: "Thank you for your donation! We'll see you soon.",
    })
  }

  return (
    <>
      <Card className="w-full max-w-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Schedule Blood Donation</CardTitle>
          <CardDescription>Fill out the form below to schedule your blood donation</CardDescription>
        </CardHeader>
        <CardContent>
          {city && (
            <div className="bg-red-50 p-3 rounded-md mb-6 flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <p className="text-sm">
                You&apos;re donating from <strong>{city}</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup} disabled={isLoading}>
                <SelectTrigger id="bloodGroup" className="w-full">
                  <SelectValue placeholder="Select your blood group" />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="date">Date of Donation</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    disabled={isLoading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) =>
                      date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">Donation Location</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={getLocation}
                  disabled={isGettingLocation || isLoading}
                  className="h-8 text-xs"
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-1 h-3 w-3" />
                      Detect location
                    </>
                  )}
                </Button>
              </div>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter donation center or hospital name"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information we should know"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="healthCondition"
                checked={healthCondition}
                onCheckedChange={(checked) => setHealthCondition(checked as boolean)}
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="healthCondition"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Health Confirmation
                </Label>
                <p className="text-sm text-muted-foreground">
                  I confirm that I am in good health, have not donated blood in the last 3 months, and have not had any
                  recent illnesses or surgeries.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Schedule Donation"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <DonationConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onComplete={handleConfirmationComplete}
        bloodGroup={bloodGroup}
        date={date}
        location={location}
      />
    </>
  )
}
