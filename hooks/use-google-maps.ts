"use client"

import { useEffect, useState } from 'react'

export interface GoogleMapsAPI {
  maps: typeof google.maps
  isLoaded: boolean
  loadError: Error | null
}

let googleMapsPromise: Promise<void> | null = null

const loadGoogleMaps = (): Promise<void> => {
  if (googleMapsPromise) {
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      resolve()
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      reject(new Error('Google Maps API key is not configured'))
      return
    }

    // Create script element for the new Places API
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMaps&loading=async`
    script.async = true
    script.defer = true

    // Set up callback
    ;(window as any).initGoogleMaps = () => {
      resolve()
    }

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'))
    }

    document.head.appendChild(script)
  })

  return googleMapsPromise
}

export const useGoogleMaps = (): GoogleMapsAPI => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<Error | null>(null)

  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        setIsLoaded(true)
        setLoadError(null)
      })
      .catch((error) => {
        setLoadError(error)
        setIsLoaded(false)
      })
  }, [])

  return {
    maps: typeof window !== 'undefined' && window.google ? window.google.maps : null as any,
    isLoaded,
    loadError
  }
}
