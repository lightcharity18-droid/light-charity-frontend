"use client"

import { Bell, Calendar, Home, LogOut, Mail, MapPin, Menu, Settings, Users, Droplet, PenTool, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"

interface DashboardNavigationProps {
  isMobile?: boolean
}

export function DashboardNavigation({ isMobile = false }: DashboardNavigationProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  
  const navigationItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
      show: true
    },
    {
      href: "/dashboard/donors",
      icon: Users,
      label: "Donors",
      show: user?.userType === 'hospital'
    },
    {
      href: "/donate",
      icon: Droplet,
      label: "Donate Blood",
      show: true
    },
    {
      href: "/dashboard/donations",
      icon: Calendar,
      label: "Donations",
      show: user?.userType === 'hospital'
    },
    {
      href: "/locations",
      icon: MapPin,
      label: "Locations",
      show: true
    },
    {
      href: "/dashboard/communities",
      icon: MessageCircle,
      label: "Communities",
      show: true
    },
    {
      href: "/dashboard/messages",
      icon: Mail,
      label: "Messages",
      show: true
    },
    {
      href: "/dashboard/blog/create",
      icon: PenTool,
      label: "Create Blog",
      show: true
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      show: true
    }
  ]

  const filteredItems = navigationItems.filter(item => item.show)

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href
    return `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
      isActive 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-muted text-muted-foreground hover:text-foreground"
    }`
  }

  if (isMobile) {
    return (
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={getLinkClassName(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  return (
    <nav className="flex-1 py-4">
      <ul className="space-y-1 px-2">
        {filteredItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={getLinkClassName(item.href)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
