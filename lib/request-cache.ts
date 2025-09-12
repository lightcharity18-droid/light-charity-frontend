// Simple in-memory request cache to prevent duplicate API calls
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private pendingRequests = new Map<string, Promise<any>>()
  private readonly TTL = 30000 // 30 seconds cache TTL

  // Generate cache key from URL and request options
  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET'
    const body = options?.body || ''
    return `${method}:${url}:${body}`
  }

  // Check if cache entry is still valid
  private isValidCacheEntry(entry: { data: any; timestamp: number }): boolean {
    return Date.now() - entry.timestamp < this.TTL
  }

  // Cached fetch function
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    const cacheKey = this.getCacheKey(url, options)

    // Check if we have a valid cached response
    const cached = this.cache.get(cacheKey)
    if (cached && this.isValidCacheEntry(cached)) {
      // Return a fake Response object with cached data
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if there's already a pending request for this key
    const pendingRequest = this.pendingRequests.get(cacheKey)
    if (pendingRequest) {
      return pendingRequest
    }

    // Make the actual request
    const requestPromise = fetch(url, options).then(async (response) => {
      // Only cache successful GET requests
      if (response.ok && (options?.method || 'GET') === 'GET') {
        try {
          const data = await response.clone().json()
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
          })
        } catch (error) {
          // If response is not JSON, don't cache it
          console.warn('Failed to cache non-JSON response:', error)
        }
      }
      
      // Clean up pending request
      this.pendingRequests.delete(cacheKey)
      return response
    }).catch((error) => {
      // Clean up pending request on error
      this.pendingRequests.delete(cacheKey)
      throw error
    })

    // Store pending request
    this.pendingRequests.set(cacheKey, requestPromise)
    return requestPromise
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear()
    this.pendingRequests.clear()
  }

  // Clear expired cache entries
  clearExpired(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValidCacheEntry(entry)) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache stats for debugging
  getStats(): { cacheSize: number; pendingRequests: number } {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size
    }
  }
}

// Export singleton instance
export const requestCache = new RequestCache()

// Periodically clean up expired cache entries
setInterval(() => {
  requestCache.clearExpired()
}, 60000) // Clean up every minute
