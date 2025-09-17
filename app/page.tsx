"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, Droplet, FileText, Heart, Users, Shield, Award, MapPin, Phone, Mail, TrendingUp, CheckCircle, Star, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, floating } from "@/lib/animations"
import { AnimatedCard, FeatureCard, AnimatedButton } from "@/components/ui/animated-card"
import { EnhancedLoading, SkeletonLoader } from "@/components/ui/enhanced-loading"

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

interface BlogPost {
  _id: string
  title: string
  content: string
  author: string
  imageUrl: string
  tags: string[]
  category: 'news' | 'blog' | 'event' | 'story'
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

const categoryDisplayNames: Record<string, string> = {
  "news": "News", 
  "blog": "Health",
  "event": "Events",
  "story": "Stories"
}

const categoryColors: Record<string, string> = {
  "news": "bg-blue-500 hover:bg-blue-600",
  "blog": "bg-orange-500 hover:bg-orange-600", 
  "event": "bg-red-500 hover:bg-red-600",
  "story": "bg-green-500 hover:bg-green-600"
}

export default function Home() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated, login } = useAuth()
  const googleButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLatestBlogs()
  }, [])

  // Load Google Identity Services script and render button
  useEffect(() => {
    // Only load Google script if user is not authenticated
    if (isAuthenticated) return

    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Add a small delay to ensure the button container is ready
        setTimeout(initializeGoogleSignIn, 100);
      };
      
      // Check if script already exists
      const existingScript = document.getElementById('google-identity-script');
      if (existingScript) {
        // If script exists but Google isn't loaded yet, wait for it
        if (typeof window.google === 'undefined') {
          existingScript.onload = () => setTimeout(initializeGoogleSignIn, 100);
        } else {
          // Google is already loaded, initialize immediately
          setTimeout(initializeGoogleSignIn, 100);
        }
        return;
      }
      
      script.id = 'google-identity-script';
      document.head.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        console.error('Google Client ID not configured');
        return;
      }

      if (typeof window.google === 'undefined') {
        console.error('Google Identity Services not loaded');
        return;
      }

      if (!googleButtonRef.current) {
        console.error('Google button container not found');
        return;
      }

      // Clear any existing button content
      googleButtonRef.current.innerHTML = '';

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: '100%',
          shape: 'rectangular',
        });
        
        console.log('Google Sign-In button rendered successfully on home page');
      } catch (error) {
        console.error('Error rendering Google button:', error);
      }
    };

    // Delay the script loading to ensure component is fully mounted
    const timer = setTimeout(loadGoogleScript, 100);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated])

  const fetchLatestBlogs = async () => {
    try {
      setLoadingBlogs(true)
      const response = await fetch(`${API_BASE_URL}/api/blogs?status=published`)
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(data.slice(0, 3)) // Get latest 3 posts
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setBlogPosts([])
    } finally {
      setLoadingBlogs(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getExcerpt = (content: string, maxLength = 120) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '')
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText
  }

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return ''
    if (user.name) return user.name
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`
    if (user.firstName) return user.firstName
    return 'User'
  }

  // Handle form submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    try {
      setIsLoading(true)
      await login({ email, password })
      // Reset form
      setEmail('')
      setPassword('')
    } catch (error) {
      // Error handling is done in the login function via toast
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Sign-In callback
  const handleGoogleCallback = async (response: any) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Use auth service for Google authentication
      const { authService } = await import('@/lib/auth');
      
      const data = await authService.googleAuth({
        googleToken: response.credential,
        userType: 'donor', // Default to donor for home page
      });

      if (data.success) {
        // Redirect based on user status - use window.location for full page reload
        // This ensures proper auth state initialization
        if (data.isNewUser || data.requiresCompletion) {
          // New Google users or users with incomplete profiles need to complete their info
          window.location.href = '/profile?complete=true&source=google';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        throw new Error(data.message || 'Google authentication failed');
      }
    } catch (error: any) {
      console.error('Google callback error:', error);
      // You could add a toast notification here if needed
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 dark:from-orange-950/20 dark:via-red-950/20 dark:to-orange-950/20 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 dark:from-orange-400/5 dark:to-red-400/5"></div>
          
          {/* Floating background elements */}
          <motion.div
            variants={floating}
            animate="animate"
            className="absolute top-20 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 6 }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-red-500/10 rounded-full blur-xl"
          />
          
          <div className="container relative grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div className="space-y-4" variants={fadeInUp}>
                <motion.div variants={fadeInUp}>
                <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800">
                  <Heart className="h-3 w-3 mr-1" />
                  Saving Lives Together
                </Badge>
                </motion.div>
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
                  variants={fadeInUp}
                >
                  Be a Light. <br />
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent leading-[1.3] inline-block">
                    Donate, <br /> Save Lives.
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-lg text-muted-foreground max-w-md leading-relaxed"
                  variants={fadeInUp}
                >
                  Join our community of heroes and help save lives. Every donation counts and can help up to three
                  people in need. Your contribution makes a real difference.
                </motion.p>
              </motion.div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <div className="flex flex-col gap-3">
                  <AnimatedButton
                    size="default"
                    variant="default"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
                    onClick={() => window.location.href = '/donate'}
                  >
                      <Heart className="h-4 w-4 mr-2" />
                      Become a Blood Donor
                  </AnimatedButton>
                  <AnimatedButton
                    size="default"
                    variant="default"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
                    onClick={() => window.location.href = '/organ-donation'}
                  >
                      <Heart className="h-4 w-4 mr-2" />
                      Become an Organ Donor
                  </AnimatedButton>
                  <AnimatedButton
                    size="default"
                    variant="default"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
                    onClick={() => window.location.href = '/fundraising'}
                  >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Start Fundraising
                  </AnimatedButton>
                </div>
                <AnimatedButton
                  size="default"
                  variant="default"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl"
                  onClick={() => window.location.href = '/about'}
                >
                  Learn More
                </AnimatedButton>
              </motion.div>

            </motion.div>

            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              {/* Conditional rendering based on authentication state */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                <Card className="w-full max-w-md shadow-2xl border-0 bg-background/80 dark:bg-background/80 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-8 px-8">
                      <motion.div 
                        className="mb-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.div 
                          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                        <Heart className="h-8 w-8 text-white" />
                        </motion.div>
                      <h2 className="text-2xl font-bold mb-2 text-foreground">Welcome back, {getUserDisplayName()}!</h2>
                      <p className="text-sm text-muted-foreground">Thank you for being a part of our community</p>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <AnimatedButton
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          onClick={() => window.location.href = '/dashboard'}
                      >
                          <Heart className="h-5 w-5 mr-2" />
                          Go to Dashboard
                        </AnimatedButton>
                      
                      </motion.div>

                  </CardContent>
                </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                <Card className="w-full max-w-md shadow-2xl border-0 bg-background/80 dark:bg-background/80 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-8 px-8">
                      <motion.div 
                        className="mb-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.div 
                          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                        <Heart className="h-8 w-8 text-white" />
                        </motion.div>
                      <h2 className="text-2xl font-bold mb-2 text-foreground">Join Our Community</h2>
                      <p className="text-sm text-muted-foreground">Sign up to start saving lives and track your impact</p>
                      </motion.div>
                      <motion.form 
                        className="space-y-6" 
                        onSubmit={handleSignIn}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 border-border focus:border-orange-500 focus:ring-orange-500"
                          required
                        />
                        </motion.div>
                        <motion.div 
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.4, delay: 0.6 }}
                        >
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <PasswordInput
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-border focus:border-orange-500 focus:ring-orange-500"
                          required
                        />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.4, delay: 0.7 }}
                        >
                      <Button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                      >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Button>
                        </motion.div>
                        <motion.div 
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                        >
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                        >
                      {/* Google Sign-In Button Container */}
                      <div 
                        ref={googleButtonRef} 
                        className="w-full [&>div]:w-full [&>div>div]:w-full [&>div>div>iframe]:w-full [&>div>div>iframe]:min-h-[40px] [&>div>div>iframe]:border [&>div>div>iframe]:border-input [&>div>div>iframe]:rounded-md [&>div>div>iframe]:bg-background"
                      ></div>
                        </motion.div>
                        <motion.div 
                          className="text-center text-sm"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.4, delay: 1.0 }}
                        >
                        Don&apos;t have an account?{" "}
                        <Link
                          href="/signup"
                          className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline font-medium"
                        >
                          Sign up
                        </Link>
                        </motion.div>
                      </motion.form>
                  </CardContent>
                </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
              <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800 mb-4">
                Why Choose Us
              </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Why Donate Blood?
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Your blood donation is a gift of life that creates a ripple effect of hope and healing in our community.
              </motion.p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {[
                {
                  icon: Heart,
                  title: "Save Lives",
                  description: "One donation can save up to three lives. Your contribution directly impacts families and communities in need."
                },
                {
                  icon: Shield,
                  title: "Health Benefits", 
                  description: "Regular blood donation can help reduce the risk of heart disease and cancer while providing free health screenings."
                },
                {
                  icon: Users,
                  title: "Community Impact",
                  description: "Join a community of heroes making a difference in people's lives every day. Together, we save lives."
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: i * 0.2,
                      duration: 0.5,
                      ease: [0.42, 0, 0.58, 1] // Same cubic-bezier as Split-Mate
                    }
                  }}
                  viewport={{ once: true, amount: 0.5 }}
                >
                  {/* Icon with connecting arrow */}
                  <div className="relative flex items-center justify-center mb-6">
                    <motion.div
                      className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl overflow-hidden p-6 w-full"
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <motion.div
                        className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 5 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                    </motion.div>
                    
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* New Sections Highlight */}
        <section className="py-20 bg-gradient-to-br from-muted/50 to-orange-50/50 dark:from-muted/20 dark:to-orange-950/20">
          <div className="container">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
              <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800 mb-4">
                Explore Our Resources
              </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Discover How You Can Help
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                From donating blood to volunteering your time, there are many ways to get involved and make a meaningful
                impact.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Blog & News",
                  badge: "New",
                  badgeColor: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
                  gradient: "from-orange-400 to-red-500",
                  description: "Stay informed with the latest articles, inspiring stories, and important updates from our community.",
                  iconInfo: { icon: CalendarDays, text: "Updated weekly" },
                  buttonText: "Read Latest Articles",
                  buttonGradient: "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
                  link: "/blog"
                },
                {
                  icon: Droplet,
                  title: "Blood Compatibility",
                  badge: "Interactive",
                  badgeColor: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
                  gradient: "from-red-400 to-orange-500",
                  description: "Explore our interactive chart to understand blood type compatibility for donations and transfusions.",
                  iconInfo: { icon: Heart, text: "Find your match" },
                  buttonText: "View Compatibility Chart",
                  buttonGradient: "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
                  link: "/blood-compatibility"
                },
                {
                  icon: Users,
                  title: "Volunteer With Us",
                  badge: "Join Us",
                  badgeColor: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
                  gradient: "from-orange-400 to-red-500",
                  description: "Discover ways to contribute beyond donation. Find volunteer opportunities that match your skills and passion.",
                  iconInfo: { icon: Clock, text: "Flexible schedules" },
                  buttonText: "Explore Opportunities",
                  buttonGradient: "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
                  link: "/volunteer"
                }
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: i * 0.2,
                      duration: 0.5,
                      ease: [0.42, 0, 0.58, 1] // Same cubic-bezier as Split-Mate
                    }
                  }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className={`h-48 bg-gradient-to-br ${card.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <motion.div
                      className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300 relative z-10"
                      whileHover={{ rotate: 5 }}
                    >
                      <card.icon className="h-16 w-16" />
                    </motion.div>
                </div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                      <Badge className={card.badgeColor}>
                        {card.badge}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                      {card.description}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                      <card.iconInfo.icon className="h-4 w-4 mr-2" />
                      <span>{card.iconInfo.text}</span>
                  </div>
                    <AnimatedButton
                      className={`w-full bg-gradient-to-r ${card.buttonGradient} text-white`}
                      onClick={() => window.location.href = card.link}
                    >
                      {card.buttonText}
                    </AnimatedButton>
                </CardContent>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Blog Posts Preview */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="flex justify-between items-center mb-12">
              <div>
                <Badge className="bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/70 border-orange-200 dark:border-orange-800 mb-4">
                  Latest Updates
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">From Our Blog</h2>
              </div>
              <Button
                variant="outline"
                className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/50"
                asChild
              >
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>

            {loadingBlogs ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <CardContent className="p-6">
                        <SkeletonLoader lines={3} />
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </div>
            ) : blogPosts.length > 0 ? (
              <motion.div 
                className="grid md:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
              >
                {blogPosts.map((post, index) => (
                  <AnimatedCard
                    key={post._id}
                    delay={index * 0.1}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                  >
                    <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 dark:from-orange-900/50 dark:to-red-900/50 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <Badge className={`${categoryColors[post.category] || 'bg-gray-500 hover:bg-gray-600'} text-white`}>
                          {categoryDisplayNames[post.category] || post.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">{formatDate(post.createdAt)}</p>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors text-foreground">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {getExcerpt(post.content)}
                      </p>
                      <AnimatedButton
                        variant="ghost"
                        className="p-0 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                        onClick={() => window.location.href = `/blog/${post._id}`}
                      >
                        Read More →
                      </AnimatedButton>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">No Blog Posts Yet</h3>
                <p className="text-muted-foreground">Check back soon for the latest updates and stories!</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-white relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
          
          {/* Floating background elements */}
          <motion.div
            variants={floating}
            animate="animate"
            className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 8 }}
            className="absolute bottom-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"
          />
          
          <div className="container relative text-center">
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/20 mb-6">
                <Award className="h-3 w-3 mr-1" />
                Join Our Mission
              </Badge>
              </motion.div>
              
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to Save Lives?
              </motion.h2>
              
              <motion.p 
                className="text-xl mb-8 text-orange-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Every donation makes a difference. Join thousands of donors who are already making an impact in their
                communities.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatedButton
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg"
                  onClick={() => window.location.href = '/donate'}
                >
                    <Heart className="h-5 w-5 mr-2" />
                    Donate Now
                </AnimatedButton>
                <AnimatedButton
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50"
                  onClick={() => window.location.href = '/volunteer'}
                >
                  Volunteer With Us
                </AnimatedButton>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative w-full bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black overflow-hidden py-16">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-black/20 dark:to-transparent"></div>
        
        {/* Floating background elements */}
        <motion.div
          variants={floating}
          animate="animate"
          className="absolute top-20 right-20 w-32 h-32 bg-orange-500/5 rounded-full blur-xl"
        />
        <motion.div
          variants={floating}
          animate="animate"
          transition={{ delay: 1, duration: 10 }}
          className="absolute bottom-20 left-20 w-24 h-24 bg-red-500/5 rounded-full blur-xl"
        />

        <div className="container relative z-10">
          {/* Main footer content */}
          <motion.div 
            className="grid md:grid-cols-4 gap-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {/* Brand section */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image 
                    src="/images/light-charity-logo-new.png" 
                    alt="Light Charity Foundation Logo" 
                    width={48} 
                    height={48}
                    className="rounded-xl"
                  />
                </motion.div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Light Charity Foundation</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Be a Light. Donate, <br /> Save Lives. Together, we're building a healthier, more caring community.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-orange-500 rounded-sm"></div>
                <h3 className="text-sm font-medium tracking-wider text-gray-900 dark:text-white uppercase">Quick Links</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Donation Process", href: "/donation-process" },
                  { name: "Find Centers", href: "/locations" },
                  { name: "FAQs", href: "/faqs" },
                  { name: "Blood Compatibility", href: "/blood-compatibility" }
                ].map((link, index) => (
                  <li key={link.name}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-400 dark:hover:text-orange-400 transition-colors text-sm group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                  </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Get Involved */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-red-500 rounded-sm"></div>
                <h3 className="text-sm font-medium tracking-wider text-gray-900 dark:text-white uppercase">Get Involved</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { name: "Donate Blood", href: "/donate" },
                  { name: "Organ Donation", href: "/organ-donation" },
                  { name: "Volunteer", href: "/volunteer" },
                  { name: "Fundraising", href: "/fundraising" },
                  { name: "Blog & News", href: "/blog" }
                ].map((link, index) => (
                  <li key={link.name}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    >
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-orange-400 dark:hover:text-orange-400 transition-colors text-sm group flex items-center"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {link.name}
                      </span>
                  </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-4 bg-orange-500 rounded-sm"></div>
                <h3 className="text-sm font-medium tracking-wider text-gray-900 dark:text-white uppercase">Stay Connected</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Newsletter</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your email"
                      className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-orange-500 text-sm"
                  />
                    <AnimatedButton 
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm px-4"
                    >
                    Subscribe
                    </AnimatedButton>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>

          {/* Footer bottom */}
          <motion.div 
            className="border-t border-gray-300 dark:border-gray-800 pt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Light Charity Foundation. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </motion.div>
        </div>
      </footer>

      <ChatbotWidget />
    </div>
  )
}
