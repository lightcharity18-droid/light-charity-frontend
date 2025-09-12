"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authService } from '@/lib/auth'
import { useAuth } from '@/contexts/auth-context'
import { useGlobalMessages } from '@/hooks/use-websocket'
import { CommunityMessage } from '@/lib/websocket'

interface UnreadCommunity {
  communityId: string
  communityName: string
  unreadCount: number
}

interface UnreadMessageCounts {
  communities: UnreadCommunity[]
  totalUnread: number
}

interface MessageContextType {
  unreadCounts: UnreadMessageCounts | null
  refreshUnreadCounts: () => Promise<void>
  markCommunityAsRead: (communityId: string) => Promise<void>
  incrementUnreadCount: (communityId: string) => void
  isLoading: boolean
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

interface MessageProviderProps {
  children: ReactNode
}

export function MessageProvider({ children }: MessageProviderProps) {
  const [unreadCounts, setUnreadCounts] = useState<UnreadMessageCounts | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()

  // Global WebSocket connection to receive messages from all communities
  const globalWebSocket = useGlobalMessages((message: CommunityMessage, communityId: string) => {
    // Only increment unread count if the message is from another user
    if (user && message.sender._id !== user._id) {
      incrementUnreadCount(communityId)
    }
  })

  const refreshUnreadCounts = useCallback(async () => {
    if (!isAuthenticated || !authService.getToken()) {
      setUnreadCounts(null)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/messages/unread-counts`,
        {
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUnreadCounts(data.data)
        }
      } else {
        console.error('Failed to fetch unread counts:', response.status)
      }
    } catch (error) {
      console.error('Error fetching unread counts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  const markCommunityAsRead = useCallback(async (communityId: string) => {
    if (!isAuthenticated || !authService.getToken()) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/${communityId}/messages/mark-read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authService.getToken()}`
          }
        }
      )

      if (response.ok) {
        // Update local state immediately for better UX
        setUnreadCounts(prev => {
          if (!prev) return prev

          const updatedCommunities = prev.communities.map(community =>
            community.communityId === communityId
              ? { ...community, unreadCount: 0 }
              : community
          )

          const newTotalUnread = updatedCommunities.reduce(
            (sum, community) => sum + community.unreadCount,
            0
          )

          return {
            communities: updatedCommunities,
            totalUnread: newTotalUnread
          }
        })
      }
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }, [isAuthenticated])

  const incrementUnreadCount = useCallback((communityId: string) => {
    setUnreadCounts(prev => {
      if (!prev) return prev

      const updatedCommunities = prev.communities.map(community =>
        community.communityId === communityId
          ? { ...community, unreadCount: community.unreadCount + 1 }
          : community
      )

      const newTotalUnread = updatedCommunities.reduce(
        (sum, community) => sum + community.unreadCount,
        0
      )

      return {
        communities: updatedCommunities,
        totalUnread: newTotalUnread
      }
    })
  }, [])

  // Load unread counts when user changes or component mounts
  useEffect(() => {
    if (user) {
      refreshUnreadCounts()
    } else {
      setUnreadCounts(null)
      setIsLoading(false)
    }
  }, [user, refreshUnreadCounts])

  // Refresh counts periodically (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      refreshUnreadCounts()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [isAuthenticated, refreshUnreadCounts])

  const value: MessageContextType = {
    unreadCounts,
    refreshUnreadCounts,
    markCommunityAsRead,
    incrementUnreadCount,
    isLoading
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessageContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider')
  }
  return context
}
