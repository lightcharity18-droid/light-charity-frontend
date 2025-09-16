import type React from "react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, Home, LogOut, Mail, MapPin, Menu, Settings, Users, Droplet, PenTool, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DonorBadge } from "@/components/badges/donor-badge"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SidebarUser } from "@/components/dashboard/sidebar-user"
import { MessageProvider } from "@/contexts/message-context"
import { DashboardNavigation } from "@/components/dashboard/dashboard-navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <MessageProvider>
        <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b shadow-sm py-2 md:py-4 bg-card w-full">
          <div className="flex justify-between items-center h-full w-full px-4 md:px-6">
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden h-8 w-8">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-card">
                  <div className="flex flex-col h-full">
                    <div className="py-4">
                      <Logo />
                    </div>
                    <DashboardNavigation isMobile={true} />
                  </div>
                </SheetContent>
              </Sheet>
              <Logo />
            </div>
            <DashboardHeader />
          </div>
        </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex w-64 flex-col border-r bg-card">
          <DashboardNavigation />
          <SidebarUser />
        </aside>

        <main className="flex-1 py-6 px-4 md:px-6">{children}</main>
      </div>

        <ChatbotWidget />
      </div>
      </MessageProvider>
    </ProtectedRoute>
  )
}
