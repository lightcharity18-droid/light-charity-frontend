"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestCache } from "@/lib/request-cache"

interface PlacesAutocompleteProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type: 'city' | 'country'
  required?: boolean
  className?: string
}

export function PlacesAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  type,
  required = false,
  className = ""
}: PlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()

  // Debounced autocomplete function using backend Places API (New)
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
      const response = await requestCache.fetch(`${backendUrl}/api/donation-centers/places/autocomplete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: query,
          types: type === 'city' ? ['(cities)'] : ['country'],
          language: 'en',
          type: type
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSuggestions(data.predictions || [])
          setShowSuggestions(data.predictions?.length > 0)
        } else {
          console.error('Backend error:', data.message)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } else {
        console.error('Error fetching suggestions:', response.statusText)
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }, [type])

  // Handle input changes with debouncing
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    onChange(query)

    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout for debounced search (increased to reduce API calls)
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(query)
    }, 500)
  }, [onChange, fetchSuggestions])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const handleSuggestionClick = useCallback((suggestion: any) => {
    let extractedValue = suggestion.description

    // Try to extract just the city or country name if possible
    if (type === 'city' && suggestion.structured_formatting?.main_text) {
      extractedValue = suggestion.structured_formatting.main_text
    } else if (type === 'country' && suggestion.structured_formatting?.main_text) {
      extractedValue = suggestion.structured_formatting.main_text
    }

    onChange(extractedValue)
    setShowSuggestions(false)
    setSuggestions([])
  }, [onChange, type])

  return (
    <div className={`space-y-2 ${className} relative`}>
      {label && (
        <Label htmlFor={`${type}-input`}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id={`${type}-input`}
          type="text"
          placeholder={placeholder || `Enter ${type}...`}
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          required={required}
          className="w-full"
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id || index}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {suggestion.structured_formatting?.main_text || suggestion.description}
              </div>
              {suggestion.structured_formatting?.secondary_text && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {suggestion.structured_formatting.secondary_text}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
