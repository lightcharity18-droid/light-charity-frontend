"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, Database } from "lucide-react"
import { donationCentersAPI } from "@/lib/donation-centers"

export function DebugLocationMap() {
  const [centers, setCenters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const testAPI = async () => {
    console.log('🧪 Testing Donation Centers API with Google Places integration...')
    setIsLoading(true)
    setError(null)
    
    try {
      // Test 1: Get all centers from database
      console.log('\n📍 Test 1: Getting centers from database')
      const dbResponse = await donationCentersAPI.getAllCenters({ limit: 50 })
      
      if (dbResponse.success) {
        console.log(`✅ Found ${dbResponse.count} centers from database:`)
        dbResponse.data.forEach((center, index) => {
          console.log(`${index + 1}. ${center.name} - ${center.address.city}, ${center.address.state} (Database)`)
        })
      } else {
        console.error('❌ Failed to fetch database centers:', dbResponse.message)
      }
      
      // Test 2: Get centers from Google Places API
      console.log('\n🗺️ Test 2: Getting centers from Google Places API')
      const placesResponse = await donationCentersAPI.getCentersFromGooglePlaces({
        latitude: 40.7128, // NYC
        longitude: -74.0060,
        radius: 25000
      })
      
      if (placesResponse.success) {
        console.log(`✅ Found ${placesResponse.count} centers from Google Places:`)
        placesResponse.data.forEach((center, index) => {
          console.log(`${index + 1}. ${center.name} - ${center.address.city}, ${center.address.state} (Google Places)`)
          console.log(`   📍 ${center.address.fullAddress}`)
          console.log(`   ⭐ Rating: ${center.rating.average}/5 (${center.rating.count} reviews)`)
          console.log(`   📞 Phone: ${center.contact.phone || 'N/A'}`)
          console.log(`   🌐 Website: ${center.contact.website || 'N/A'}`)
          console.log(`   🏢 Business Status: ${center.businessStatus}`)
          console.log('   ---')
        })
      } else {
        console.error('❌ Failed to fetch Google Places centers:', placesResponse.message)
      }
      
      // Test 3: Get combined results
      console.log('\n🔄 Test 3: Getting combined results (Database + Google Places)')
      const combinedResponse = await donationCentersAPI.getAllCentersCombined({
        latitude: 40.7128,
        longitude: -74.0060,
        radius: 25000,
        useGooglePlaces: true
      })
      
      if (combinedResponse.success) {
        console.log(`✅ Found ${combinedResponse.count} total unique centers:`)
        combinedResponse.data.forEach((center, index) => {
          const source = 'placeId' in center ? 'Google Places' : 'Database'
          console.log(`${index + 1}. ${center.name} - ${center.address.city}, ${center.address.state} (${source})`)
        })
        
        setCenters(combinedResponse.data)
      } else {
        console.error('❌ Failed to fetch combined centers:', combinedResponse.message)
      }
      
      // Test 4: Test different locations
      console.log('\n🌍 Test 4: Testing different locations')
      const locations = [
        { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
        { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
        { name: 'Miami', lat: 25.7617, lng: -80.1918 }
      ]
      
      for (const location of locations) {
        console.log(`\n📍 Testing ${location.name} (${location.lat}, ${location.lng})`)
        try {
          const response = await donationCentersAPI.getCentersFromGooglePlaces({
            latitude: location.lat,
            longitude: location.lng,
            radius: 25000
          })
          
          if (response.success) {
            console.log(`✅ Found ${response.count} centers in ${location.name}`)
            response.data.slice(0, 3).forEach((center, index) => {
              console.log(`   ${index + 1}. ${center.name}`)
            })
          } else {
            console.log(`❌ No centers found in ${location.name}`)
          }
        } catch (error) {
          console.error(`❌ Error testing ${location.name}:`, error)
        }
      }
      
      console.log('\n🎉 All tests completed!')
      
    } catch (error) {
      console.error('❌ Test failed with error:', error)
      setError(error.message)
      console.log('\n💡 Make sure:')
      console.log('   1. Backend server is running on port 5000')
      console.log('   2. MongoDB is connected')
      console.log('   3. You have run: npm run seed-centers')
      console.log('   4. Google Maps API key is configured')
      console.log('   5. Google Places API is enabled in Google Cloud Console')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-soft">
      <CardHeader>
        <CardTitle>Debug: Donation Centers API with Google Places</CardTitle>
        <CardDescription>Test the enhanced donation centers API with Google Places integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <Button onClick={testAPI} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Test Enhanced API'}
          </Button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {centers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Found {centers.length} Centers:</h3>
            <div className="space-y-2">
              {centers.slice(0, 10).map((center, index) => {
                const isGooglePlaces = 'placeId' in center
                return (
                  <div key={center.id || center._id} className="p-3 border rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{center.name}</h4>
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
                    <p className="text-sm text-gray-600">{center.address.fullAddress}</p>
                    <p className="text-sm text-gray-500">
                      Blood Types: {center.bloodTypesAccepted.join(', ')}
                    </p>
                    {isGooglePlaces && (
                      <p className="text-sm text-gray-500">
                        Business Status: {center.businessStatus}
                      </p>
                    )}
                  </div>
                )
              })}
              {centers.length > 10 && (
                <p className="text-sm text-gray-500">
                  ... and {centers.length - 10} more (check console for full list)
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>What this tests:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Database centers (from seeded data)</li>
            <li>Google Places API integration with multiple search strategies</li>
            <li>Combined results with deduplication</li>
            <li>Different geographic locations</li>
            <li>Real-time business information from Google</li>
          </ul>
          
          <p className="mt-4"><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Open browser developer tools (F12)</li>
            <li>Go to the Console tab</li>
            <li>Click "Test Enhanced API" button above</li>
            <li>Check console output for detailed results</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}