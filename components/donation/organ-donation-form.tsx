"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Loader2, CalendarIcon, MapPin, Heart } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { OrganDonationConfirmationModal } from "./organ-donation-confirmation-modal"

// Type definitions for geolocation
interface GeolocationAddress {
  city: string
  fullAddress: string
  country: string
  state: string
}

export function OrganDonationForm() {
  const [organsToDonate, setOrgansToDonate] = useState<string[]>([])
  const [date, setDate] = useState<Date>()
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [healthCondition, setHealthCondition] = useState(false)
  const [familyConsent, setFamilyConsent] = useState(false)
  const [medicalHistory, setMedicalHistory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [city, setCity] = useState("")
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  const organOptions = [
    { value: "heart", label: "Heart", description: "Can save 1 life" },
    { value: "liver", label: "Liver", description: "Can save 1 life" },
    { value: "kidneys", label: "Kidneys", description: "Can save 2 lives" },
    { value: "lungs", label: "Lungs", description: "Can save 2 lives" },
    { value: "pancreas", label: "Pancreas", description: "Can save 1 life" },
    { value: "intestines", label: "Intestines", description: "Can save 1 life" },
    { value: "corneas", label: "Corneas", description: "Can restore sight to 2 people" },
    { value: "skin", label: "Skin", description: "Can help burn victims" },
    { value: "bone", label: "Bone", description: "Can help with reconstructive surgery" },
    { value: "tendons", label: "Tendons", description: "Can help with joint reconstruction" },
  ]

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

  const handleOrganChange = (organValue: string, checked: boolean) => {
    if (checked) {
      setOrgansToDonate(prev => [...prev, organValue])
    } else {
      setOrgansToDonate(prev => prev.filter(organ => organ !== organValue))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to register for organ donation.",
        variant: "destructive",
      })
      return
    }

    // Form validation
    if (organsToDonate.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select at least one organ you wish to donate.",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a registration date.",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Missing information",
        description: "Please enter your location.",
        variant: "destructive",
      })
      return
    }

    if (!healthCondition) {
      toast({
        title: "Health confirmation required",
        description: "Please confirm you understand the health requirements.",
        variant: "destructive",
      })
      return
    }

    if (!familyConsent) {
      toast({
        title: "Family consent required",
        description: "Please confirm you have discussed this with your family.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const token = localStorage.getItem('auth_token')

      const response = await fetch(`${API_BASE_URL}/api/organ-donations/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          organsToDonate,
          registrationDate: date.toISOString(),
          location,
          notes,
          medicalHistory,
          healthConfirmed: healthCondition,
          familyConsent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for organ donation')
      }

      // Show confirmation modal
      setShowConfirmation(true)
    } catch (error: any) {
      console.error('Error registering for organ donation:', error)
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
    setOrgansToDonate([])
    setDate(undefined)
    setLocation("")
    setNotes("")
    setMedicalHistory("")
    setHealthCondition(false)
    setFamilyConsent(false)

    toast({
      title: "Registration successful",
      description: "Thank you for registering as an organ donor! You're a hero.",
    })
  }

  return (
    <>
      <Card className="w-full max-w-2xl shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            Organ Donation Registration
          </CardTitle>
          <CardDescription>
            Register to become an organ donor and give the gift of life. Your decision can save multiple lives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {city && (
            <div className="bg-green-50 p-3 rounded-md mb-6 flex items-center">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <p className="text-sm">
                You&apos;re registering from <strong>{city}</strong>
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Organs I Wish to Donate</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {organOptions.map((organ) => (
                  <div key={organ.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={organ.value}
                      checked={organsToDonate.includes(organ.value)}
                      onCheckedChange={(checked) => handleOrganChange(organ.value, checked as boolean)}
                      disabled={isLoading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={organ.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {organ.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {organ.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Registration Date</Label>
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
                <PopoverContent className="w-[320px] p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="w-full"
                    classNames={{
                      head_cell: "w-9 font-normal text-muted-foreground",
                      cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                      day: "w-9 h-9 p-0 font-normal aria-selected:opacity-100",
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside: "text-muted-foreground opacity-50",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                      nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      table: "w-full border-collapse space-y-1",
                    }}
                    disabled={(date) =>
                      date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="location">Location</Label>
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
                placeholder="Enter your city or address"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Please describe any relevant medical conditions, surgeries, or medications"
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information or special requests"
                disabled={isLoading}
                rows={2}
              />
            </div>

            <div className="space-y-4">
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
                    Health Understanding
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    I understand that organ donation is a medical decision that will be evaluated at the time of need, 
                    and that my organs will only be used if they are medically suitable and can help save lives.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="familyConsent"
                  checked={familyConsent}
                  onCheckedChange={(checked) => setFamilyConsent(checked as boolean)}
                  disabled={isLoading}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="familyConsent"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Family Discussion
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    I have discussed my decision to become an organ donor with my family and loved ones, 
                    and they understand and support my choice.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  Register as Organ Donor
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <OrganDonationConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onComplete={handleConfirmationComplete}
        organsToDonate={organsToDonate}
        date={date}
        location={location}
      />
    </>
  )
}

