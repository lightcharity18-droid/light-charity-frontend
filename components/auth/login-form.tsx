"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { TwoFactorModal } from "./two-factor-modal"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const googleButtonRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login({
        email,
        password,
        rememberMe,
      })
    } catch (error) {
      // Error handling is done in the auth context
      console.error("Login failed:", error)
    }
  }

  // Load Google Identity Services script and render button
  useEffect(() => {
    // Add custom CSS to override Google button styling
    const style = document.createElement('style');
    style.textContent = `
      .google-signin-button iframe {
        background: transparent !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
      .google-signin-button > div {
        background: transparent !important;
        border: none !important;
      }
    `;
    document.head.appendChild(style);

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
          shape: 'rectangular',
          width: 400,
        });
      } catch (error) {
        console.error('Error rendering Google button:', error);
      }
    };

    // Delay the script loading to ensure component is fully mounted
    const timer = setTimeout(loadGoogleScript, 100);
    
    return () => clearTimeout(timer);
  }, []);


  const handleGoogleCallback = async (response: any) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Use auth service for Google authentication
      const { authService } = await import('@/lib/auth');
      
      const data = await authService.googleAuth({
        googleToken: response.credential,
        userType: 'donor', // Default to donor, could be made configurable
      });

      if (data.success) {
        // Redirect based on user status - use window.location for full page reload
        // This ensures proper auth state initialization
        if (data.data?.isNewUser || data.data?.requiresCompletion) {
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
      toast({
        title: "Login failed",
        description: error.message || "Google authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTwoFactorComplete = () => {
    setShowTwoFactor(false)
    toast({
      title: "Two-factor authentication successful",
      description: "Redirecting to dashboard...",
    })

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <>
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            {/* Google Sign-In Button Container */}
            <div 
              ref={googleButtonRef} 
              className="google-signin-button w-full flex justify-center [&>div]:w-full [&>div>div]:w-full [&>div>div]:flex [&>div>div]:justify-center [&>div>div>iframe]:!w-full [&>div>div>iframe]:!max-w-none [&>div>div>iframe]:!h-10 [&>div>div>iframe]:!min-h-[40px] [&>div>div>iframe]:!box-border"
            ></div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>

      <TwoFactorModal
        isOpen={showTwoFactor}
        onClose={() => setShowTwoFactor(false)}
        onComplete={handleTwoFactorComplete}
        email={email}
      />
    </>
  )
}
