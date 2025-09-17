"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function SignupForm() {
  const [donorData, setDonorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    postalCode: "",
    donorNumber: "",
    password: "",
    confirmPassword: "",
  })

  const [hospitalData, setHospitalData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    password: "",
    confirmPassword: "",
  })

  const { signup, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const googleButtonRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("donor")

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!donorData.firstName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive",
      })
      return
    }

    if (!donorData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "Last name is required",
        variant: "destructive",
      })
      return
    }

    if (!donorData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    if (!donorData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      })
      return
    }

    if (!donorData.dateOfBirth) {
      toast({
        title: "Validation Error",
        description: "Date of birth is required",
        variant: "destructive",
      })
      return
    }

    if (!donorData.postalCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Postal code is required",
        variant: "destructive",
      })
      return
    }

    // Validate password
    const passwordError = validatePassword(donorData.password)
    if (passwordError) {
      toast({
        title: "Password Error",
        description: passwordError,
        variant: "destructive",
      })
      return
    }

    if (donorData.password !== donorData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      await signup({
        userType: "donor",
        firstName: donorData.firstName,
        lastName: donorData.lastName,
        email: donorData.email,
        phone: donorData.phone,
        dateOfBirth: donorData.dateOfBirth,
        postalCode: donorData.postalCode,
        donorNumber: donorData.donorNumber || undefined,
        password: donorData.password,
      })
    } catch (error) {
      console.error("Donor signup failed:", error)
    }
  }

  const handleHospitalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!hospitalData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Hospital/Blood Bank name is required",
        variant: "destructive",
      })
      return
    }

    if (!hospitalData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    if (!hospitalData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      })
      return
    }

    if (!hospitalData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Address is required",
        variant: "destructive",
      })
      return
    }

    if (!hospitalData.postalCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Postal code is required",
        variant: "destructive",
      })
      return
    }

    // Validate password
    const passwordError = validatePassword(hospitalData.password)
    if (passwordError) {
      toast({
        title: "Password Error",
        description: passwordError,
        variant: "destructive",
      })
      return
    }

    if (hospitalData.password !== hospitalData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      await signup({
        userType: "hospital",
        name: hospitalData.name,
        email: hospitalData.email,
        phone: hospitalData.phone,
        address: hospitalData.address,
        postalCode: hospitalData.postalCode,
        password: hospitalData.password,
      })
    } catch (error) {
      console.error("Hospital signup failed:", error)
    }
  }

  // Load Google Identity Services script and render button
  useEffect(() => {
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
        // Disable any existing auto-select behavior
        if (window.google.accounts.id.disableAutoSelect) {
          window.google.accounts.id.disableAutoSelect();
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signup_with',
          shape: 'rectangular',
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
        userType: activeTab as 'donor' | 'hospital',
      });

      if (data.success) {
        // Don't show toast here - let the page redirect handle the user experience
        // The auth context will handle setting the user state when we navigate
        
        // Redirect based on user status - don't use router.push, use window.location
        // This ensures a full page reload and proper auth state initialization
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
        title: "Registration failed",
        description: error.message || "Google authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-soft">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">Sign up to start donating or managing blood donations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="donor">Donor</TabsTrigger>
            <TabsTrigger value="hospital">Hospital/Blood Bank</TabsTrigger>
          </TabsList>
          
          {/* Google Sign-In Button - appears before form content */}
          <div className="mb-6">
            {/* Google Sign-In Button Container */}
            <div 
              ref={googleButtonRef} 
              className="w-full mb-2 [&>div]:w-full [&>div>div]:w-full [&>div>div>iframe]:w-full [&>div>div>iframe]:min-h-[40px] [&>div>div>iframe]:border [&>div>div>iframe]:border-input [&>div>div>iframe]:rounded-md [&>div>div>iframe]:bg-background"
            ></div>
            <p className="text-xs text-center text-muted-foreground">
              Sign up with Google as {activeTab === 'donor' ? 'Donor' : 'Hospital/Blood Bank'}
            </p>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
          </div>
          <TabsContent value="donor">
            <form onSubmit={handleDonorSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    required 
                    disabled={isLoading}
                    value={donorData.firstName}
                    onChange={(e) => setDonorData({...donorData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    required 
                    disabled={isLoading}
                    value={donorData.lastName}
                    onChange={(e) => setDonorData({...donorData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  disabled={isLoading}
                  value={donorData.email}
                  onChange={(e) => setDonorData({...donorData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  disabled={isLoading}
                  value={donorData.phone}
                  onChange={(e) => setDonorData({...donorData, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date" 
                    required 
                    disabled={isLoading}
                    value={donorData.dateOfBirth}
                    onChange={(e) => setDonorData({...donorData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode" 
                    required 
                    disabled={isLoading}
                    value={donorData.postalCode}
                    onChange={(e) => setDonorData({...donorData, postalCode: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="donorNumber">Donor Number (if any)</Label>
                <Input 
                  id="donorNumber" 
                  disabled={isLoading}
                  value={donorData.donorNumber}
                  onChange={(e) => setDonorData({...donorData, donorNumber: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput 
                  id="password" 
                  required 
                  disabled={isLoading}
                  value={donorData.password}
                  onChange={(e) => setDonorData({...donorData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput 
                  id="confirmPassword" 
                  required 
                  disabled={isLoading}
                  value={donorData.confirmPassword}
                  onChange={(e) => setDonorData({...donorData, confirmPassword: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register as Donor"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="hospital">
            <form onSubmit={handleHospitalSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Hospital/Blood Bank Name</Label>
                <Input 
                  id="name" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.name}
                  onChange={(e) => setHospitalData({...hospitalData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalEmail">Email</Label>
                <Input 
                  id="hospitalEmail" 
                  type="email" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.email}
                  onChange={(e) => setHospitalData({...hospitalData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalPhone">Phone Number</Label>
                <Input 
                  id="hospitalPhone" 
                  type="tel" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.phone}
                  onChange={(e) => setHospitalData({...hospitalData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.address}
                  onChange={(e) => setHospitalData({...hospitalData, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalPostalCode">Postal Code</Label>
                <Input 
                  id="hospitalPostalCode" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.postalCode}
                  onChange={(e) => setHospitalData({...hospitalData, postalCode: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalPassword">Password</Label>
                <PasswordInput 
                  id="hospitalPassword" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.password}
                  onChange={(e) => setHospitalData({...hospitalData, password: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospitalConfirmPassword">Confirm Password</Label>
                <PasswordInput 
                  id="hospitalConfirmPassword" 
                  required 
                  disabled={isLoading}
                  value={hospitalData.confirmPassword}
                  onChange={(e) => setHospitalData({...hospitalData, confirmPassword: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register as Hospital/Blood Bank"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
