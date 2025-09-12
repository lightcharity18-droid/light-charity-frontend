"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  MessageCircle, 
  Calendar,
  Heart,
  Stethoscope,
  UserCheck,
  Globe,
  Lock,
  Clock
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { CreateCommunityDialog } from "@/components/community/create-community-dialog"
import { authService } from "@/lib/auth"
import { PlacesAutocomplete } from "@/components/ui/places-autocomplete"

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

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [myCommunities, setMyCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("discover")
  
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchCommunities()
    fetchMyCommunities()
  }, [currentPage, searchQuery, selectedCategory, selectedType, selectedCity, selectedCountry])

  const fetchCommunities = async () => {
    try {
      const token = authService.getToken()
      if (!token || !authService.isAuthenticated()) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to view communities",
          variant: "destructive"
        })
        return
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedType !== 'all' && { type: selectedType }),
        ...(selectedCity && { city: selectedCity }),
        ...(selectedCountry && { country: selectedCountry })
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCommunities(data.data.communities)
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMyCommunities = async () => {
    try {
      const token = authService.getToken()
      if (!token || !authService.isAuthenticated()) {
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/communities/my-communities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMyCommunities(data.data.communities)
      }
    } catch (error) {
      console.error('Error fetching my communities:', error)
    }
  }

  const joinCommunity = async (communityId: string) => {
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
        fetchCommunities()
        fetchMyCommunities()
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

  const isUserMember = (community: Community) => {
    return community.members.some(member => member.user._id === user?.id)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(dateString)
  }

  const CommunityCard = ({ community, showJoinButton = false }: { community: Community; showJoinButton?: boolean }) => {
    const CategoryIcon = categoryIcons[community.category as keyof typeof categoryIcons]
    const isMember = isUserMember(community)
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2 flex items-center gap-2">
                <Link 
                  href={`/dashboard/communities/${community._id}`}
                  className="hover:text-primary transition-colors"
                >
                  {community.name}
                </Link>
                {community.type === 'private' ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {community.description}
              </p>
              {(community.city || community.country) && (
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
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
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${categoryColors[community.category as keyof typeof categoryColors]} flex items-center gap-1`}>
                  <CategoryIcon className="h-3 w-3" />
                  {categoryLabels[community.category as keyof typeof categoryLabels]}
                </Badge>
                {community.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{community.stats.memberCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{community.stats.messageCount}</span>
              </div>
            </div>
            <span className="text-xs">
              Active {formatTimeAgo(community.stats.lastActivityAt)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {community.createdBy.userType === 'donor' 
                    ? `${community.createdBy.firstName?.[0]}${community.createdBy.lastName?.[0]}`
                    : community.createdBy.name?.[0]
                  }
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                by {community.createdBy.userType === 'donor' 
                  ? `${community.createdBy.firstName} ${community.createdBy.lastName}`
                  : community.createdBy.name
                }
              </span>
            </div>
            
            {showJoinButton && !isMember && (
              <Button 
                size="sm" 
                onClick={() => joinCommunity(community._id)}
                className="ml-2"
              >
                Join
              </Button>
            )}
            {isMember && (
              <Badge variant="secondary" className="ml-2">
                Member
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Communities</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-1" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Communities</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Community
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-communities">My Communities</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Filters */}
          <div className="space-y-4">
            {/* Search and Basic Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="blood_donation">Blood Donation</SelectItem>
                  <SelectItem value="health_awareness">Health Awareness</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Location Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlacesAutocomplete
                label="Filter by City"
                placeholder="Enter city to filter..."
                value={selectedCity}
                onChange={setSelectedCity}
                type="city"
              />
              <PlacesAutocomplete
                label="Filter by Country"
                placeholder="Enter country to filter..."
                value={selectedCountry}
                onChange={setSelectedCountry}
                type="country"
              />
            </div>
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard 
                key={community._id} 
                community={community} 
                showJoinButton={true}
              />
            ))}
          </div>

          {communities.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No communities found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || selectedCity || selectedCountry
                  ? "Try adjusting your search filters"
                  : "Be the first to create a community!"
                }
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Community
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-communities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCommunities.map((community) => (
              <CommunityCard key={community._id} community={community} />
            ))}
          </div>

          {myCommunities.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">You haven't joined any communities yet</h3>
              <p className="text-muted-foreground mb-4">
                Discover and join communities to connect with like-minded people
              </p>
              <Button onClick={() => setActiveTab("discover")}>
                Discover Communities
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateCommunityDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          fetchCommunities()
          fetchMyCommunities()
        }}
      />
    </div>
  )
}
