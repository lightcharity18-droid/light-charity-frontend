"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Send,
  Users,
  MessageCircle,
  Settings,
  Heart,
  Stethoscope,
  UserCheck,
  Globe,
  Lock,
  Clock,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useMessages } from "@/contexts/message-context"
import { useToast } from "@/hooks/use-toast"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { authService } from "@/lib/auth"
import { webSocketService, CommunityMessage } from "@/lib/websocket"

interface Community {
  _id: string
  name: string
  description: string
  category: string
  type: 'public' | 'private'
  city?: string
  country?: string
  createdBy: {
    _id: string
    firstName?: string
    lastName?: string
    name?: string
    userType: string
  }
  members: Array<{
    user: {
      _id: string
      firstName?: string
      lastName?: string
      name?: string
      userType: string
    }
    role: string
    joinedAt: string
  }>
  stats: {
    memberCount: number
    messageCount: number
    lastActivityAt: string
  }
  tags: string[]
  createdAt: string
}

interface Message {
  _id: string
  content: string
  sender: {
    _id: string
    firstName?: string
    lastName?: string
    name?: string
    userType: string
  }
  messageType: string
  systemMessageType?: string
  createdAt: string
  isEdited: boolean
  editedAt?: string
  reactions: Array<{
    user: string
    emoji: string
    createdAt: string
  }>
}

interface UserMembership {
  isMember: boolean
  role: string | null
}

const categoryIcons = {
  blood_donation: Heart,
  health_awareness: Stethoscope,
  volunteer: UserCheck,
  general: MessageCircle,
  emergency: Clock
}

const categoryLabels = {
  blood_donation: "Blood Donation",
  health_awareness: "Health Awareness", 
  volunteer: "Volunteer",
  general: "General",
  emergency: "Emergency"
}

const categoryColors = {
  blood_donation: "bg-red-100 text-red-800",
  health_awareness: "bg-blue-100 text-blue-800",
  volunteer: "bg-green-100 text-green-800",
  general: "bg-gray-100 text-gray-800",
  emergency: "bg-orange-100 text-orange-800"
}

export default function CommunityPage() {
  const [community, setCommunity] = useState<Community | null>(null)
  const [userMembership, setUserMembership] = useState<UserMembership>({ isMember: false, role: null })
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [lastMessageId, setLastMessageId] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isLoading: authLoading } = useAuth()
  const { markCommunityAsRead } = useMessages()
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const communityId = params.id as string
  
  // Debug user and auth state
  console.log('CommunityPage render:', {
    user,
    authLoading,
    communityId,
    messagesCount: messages.length
  })

  useEffect(() => {
    if (communityId) {
      fetchCommunity()
    }
  }, [communityId])

  useEffect(() => {
    if (userMembership.isMember) {
      fetchMessages(true)
      
      // Set up WebSocket connection and message handling
      const initializeWebSocket = async () => {
        try {
          // Check if user is authenticated before attempting WebSocket connection
          if (!authService.isAuthenticated() || !authService.getToken()) {
            console.warn('User not authenticated or no token available, skipping WebSocket connection')
            return
          }

          // Check if WebSocket can connect (circuit breaker check)
          if (!webSocketService.canConnect()) {
            console.warn('WebSocket cannot connect (circuit breaker or auth issue), skipping connection')
            return
          }

          const connected = await webSocketService.connect()
          console.log('WebSocket connection result:', connected)
          if (connected) {
            // Note: The backend automatically subscribes users to their communities upon connection
            // No need to explicitly subscribe here as it causes redundant subscription attempts
            
            // Set up event handlers
            webSocketService.setEventHandlers({
              onNewMessage: (message: CommunityMessage, messageCommunityId: string) => {
                console.log('onNewMessage handler called with:', {
                  receivedCommunityId: messageCommunityId,
                  currentCommunityId: communityId,
                  messageId: message._id,
                  sender: message.sender,
                  content: message.content?.substring(0, 30) + '...'
                });
                
                if (messageCommunityId === communityId) {
                  console.log('WebSocket received new message for current community:', messageCommunityId, 'Message ID:', message._id)
                  
                  // Force immediate state update with new message
                  setMessages(prev => {
                    // Check if message already exists to avoid duplicates
                    const exists = prev.some(m => m._id === message._id)
                    if (!exists) {
                      const updatedMessages = [...prev, message]
                      console.log('Adding new message to state, total messages:', updatedMessages.length)
                      console.log('New message details:', {
                        id: message._id,
                        sender: message.sender,
                        content: message.content,
                        createdAt: message.createdAt
                      })
                      return updatedMessages
                    } else {
                      console.log('Message already exists in state, skipping duplicate')
                    }
                    return prev
                  })
                  
                  // Force scroll to bottom when receiving new messages
                  setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                } else {
                  console.log('Received message for different community, ignoring. Received:', messageCommunityId, 'Current:', communityId)
                }
              },
              onMessageEdited: (message: CommunityMessage, messageCommunityId: string) => {
                if (messageCommunityId === communityId) {
                  setMessages(prev => 
                    prev.map(m => m._id === message._id ? message : m)
                  )
                }
              },
              onMessageDeleted: (messageId: string, messageCommunityId: string) => {
                if (messageCommunityId === communityId) {
                  setMessages(prev => prev.filter(m => m._id !== messageId))
                }
              },
              onConnectionEstablished: (userId: string) => {
                console.log('WebSocket connection established for user:', userId);
                console.log('Backend will automatically subscribe user to their communities');
              },
              onCommunitySubscribed: (subscribedCommunityId: string, communityName: string) => {
                if (subscribedCommunityId === communityId) {
                  console.log(`Successfully subscribed to community ${communityName} (${subscribedCommunityId}) via WebSocket.`);
                }
              },
              onError: (error: string) => {
                console.error('WebSocket error:', error)
                // Don't show error toasts for connection issues to avoid spam
              }
            })
          } else {
            console.warn('WebSocket connection failed, falling back to polling')
          }
        } catch (error) {
          console.error('Failed to initialize WebSocket:', error)
        }
      }
      
      initializeWebSocket()

      // Fallback polling for new messages every 10 seconds (less frequent since we have WebSocket)
      const pollInterval = setInterval(() => {
        fetchMessages(false)
      }, 10000)

      return () => {
        clearInterval(pollInterval)
        // Unsubscribe from community when component unmounts
        webSocketService.unsubscribeFromCommunity(communityId)
        // Clear event handlers to prevent memory leaks
        webSocketService.setEventHandlers({})
      }
    }
  }, [userMembership.isMember, communityId])

  useEffect(() => {
    // Only scroll for new messages, not initial load
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length])

  const fetchCommunity = async () => {
    try {
      const token = authService.getToken()
      if (!token || !authService.isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to view communities",
          variant: "destructive"
        })
        router.push('/login')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/${communityId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCommunity(data.data.community)
        setUserMembership(data.data.userMembership)
        
        // Mark messages as read when user opens the community
        if (data.data.userMembership.isMember) {
          await markCommunityAsRead(communityId)
        }
      } else if (response.status === 404) {
        toast({
          title: "Error",
          description: "Community not found",
          variant: "destructive"
        })
        router.push('/dashboard/communities')
      } else if (response.status === 403) {
        toast({
          title: "Access Denied",
          description: "This is a private community",
          variant: "destructive"
        })
        router.push('/dashboard/communities')
      }
    } catch (error) {
      console.error('Error fetching community:', error)
      toast({
        title: "Error",
        description: "Failed to load community",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setMessagesLoading(true)
      }
      const token = authService.getToken()
      if (!token || !authService.isAuthenticated()) {
        return
      }

      // Load all messages for the community
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/${communityId}/messages?loadRecent=true&loadAll=true`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const newMessages = data.data.messages
        
        // Only update if there are new messages or it's the initial load
        if (isInitialLoad || newMessages.length !== messages.length || 
            (newMessages.length > 0 && newMessages[newMessages.length - 1]._id !== lastMessageId)) {
          setMessages(newMessages)
          if (newMessages.length > 0) {
            setLastMessageId(newMessages[newMessages.length - 1]._id)
          }
          
          // For initial load, scroll instantly to bottom
          if (isInitialLoad && newMessages.length > 0) {
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
            }, 50)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      if (isInitialLoad) {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        })
      }
    } finally {
      if (isInitialLoad) {
        setMessagesLoading(false)
      }
    }
  }

  const joinCommunity = async () => {
    try {
      const token = authService.getToken()
      if (!token || !authService.isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to join communities",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/${communityId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Successfully joined the community!"
        })
        fetchCommunity()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to join community",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error joining community:', error)
      toast({
        title: "Error",
        description: "Failed to join community",
        variant: "destructive"
      })
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sendingMessage) return

    try {
      setSendingMessage(true)
      const token = authService.getToken()
      if (!token || !authService.isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to send messages",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/${communityId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newMessage.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Add message to local state immediately for better UX
        // This ensures the message appears right away without waiting for WebSocket
        const newMessageData = data.data.message
        console.log('Message sent successfully, updating local state:', newMessageData._id)
        console.log('Sent message data:', {
          id: newMessageData._id,
          sender: newMessageData.sender,
          content: newMessageData.content,
          createdAt: newMessageData.createdAt
        })
        setMessages(prev => {
          // Check for duplicates before adding
          const exists = prev.some(m => m._id === newMessageData._id)
          if (!exists) {
            return [...prev, newMessageData]
          }
          return prev
        })
        setLastMessageId(newMessageData._id)
        setNewMessage("")
        
        // Scroll to bottom
        scrollToBottom()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to send message",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setSendingMessage(false)
    }
  }

  const scrollToBottom = (smooth = true) => {
    // Use a small timeout to ensure DOM has updated before scrolling
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" })
    }, smooth ? 100 : 50)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getUserDisplayName = (user: any) => {
    return user.userType === 'donor' 
      ? `${user.firstName} ${user.lastName}`
      : user.name
  }

  const getUserInitials = (user: any) => {
    return user.userType === 'donor' 
      ? `${user.firstName?.[0]}${user.lastName?.[0]}`
      : user.name?.[0]
  }

  const MessageComponent = ({ message }: { message: Message }) => {
    // Enhanced debugging with more details
    console.log('=== MESSAGE ALIGNMENT DEBUG ===')
    console.log('MessageComponent render:', {
      messageId: message._id,
      messageSender: message.sender,
      messageSenderId: message.sender._id,
      messageSenderIdType: typeof message.sender._id,
      messageSenderName: message.sender.name,
      messageSenderFirstName: message.sender.firstName,
      messageSenderLastName: message.sender.lastName,
      messageSenderUserType: message.sender.userType,
      currentUser: user,
      currentUserId: user?._id,
      currentUserIdType: typeof user?._id,
      currentUserName: user?.name,
      currentUserFirstName: user?.firstName,
      currentUserLastName: user?.lastName,
      currentUserType: user?.userType,
      authLoading,
      messageContent: message.content.substring(0, 20) + '...'
    })
    
    // More robust user comparison with multiple fallback methods
    const directIdMatch = user && message.sender._id === user._id
    const stringIdMatch = user && message.sender._id?.toString() === user._id?.toString()
    const hospitalNameMatch = user && user.userType === 'hospital' && message.sender.name === user.name && message.sender.name
    const donorNameMatch = user && user.userType === 'donor' && 
      message.sender.firstName === user.firstName && 
      message.sender.lastName === user.lastName &&
      message.sender.firstName && message.sender.lastName
    
    const isOwnMessage = user && message.sender._id && (
      directIdMatch || 
      stringIdMatch ||
      hospitalNameMatch ||
      donorNameMatch
    )
    const isSystemMessage = message.messageType === 'system'
    
    console.log('=== COMPARISON RESULTS ===')
    console.log('Message alignment result:', {
      isOwnMessage,
      isSystemMessage,
      comparison: {
        directIdMatch,
        stringIdMatch,
        hospitalNameMatch,
        donorNameMatch,
        userExists: !!user,
        senderIdExists: !!message.sender._id
      }
    })
    console.log('=============================')

    if (isSystemMessage) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-muted rounded-full px-4 py-2">
            <p className="text-sm text-muted-foreground text-center">
              {message.content}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className={`flex mb-4 w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex gap-3 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isOwnMessage && (
            <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
              <AvatarFallback className="text-xs">
                {getUserInitials(message.sender)}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            {!isOwnMessage && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">
                  {getUserDisplayName(message.sender)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.createdAt)}
                </span>
                {message.isEdited && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
              </div>
            )}
            
            <div 
              className={`px-4 py-3 relative group shadow-sm break-words w-fit ${
                isOwnMessage 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-md'
              }`}
            >
              {/* Debug indicator - remove after testing */}
              {isOwnMessage && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {directIdMatch ? 'ID' : stringIdMatch ? 'STR' : hospitalNameMatch ? 'H' : donorNameMatch ? 'D' : '?'}
                  </span>
                </div>
              )}
              {!isOwnMessage && (
                <div className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              
              {isOwnMessage && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background shadow-sm"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-xs text-muted-foreground">
                {formatTime(message.createdAt)}
              </span>
              {message.isEdited && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            {message.reactions.length > 0 && (
              <div className={`flex gap-1 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                {message.reactions.map((reaction, index) => (
                  <span key={index} className="text-sm bg-white dark:bg-gray-700 px-2 py-1 rounded-full shadow-sm">
                    {reaction.emoji}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-muted rounded animate-pulse" />
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
        </div>
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!community) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Community not found</h3>
        <Link href="/dashboard/communities">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communities
          </Button>
        </Link>
      </div>
    )
  }

  const CategoryIcon = categoryIcons[community.category as keyof typeof categoryIcons]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/communities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{community.name}</h1>
            {community.type === 'private' ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Globe className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground">{community.description}</p>
          {(community.city || community.country) && (
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              {community.city && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">📍</span>
                  {community.city}
                </span>
              )}
              {community.city && community.country && <span>•</span>}
              {community.country && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">🌍</span>
                  {community.country}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Community Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={`${categoryColors[community.category as keyof typeof categoryColors]} flex items-center gap-1`}>
                <CategoryIcon className="h-3 w-3" />
                {categoryLabels[community.category as keyof typeof categoryLabels]}
              </Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{community.stats.memberCount} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{community.stats.messageCount} messages</span>
                </div>
              </div>
            </div>
            
            {!userMembership.isMember && (
              <Button onClick={joinCommunity}>
                Join Community
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Messages Section */}
      {userMembership.isMember ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs">Live</span>
                  </div>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                {messagesLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex justify-center items-center h-full text-center">
                    <div>
                      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No messages yet</h3>
                      <p className="text-muted-foreground">Be the first to start the conversation!</p>
                    </div>
                  </div>
                ) : authLoading || !user ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Debug info - remove after testing */}
                    <div className="text-xs text-muted-foreground p-2 bg-muted rounded mb-4">
                      <div><strong>Current User:</strong> {user?.email} (ID: {user?._id})</div>
                      <div><strong>User Type:</strong> {user?.userType}</div>
                      <div><strong>Messages:</strong> {messages.length}</div>
                      <div><strong>Auth Loading:</strong> {authLoading ? 'Yes' : 'No'}</div>
                    </div>
                    {messages.map((message) => (
                      <MessageComponent key={message._id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>
              
              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!newMessage.trim() || sendingMessage}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Members Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Members ({community.stats.memberCount})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[500px] overflow-y-auto">
                  {community.members.map((member, index) => (
                    <div key={member.user._id}>
                      <div className="flex items-center gap-3 p-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getUserInitials(member.user)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {getUserDisplayName(member.user)}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {index < community.members.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Join to participate</h3>
            <p className="text-muted-foreground mb-4">
              You need to be a member to view messages and participate in this community
            </p>
            <Button onClick={joinCommunity}>
              Join Community
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
