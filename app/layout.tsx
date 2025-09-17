import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { PageTransition } from "@/components/ui/page-transition"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Light Charity Foundation",
  description: "Be a Light. Donate, \nSave Lives.",
  icons: {
    icon: [
      { url: '/images/light-charity-logo-new.png' },
      { url: '/images/light-charity-logo-new.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/light-charity-logo-new.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/images/light-charity-logo-new.png',
    apple: '/images/light-charity-logo-new.png',
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f97316" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1a1a1a" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AuthProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}