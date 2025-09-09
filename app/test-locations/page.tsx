import { DebugLocationMap } from "@/components/debug-location-map"

export default function TestLocationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Test Donation Centers API
        </h1>
        <DebugLocationMap />
      </div>
    </div>
  )
}
