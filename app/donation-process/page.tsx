"use client";

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Heart,
  Clock,
  Shield,
  CheckCircle,
  UserCheck,
  Droplets,
  Coffee,
  FileText,
  MapPin,
  Phone,
  Calendar,
  ArrowRight,
  Award,
  Mail,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { AnimatedCard, AnimatedButton } from "@/components/ui/animated-card"
import { fadeInUp, staggerContainer, floating } from "@/lib/animations"

const bloodDonationSteps = [
  {
    step: 1,
    title: "Registration & Health Check",
    duration: "15-20 minutes",
    description: "Complete registration forms and undergo a brief health screening including vital signs check.",
    details: [
      "Photo ID verification",
      "Health history questionnaire",
      "Mini-physical examination",
      "Iron level test (finger prick)",
    ],
    icon: FileText,
  },
  {
    step: 2,
    title: "Pre-Donation Consultation",
    duration: "5-10 minutes",
    description: "Meet with a healthcare professional to review your health information and answer any questions.",
    details: [
      "Review health questionnaire",
      "Discuss any medications",
      "Address concerns or questions",
      "Final eligibility confirmation",
    ],
    icon: UserCheck,
  },
  {
    step: 3,
    title: "Blood Donation",
    duration: "8-12 minutes",
    description: "The actual blood collection process using sterile, single-use equipment.",
    details: [
      "Comfortable donation chair",
      "Sterile needle insertion",
      "Approximately 1 pint collected",
      "Continuous monitoring by staff",
    ],
    icon: Droplets,
  },
  {
    step: 4,
    title: "Recovery & Refreshments",
    duration: "15 minutes",
    description: "Rest and enjoy refreshments while your body begins to replenish the donated blood.",
    details: ["Observation period", "Snacks and beverages", "Receive donor materials", "Schedule next donation"],
    icon: Coffee,
  },
]

const organDonationSteps = [
  {
    step: 1,
    title: "Registration & Consent",
    duration: "20-30 minutes",
    description: "Complete organ donation registry forms and provide informed consent for donation.",
    details: [
      "Valid ID and documentation",
      "Medical history review",
      "Consent form completion",
      "Emergency contact information",
    ],
    icon: FileText,
  },
  {
    step: 2,
    title: "Medical Evaluation",
    duration: "30-45 minutes",
    description: "Comprehensive medical assessment to determine donation eligibility and organ suitability.",
    details: [
      "Physical examination",
      "Blood tests and screenings",
      "Organ function assessment",
      "Compatibility testing",
    ],
    icon: UserCheck,
  },
  {
    step: 3,
    title: "Education & Counseling",
    duration: "15-20 minutes",
    description: "Receive detailed information about the donation process and ongoing support.",
    details: [
      "Donation process explanation",
      "Risk and benefit discussion",
      "Recovery timeline overview",
      "Support resources provided",
    ],
    icon: Heart,
  },
  {
    step: 4,
    title: "Registry Completion",
    duration: "10-15 minutes",
    description: "Finalize registration in the organ donor registry and receive confirmation materials.",
    details: ["Registry enrollment", "Donor card issuance", "Family notification guidance", "Follow-up scheduling"],
    icon: CheckCircle,
  },
]

const donationTypes = [
  {
    type: "Whole Blood",
    duration: "45-60 minutes",
    frequency: "Every 8 weeks",
    description: "The most common type of donation where whole blood is collected.",
    benefits: "Helps trauma patients, surgery patients, and those with blood disorders.",
    eligibility: "Most healthy adults 17+ years old, weighing 110+ lbs",
  },
  {
    type: "Double Red Cells",
    duration: "75-90 minutes",
    frequency: "Every 16 weeks",
    description: "A specialized donation that collects two units of red blood cells.",
    benefits: "Ideal for trauma patients and those needing red blood cell transfusions.",
    eligibility: "Specific height/weight requirements, O+, O-, A-, B- blood types preferred",
  },
  {
    type: "Platelets",
    duration: "90-120 minutes",
    frequency: "Every 7 days (up to 24x/year)",
    description: "Collects platelets while returning other blood components to you.",
    benefits: "Critical for cancer patients and those with bleeding disorders.",
    eligibility: "Regular donors with good platelet count, specific blood types preferred",
  },
  {
    type: "Plasma",
    duration: "60-90 minutes",
    frequency: "Every 4 weeks",
    description: "Collects plasma while returning red cells and platelets to you.",
    benefits: "Used for burn victims, trauma patients, and immune deficiency treatments.",
    eligibility: "Healthy adults with good protein levels, AB blood type preferred",
  },
]

export default function DonationProcessPage() {
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
            className="absolute top-20 right-20 w-32 h-32 bg-red-200/20 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 10 }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-orange-200/20 rounded-full blur-xl"
          />
          
          <div className="container relative">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm"
              >
                <Heart className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Save Lives Today</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-5xl md:text-6xl font-bold mb-6 text-foreground"
              >
                Donation Process
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                Learn what to expect during your donation journey. Our streamlined process ensures your comfort
                and safety while maximizing the impact of your generous gift.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              >
                <AnimatedButton
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  onClick={() => window.location.href = '/donate'}
                >
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                </AnimatedButton>
                <AnimatedButton 
                  size="lg" 
                  variant="outline"
                  onClick={() => window.location.href = '/locations'}
                >
                    <MapPin className="h-4 w-4 mr-2" />
                    Find a Center
                </AnimatedButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Facts */}
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
                { icon: Clock, label: "Total Time", value: "~1 Hour", color: "text-blue-500" },
                { icon: Droplets, label: "Blood Collected", value: "1 Pint", color: "text-red-500" },
                { icon: Heart, label: "Lives Saved", value: "Up to 3", color: "text-green-500" },
                { icon: Shield, label: "Safety Rate", value: "99.9%", color: "text-orange-500" },
              ].map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                    <fact.icon className={`h-8 w-8 ${fact.color} mx-auto mb-3`} />
                      </motion.div>
                    <div className="text-2xl font-bold text-foreground mb-1">{fact.value}</div>
                    <div className="text-sm text-muted-foreground">{fact.label}</div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Donation Steps */}
        <section className="py-20 bg-muted/30">
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
                  Step by Step Guide
                </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                The Donation Process
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Choose your donation type to learn about the process. Each journey is designed to be safe, comfortable, and efficient.
              </motion.p>
            </motion.div>

            <Tabs defaultValue="blood" className="w-full">
              <motion.div 
                className="flex justify-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted">
                  <TabsTrigger
                    value="blood"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Blood Donation
                  </TabsTrigger>
                  <TabsTrigger
                    value="organ"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Organ Donation
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="blood">
                <div className="grid lg:grid-cols-2 gap-8">
                  {bloodDonationSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: index * 0.2,
                          duration: 0.5,
                          ease: [0.42, 0, 0.58, 1]
                        }
                      }}
                      viewport={{ once: true, amount: 0.5 }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 h-full">
                        <CardHeader>
                          <div className="flex items-center gap-4">
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                              {step.step}
                            </motion.div>
                            <div className="flex-1">
                              <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
                              <CardDescription className="flex items-center gap-1 mt-1">
                                <Clock className="h-4 w-4" />
                                {step.duration}
                              </CardDescription>
                            </div>
                            <motion.div
                              whileHover={{ rotate: 5 }}
                            >
                              <step.icon className="h-8 w-8 text-primary" />
                            </motion.div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{step.description}</p>
                          <div className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{detail}</span>
                              </div>
                            ))}
            </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="organ">
            <div className="grid lg:grid-cols-2 gap-8">
                  {organDonationSteps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: index * 0.2,
                          duration: 0.5,
                          ease: [0.42, 0, 0.58, 1]
                        }
                      }}
                      viewport={{ once: true, amount: 0.5 }}
                      whileHover={{ 
                        y: -8,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-gray-900 dark:text-white font-bold text-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.2 }}
                            >
                        {step.step}
                            </motion.div>
                      <div className="flex-1">
                        <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4" />
                          {step.duration}
                        </CardDescription>
                      </div>
                            <motion.div
                              whileHover={{ rotate: 5 }}
                            >
                      <step.icon className="h-8 w-8 text-primary" />
                            </motion.div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                    </motion.div>
              ))}
            </div>
              </TabsContent>
            </Tabs>

          </div>
        </section>

        {/* Donation Types */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">Types of Donations</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Different types of donations serve different medical needs. Learn about each type to see which might be
                right for you.
              </p>
            </div>

            <Tabs defaultValue="Whole Blood" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-2xl grid-cols-2 lg:grid-cols-4 bg-muted">
                  {donationTypes.map((type) => (
                    <TabsTrigger
                      key={type.type}
                      value={type.type}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {type.type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {donationTypes.map((type) => (
                <TabsContent key={type.type} value={type.type}>
                  <Card className="max-w-4xl mx-auto">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-foreground">{type.type} Donation</CardTitle>
                      <CardDescription className="text-lg">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-foreground mb-1">Duration</h4>
                          <p className="text-sm text-muted-foreground">{type.duration}</p>
                        </div>
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-foreground mb-1">Frequency</h4>
                          <p className="text-sm text-muted-foreground">{type.frequency}</p>
                        </div>
                        <div className="text-center">
                          <UserCheck className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-foreground mb-1">Eligibility</h4>
                          <p className="text-sm text-muted-foreground">{type.eligibility}</p>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-2">Medical Benefits</h4>
                        <p className="text-muted-foreground">{type.benefits}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Preparation Tips */}
        <section className="py-20 bg-muted/30">
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
                <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70 border-green-200 dark:border-green-800 mb-4">
                  Preparation Guide
                </Badge>
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                How to Prepare
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Follow these simple tips to ensure a successful and comfortable donation experience.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Before Your Donation",
                  tips: [
                    "Get a good night's sleep",
                    "Eat a healthy meal 3 hours before",
                    "Drink plenty of water",
                    "Bring a valid photo ID",
                    "Wear comfortable clothing",
                  ],
                  icon: "🌅",
                  color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                },
                {
                  title: "During Your Donation",
                  tips: [
                    "Relax and stay calm",
                    "Inform staff of any discomfort",
                    "Squeeze the stress ball regularly",
                    "Stay hydrated",
                    "Ask questions if needed",
                  ],
                  icon: "🩸",
                  color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                },
                {
                  title: "After Your Donation",
                  tips: [
                    "Rest for 15 minutes",
                    "Drink extra fluids for 24 hours",
                    "Avoid heavy lifting for 24 hours",
                    "Keep bandage on for 4 hours",
                    "Schedule your next donation",
                  ],
                  icon: "🍃",
                  color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                },
              ].map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: index * 0.2,
                      duration: 0.5,
                      ease: [0.42, 0, 0.58, 1]
                    }
                  }}
                  viewport={{ once: true, amount: 0.5 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card className={`${section.color} hover:shadow-lg transition-all duration-300 h-full`}>
                  <CardHeader className="text-center">
                      <motion.div 
                        className="text-4xl mb-2"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {section.icon}
                      </motion.div>
                    <CardTitle className="text-foreground">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.tips.map((tip, tipIndex) => (
                          <motion.li 
                            key={tipIndex} 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.2 + tipIndex * 0.1 }}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{tip}</span>
                          </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-red-500 via-orange-500 to-red-600 text-gray-900 dark:text-white relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
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
          
          <div className="container text-center relative">
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
                <Badge className="bg-white/20 text-gray-900 dark:text-white hover:bg-white/30 border-white/20 mb-6">
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
                className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
              Your donation can make the difference between life and death for someone in need. Join thousands of heroes
                who donate regularly.
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
                  className="bg-white text-red-600 hover:bg-gray-100 shadow-lg"
                  onClick={() => window.location.href = '/donate'}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Schedule Donation
                </AnimatedButton>
                <AnimatedButton
                size="lg"
                variant="outline"
                  className="border-white/30 text-gray-900 dark:text-white hover:bg-white/10 hover:text-gray-900 dark:text-white hover:border-white/50"
                  onClick={() => window.location.href = '/faqs'}
              >
                  <Phone className="h-4 w-4 mr-2" />
                  Have Questions?
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
                    unoptimized
                  />
                </motion.div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Light Charity Foundation</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
    </div>
  )
}
