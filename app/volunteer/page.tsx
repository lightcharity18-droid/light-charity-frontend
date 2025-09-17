"use client"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import Image from "next/image"
import { CalendarIcon, Clock, MapPin, Users, Heart, Award, TrendingUp, HandHeart, UserCheck, Globe, Mail, Plus } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { VolunteerApplicationForm } from "@/components/volunteer/volunteer-application-form"
import { Toaster } from "@/components/ui/toaster"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainer, floating, cardHover, iconRotate } from "@/lib/animations"
import { AnimatedCard, FeatureCard, AnimatedButton } from "@/components/ui/animated-card"

// Empty placeholder data for volunteer roles and events
const volunteerOpportunities = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  title: "",
  description: "",
  location: "",
  commitment: "",
  skills: [],
  category: "",
}))

const volunteerEvents = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  title: "",
  date: "",
  time: "",
  location: "",
    volunteers: 0,
    volunteersNeeded: 0,
  category: "",
}))

export default function VolunteerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 to-orange-100/20 dark:from-red-900/10 dark:to-orange-900/10"></div>
          
          {/* Floating background elements */}
          <motion.div
            variants={floating}
            animate="animate"
            className="absolute top-20 right-20 w-32 h-32 bg-red-500/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 10 }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-orange-500/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 2, duration: 12 }}
            className="absolute top-40 left-40 w-16 h-16 bg-red-400/10 rounded-full blur-lg"
          />

          <div className="container relative">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <HandHeart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Join Our Mission</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 text-foreground"
                variants={fadeInUp}
              >
                Volunteer With Us
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
                variants={fadeInUp}
              >
                Not everyone can donate, but everyone can help save lives. Join our team of dedicated volunteers
                and make a difference in your community.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={fadeInUp}
              >
                <AnimatedButton
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
                  onClick={() => document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <HandHeart className="h-5 w-5 mr-2" />
                  Explore Opportunities
                </AnimatedButton>
                <AnimatedButton
                  size="lg"
                  variant="outline"
                  className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/50"
                  onClick={() => document.getElementById('application')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                </AnimatedButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              {[
                { icon: Users, label: "Active Volunteers", value: "500+", color: "text-blue-500" },
                { icon: Clock, label: "Volunteer Hours This Month", value: "1,200", color: "text-green-500" },
                { icon: Heart, label: "Lives Impacted", value: "10,000+", color: "text-red-500" },
                { icon: Globe, label: "Community Events", value: "25", color: "text-orange-500" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                      </motion.div>
                      <motion.div 
                        className="text-2xl font-bold text-foreground mb-1"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5, type: "spring" }}
                      >
                        {stat.value}
                      </motion.div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why Volunteer */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Why Volunteer With Us?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Make a Meaningful Impact",
                  description: "Your time and skills directly contribute to saving lives in your community. Each volunteer hour helps us collect more blood donations.",
                  bgColor: "bg-red-100 dark:bg-red-900/30",
                  iconColor: "text-primary"
                },
                {
                  icon: Award,
                  title: "Gain Valuable Experience",
                  description: "Develop new skills, build your resume, and gain experience in healthcare, event planning, customer service, and more.",
                  bgColor: "bg-blue-100 dark:bg-blue-900/30",
                  iconColor: "text-blue-600"
                },
                {
                  icon: Users,
                  title: "Join a Community",
                  description: "Connect with like-minded individuals who share your passion for helping others and making a difference in your community.",
                  bgColor: "bg-green-100 dark:bg-green-900/30",
                  iconColor: "text-green-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                <CardContent className="pt-6">
                      <motion.div 
                        className={`rounded-full ${item.bgColor} p-3 w-12 h-12 flex items-center justify-center mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">
                        {item.description}
                  </p>
                </CardContent>
              </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Opportunities */}
        <section id="opportunities" className="py-16 bg-background">
          <div className="container">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Available Opportunities
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
            <Tabs defaultValue="roles" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-muted">
                  <TabsTrigger value="roles">Volunteer Roles</TabsTrigger>
                  <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="roles">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {volunteerOpportunities.map((opportunity, index) => (
                      <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col h-full">
                          <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                            <motion.div
                              className="w-16 h-16 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mb-4"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Plus className="h-8 w-8 text-red-500" />
                            </motion.div>
                            <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Volunteer Role</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              This position is coming soon. Check back for exciting volunteer opportunities!
                            </p>
                            <Button 
                              variant="outline" 
                              className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/50"
                              disabled
                            >
                              Coming Soon
                            </Button>
                      </CardContent>
                    </Card>
                      </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {volunteerEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col h-full">
                          <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                            <motion.div
                              className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CalendarIcon className="h-8 w-8 text-blue-500" />
                            </motion.div>
                            <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Volunteer Event</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              New volunteer events will be posted here. Stay tuned for opportunities to help!
                            </p>
                            <Button 
                              variant="outline" 
                              className="border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                              disabled
                            >
                              Coming Soon
                            </Button>
                      </CardContent>
                    </Card>
                      </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            </motion.div>
          </div>
        </section>

        {/* Volunteer Process */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.h2 
              className="text-3xl font-bold mb-12 text-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              How to Become a Volunteer
            </motion.h2>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  number: "1",
                  title: "Apply Online",
                  description: "Fill out our volunteer application form with your contact information, availability, and areas of interest."
                },
                {
                  number: "2", 
                  title: "Interview",
                  description: "Meet with our volunteer coordinator to discuss your interests, skills, and how you can contribute to our mission."
                },
                {
                  number: "3",
                  title: "Training", 
                  description: "Complete our volunteer orientation and any specific training required for your chosen role."
                },
                {
                  number: "4",
                  title: "Start Volunteering",
                  description: "Begin your volunteer journey with Light Charity Foundation and start making a difference in your community."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                <CardContent className="p-6">
                      <motion.div 
                        className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white w-12 h-12 flex items-center justify-center mb-4 font-bold text-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {step.number}
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">
                        {step.description}
                  </p>
                </CardContent>
              </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Volunteer Stories */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Volunteer Stories</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 flex items-center justify-center">
                  <UserCheck className="h-16 w-16 text-red-500" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground"></h3>
                  <p className="text-primary text-sm mb-4"></p>
                  <p className="text-muted-foreground italic leading-relaxed">
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 flex items-center justify-center">
                  <UserCheck className="h-16 w-16 text-blue-500" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground"></h3>
                  <p className="text-primary text-sm mb-4"></p>
                  <p className="text-muted-foreground italic leading-relaxed">
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="h-48 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50 flex items-center justify-center">
                  <UserCheck className="h-16 w-16 text-green-500" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground"></h3>
                  <p className="text-primary text-sm mb-4"></p>
                  <p className="text-muted-foreground italic leading-relaxed">
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Volunteer Application */}
        <section id="application" className="py-16 bg-muted/30">
          <div className="container max-w-3xl">
            <motion.h2 
              className="text-3xl font-bold mb-6 text-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              Ready to Join Us?
            </motion.h2>
            <motion.p 
              className="text-center text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Fill out the form below to start your volunteer journey with Light Charity Foundation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
            <VolunteerApplicationForm />
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-foreground">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="qualifications" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Do I need any special qualifications to volunteer?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Most volunteer positions don't require special qualifications. We provide all necessary training.
                    Some roles, like transportation volunteers, may require specific licenses or certifications.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="time-commitment" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  How much time do I need to commit?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Volunteer commitments vary by role. Some positions require regular weekly hours, while others are
                    more flexible or event-based. We work with your schedule to find the right fit.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="no-donation" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Can I volunteer if I can't donate blood?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Many of our volunteers are unable to donate blood themselves. Volunteering is a wonderful way to
                    contribute to our mission without donating.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="age-requirement" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Is there an age requirement for volunteering?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Most volunteer positions require volunteers to be at least 16 years old. Some roles may have higher
                    age requirements. We also offer special youth volunteer programs for those under 16 with parental
                    supervision.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="group-volunteering" className="border rounded-lg bg-card">
                <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                  Can I volunteer as part of a group or organization?
                </AccordionTrigger>
                <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    Yes! We welcome volunteer groups from schools, businesses, religious organizations, and community
                    groups. Contact us to discuss group volunteer opportunities.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-muted/30">
          <div className="container max-w-3xl">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">Stay Connected</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Subscribe to our volunteer newsletter to receive updates about new opportunities, volunteer spotlights, 
                  and ways to make an even bigger impact in your community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input placeholder="Enter your email" type="email" className="flex-1 bg-background" />
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                    unoptimized
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
      <Toaster />
    </div>
  )
}
