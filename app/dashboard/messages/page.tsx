"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send, Search, Users, ArrowLeft, Wifi, WifiOff, Menu, X } from "lucide-react"
import { Skeleton } from "@/components/ui/loading"
import { toast } from "@/hooks/use-toast"
import { authService } from "@/lib/auth"
import { useCommunityMessages } from "@/hooks/use-websocket"
import { CommunityMessage } from "@/lib/websocket"
import { useMessages } from "@/contexts/message-context"
import { useIsMobile } from "@/hooks/use-mobile"

interface Community {
  _id: string;
  name: string;
  description: string;
  city?: string;
  country?: string;
  members: Array<{
    user: {
      _id: string;
      firstName?: string;
      lastName?: string;
      name?: string;
      userType: string;
    };
    role: string;
  }>;
  stats: {
    memberCount: number;
    messageCount: number;
    lastActivityAt: string;
  };
}

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [messages, setMessages] = useState<CommunityMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null) // Add current user state
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { unreadCounts, markCommunityAsRead, incrementUnreadCount } = useMessages()
  const isMobile = useIsMobile()
  
  // Helper function to get unread count for a community
  const getUnreadCount = useCallback((communityId: string) => {
    if (!unreadCounts) return 0;
    const community = unreadCounts.communities.find(c => c.communityId === communityId);
    return community ? community.unreadCount : 0;
  }, [unreadCounts]);

  // WebSocket connection for real-time messages
  const webSocket = useCommunityMessages(
    selectedCommunity?._id || null,
    (message: CommunityMessage) => {
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(msg => msg._id === message._id);
        if (messageExists) {
          return prev; // Don't add duplicate
        }
        return [...prev, message];
      });
      
      // If message is from a different user and not in current community, increment unread count
      if (currentUser && message.sender._id !== currentUser._id) {
        if (!selectedCommunity || selectedCommunity._id !== message.community) {
          incrementUnreadCount(message.community);
        }
      }
      
      // Scroll to bottom when new message arrives
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  );

  // Load user communities
  const loadCommunities = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token || !authService.isAuthenticated()) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/my-communities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCommunities(data.data.communities || []);
      }
    } catch (error) {
      console.error('Error loading communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive"
      });
    }
  }, []);

  // Load current user data
  const loadCurrentUser = useCallback(async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        console.log('Current user loaded:', user);
      } else {
        // Try to get user profile from API if not in localStorage
        const profile = await authService.getProfile();
        setCurrentUser(profile);
        console.log('Current user loaded from API:', profile);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      // Set a fallback user object to prevent alignment issues
      setCurrentUser({ _id: 'unknown' });
    }
  }, []);

  // Load messages for selected community
  const loadCommunityMessages = useCallback(async (communityId: string) => {
    try {
      const token = authService.getToken();
      if (!token || !authService.isAuthenticated()) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/${communityId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive"
      });
    }
  }, []);

  // Send message to community
  const sendMessage = async () => {
    if (!selectedCommunity || !newMessage.trim()) return;

    try {
      setIsSending(true);
      const token = authService.getToken();
      
      if (!token || !authService.isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to send messages",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/${selectedCommunity._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          messageType: 'text'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add message to local state immediately for better UX
        const newMessageData = data.data?.message;
        
        if (newMessageData && newMessageData._id) {
          console.log('Message sent successfully, updating local state:', newMessageData._id);
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(msg => msg._id === newMessageData._id);
            if (messageExists) {
              return prev; // Don't add duplicate
            }
            return [...prev, newMessageData];
          });
          
          // Scroll to bottom after sending a message
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          console.warn('Message sent but response format unexpected:', data);
          // Refresh messages to ensure we have the latest
          loadCommunityMessages(selectedCommunity._id);
        }
        
        setNewMessage("");
      } else {
        toast({
          title: "Error",
          description: data.message || 'Failed to send message',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle community selection
  const selectCommunity = useCallback(async (community: Community) => {
    setSelectedCommunity(community);
    setMessages([]); // Clear previous messages
    
    // Close sidebar on mobile after selection
    if (isMobile) {
      setShowSidebar(false);
    }
    
    // Mark messages as read when opening a community
    await markCommunityAsRead(community._id);
    
    await loadCommunityMessages(community._id);
    
    // Scroll to bottom after loading messages
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, [loadCommunityMessages, markCommunityAsRead, isMobile]);
  
  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages.length]);

  // Initialize data and set up periodic refresh
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await loadCurrentUser(); // Load current user first
      await loadCommunities();
      setIsLoading(false);
      
      // Show sidebar by default on mobile if no community is selected
      if (isMobile && !selectedCommunity) {
        setShowSidebar(true);
      }
    };

    initializeData();
    
    // Set up periodic refresh of communities to update message counts
    const refreshInterval = setInterval(() => {
      loadCommunities();
    }, 5000); // Refresh every 5 seconds
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [loadCommunities, loadCurrentUser]);

  const filteredCommunities = communities.filter(
    (community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-1/3 border-r bg-card p-4">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-80px)] relative">
      {/* Mobile Menu Button */}
      {isMobile && !showSidebar && selectedCommunity && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 left-4 z-10 md:hidden"
          onClick={() => setShowSidebar(true)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Communities Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ${
              showSidebar ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'w-1/3 relative'
        } 
        border-r bg-card flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-foreground">Communities</h1>
            <div className="flex items-center gap-2">
              {webSocket.isConnected ? (
                <div className="flex items-center gap-1 text-green-500">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-500">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-xs">Offline</span>
                </div>
              )}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                  className="md:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        {/* Communities List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredCommunities.length > 0 ? (
              filteredCommunities.map((community) => (
                <Card
                  key={community._id}
                  className={`mb-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedCommunity?._id === community._id 
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" 
                      : "border-border"
                  }`}
                  onClick={() => selectCommunity(community)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          <Users className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-foreground truncate">{community.name}</h3>
                          {getUnreadCount(community._id) > 0 && (
                            <Badge variant="destructive" className="text-xs ml-2">
                              {getUnreadCount(community._id)} new
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{community.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {community.stats.memberCount} members
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {community.stats.messageCount} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No communities found</p>
                <p className="text-sm">Join a community to start messaging</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${isMobile && showSidebar ? 'hidden' : ''}`}>
        {selectedCommunity ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center gap-3">
                <Avatar className={`h-10 w-10 ${isMobile ? 'ml-12' : ''}`}>
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <Users className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">{selectedCommunity.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCommunity.stats.memberCount} members
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className={`flex-1 ${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="space-y-4">
                {messages.length > 0 ? (
                  <>
                    {messages.map((message) => {
                      // Improved isOwn check with better error handling
                      const isOwn = currentUser && message.sender && 
                        message.sender._id === currentUser._id;
                      
                      console.log('Message alignment check:', {
                        messageId: message._id,
                        senderId: message.sender?._id,
                        currentUserId: currentUser?._id,
                        isOwn: isOwn,
                        senderName: message.sender?.name || message.sender?.firstName
                      });

                      const senderName = message.sender.userType === 'donor' 
                        ? `${message.sender.firstName} ${message.sender.lastName}`
                        : message.sender.name || 'Unknown';
  
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isMobile ? 'mb-3' : 'mb-4'} w-full ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 ${
                            isMobile ? 'max-w-[85%]' : 'max-w-[70%]'
                          } ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                            {!isOwn && (
                              <Avatar className={`${isMobile ? 'h-7 w-7' : 'h-8 w-8'} mt-1 flex-shrink-0`}>
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                  {senderName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                              {!isOwn && (
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    {senderName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.createdAt).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                              )}
                              
                              <div
                                className={`${
                                  isMobile ? 'px-3 py-2' : 'px-4 py-3'
                                } relative group shadow-sm break-words w-fit ${
                                  isOwn
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-2xl rounded-bl-2xl rounded-br-md'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-md'
                                }`}
                              >
                                <p className={`${isMobile ? 'text-sm' : 'text-sm'} leading-relaxed`}>{message.content}</p>
                              </div>

                              {isOwn && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.createdAt).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className={`p-4 border-t bg-card ${isMobile ? 'pb-safe-area-inset-bottom' : ''}`}>
              <div className="flex gap-2 items-end">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className={`flex-1 bg-background border-border resize-none ${
                    isMobile ? 'min-h-[44px] max-h-[120px]' : 'min-h-[40px] max-h-[100px]'
                  }`}
                  rows={1}
                  disabled={isSending}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isSending || !newMessage.trim()}
                  size={isMobile ? "default" : "sm"}
                  className={`bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white ${
                    isMobile ? 'px-4 py-3 min-h-[44px]' : 'px-3'
                  }`}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* No Community Selected */
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center text-muted-foreground px-4">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Select a Community</h2>
              <p className="text-sm md:text-base">
                {isMobile 
                  ? "Tap the menu button to browse communities" 
                  : "Choose a community from the sidebar to start messaging"
                }
              </p>
              {isMobile && (
                <Button
                  variant="outline"
                  onClick={() => setShowSidebar(true)}
                  className="mt-4"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Browse Communities
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
