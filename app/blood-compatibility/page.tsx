"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Target, AlertTriangle, CheckCircle, XCircle, Info, Zap, Shield, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { AnimatedCard, AnimatedButton } from "@/components/ui/animated-card"
import { fadeInUp, staggerContainer, floating } from "@/lib/animations"

// Blood type compatibility data
const bloodTypeData = {
  "A+": {
    canDonateTo: ["A+", "AB+"],
    canReceiveFrom: ["A+", "A-", "O+", "O-"],
    percentage: "35.7%",
    description:
      "A+ is the second most common blood type. A+ patients can receive blood from A+, A-, O+, and O- donors.",
    rarity: "common",
    emergencyUse: false,
  },
  "A-": {
    canDonateTo: ["A+", "A-", "AB+", "AB-"],
    canReceiveFrom: ["A-", "O-"],
    percentage: "6.3%",
    description:
      "A- is relatively rare. A- patients can only receive blood from A- and O- donors, but can donate to all A and AB patients.",
    rarity: "uncommon",
    emergencyUse: false,
  },
  "B+": {
    canDonateTo: ["B+", "AB+"],
    canReceiveFrom: ["B+", "B-", "O+", "O-"],
    percentage: "8.5%",
    description: "B+ is less common than A+. B+ patients can receive blood from B+, B-, O+, and O- donors.",
    rarity: "uncommon",
    emergencyUse: false,
  },
  "B-": {
    canDonateTo: ["B+", "B-", "AB+", "AB-"],
    canReceiveFrom: ["B-", "O-"],
    percentage: "1.5%",
    description:
      "B- is one of the rarest blood types. B- patients can only receive blood from B- and O- donors, but can donate to all B and AB patients.",
    rarity: "rare",
    emergencyUse: false,
  },
  "AB+": {
    canDonateTo: ["AB+"],
    canReceiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    percentage: "3.4%",
    description:
      "AB+ is the universal recipient. AB+ patients can receive blood from all blood types, but can only donate to other AB+ patients.",
    rarity: "rare",
    emergencyUse: false,
  },
  "AB-": {
    canDonateTo: ["AB+", "AB-"],
    canReceiveFrom: ["A-", "B-", "AB-", "O-"],
    percentage: "0.6%",
    description:
      "AB- is the rarest blood type. AB- patients can receive blood from A-, B-, AB-, and O- donors, and can donate to both AB+ and AB- patients.",
    rarity: "very-rare",
    emergencyUse: false,
  },
  "O+": {
    canDonateTo: ["A+", "B+", "AB+", "O+"],
    canReceiveFrom: ["O+", "O-"],
    percentage: "37.4%",
    description:
      "O+ is the most common blood type. O+ patients can only receive blood from O+ and O- donors, but can donate to all positive blood types.",
    rarity: "common",
    emergencyUse: true,
  },
  "O-": {
    canDonateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    canReceiveFrom: ["O-"],
    percentage: "6.6%",
    description:
      "O- is the universal donor. O- patients can only receive blood from other O- donors, but can donate to all blood types.",
    rarity: "uncommon",
    emergencyUse: true,
  },
}

// Blood type colors for visualization - Enhanced with gradients and better contrast
const bloodTypeColors = {
  "A+": "bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700",
  "A-": "bg-gradient-to-br from-red-400 to-red-500 dark:from-red-500 dark:to-red-600",
  "B+": "bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700",
  "B-": "bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600",
  "AB+": "bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
  "AB-": "bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600",
  "O+": "bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700",
  "O-": "bg-gradient-to-br from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600",
}

const rarityColors: Record<string, string> = {
  common: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  uncommon: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  rare: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
  "very-rare": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
}

export default function BloodCompatibilityPage() {
  const [selectedBloodType, setSelectedBloodType] = useState<keyof typeof bloodTypeData>("O+")
  const [viewMode, setViewMode] = useState<"donate" | "receive">("donate")

  const bloodTypes = Object.keys(bloodTypeData) as Array<keyof typeof bloodTypeData>

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 relative overflow-hidden">
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
          
          <div className="container relative">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Target className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Life-Saving Knowledge</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Blood Type Compatibility
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Understanding blood type compatibility is crucial for safe transfusions. Use our interactive tools to
                learn which blood types can donate to or receive from each other.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-16 bg-background">
          <div className="container">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              {[
                { icon: Users, label: "Blood Types", value: "8", color: "text-red-500" },
                { icon: Heart, label: "Lives Saved", value: "3", subtext: "per donation", color: "text-blue-500" },
                { icon: Shield, label: "Safety Rate", value: "100%", color: "text-green-500" },
                { icon: Zap, label: "Emergency Ready", value: "24/7", color: "text-orange-500" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                      </motion.div>
                      <motion.div 
                        className="text-2xl font-bold text-foreground mb-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                      {stat.subtext && <div className="text-xs text-muted-foreground">{stat.subtext}</div>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Interactive Chart */}
        <section className="py-8 md:py-12 lg:py-16 bg-muted/30">
          <div className="container max-w-6xl px-4 md:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Interactive Compatibility Checker
              </motion.h2>
              <motion.p 
                className="text-sm md:text-base text-muted-foreground px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Select your blood type and explore compatibility options
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                  <CardTitle className="text-2xl text-foreground">Blood Type Compatibility Explorer</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Discover donation and receiving compatibility for different blood types
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                <Tabs defaultValue="interactive" className="space-y-8">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="interactive">Interactive Explorer</TabsTrigger>
                    <TabsTrigger value="matrix">Full Matrix</TabsTrigger>
                  </TabsList>

                  <TabsContent value="interactive" className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                      {/* Controls */}
                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 text-foreground">Select Your Blood Type</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {bloodTypes.map((type, index) => (
                              <motion.div
                                key={type}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ 
                                  duration: 0.4, 
                                  delay: 0.5 + index * 0.1,
                                  ease: [0.23, 0.86, 0.39, 0.96]
                                }}
                                whileHover={{ 
                                  scale: 1.05, 
                                  y: -2,
                                  transition: { duration: 0.2, ease: "easeOut" }
                                }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  variant={selectedBloodType === type ? "default" : "outline"}
                                  onClick={() => setSelectedBloodType(type)}
                                  className={`relative h-12 sm:h-14 w-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 ${
                                    selectedBloodType === type 
                                      ? `${bloodTypeColors[type]} text-gray-900 dark:text-white shadow-lg border-0 animate-pulse` 
                                      : 'hover:border-2 hover:shadow-md hover:scale-[1.02]'
                                  }`}
                                >
                                  <motion.span
                                    animate={{ 
                                      scale: selectedBloodType === type ? [1, 1.1, 1] : 1,
                                      fontWeight: selectedBloodType === type ? 800 : 700
                                    }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                  >
                                    {type}
                                  </motion.span>
                                  {selectedBloodType === type && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="absolute inset-0 bg-white/20 rounded-md"
                                      transition={{ duration: 0.2 }}
                                    />
                                  )}
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        <div>
                          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 text-foreground">View Mode</h3>
                          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "donate" | "receive")}>
                            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto sm:h-10">
                              <TabsTrigger value="donate" className="text-xs sm:text-sm">Who I Can Donate To</TabsTrigger>
                              <TabsTrigger value="receive" className="text-xs sm:text-sm">Who I Can Receive From</TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>

                        <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                          <CardContent className="p-6">
                            <motion.div 
                              className="flex items-center gap-4 mb-6"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              key={selectedBloodType}
                            >
                              <motion.div
                                className={`w-12 h-12 sm:w-16 sm:h-16 ${bloodTypeColors[selectedBloodType]} flex items-center justify-center text-gray-900 dark:text-white font-black text-lg sm:text-2xl shadow-lg`}
                                style={{ borderRadius: '12px' }}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                  duration: 0.5, 
                                  ease: [0.68, -0.55, 0.265, 1.55],
                                  delay: 0.1
                                }}
                                whileHover={{ 
                                  scale: 1.1, 
                                  rotate: 5,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                {selectedBloodType}
                              </motion.div>
                              <div>
                                <motion.h3 
                                  className="text-lg sm:text-xl font-bold text-foreground mb-2"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                  Blood Type: {selectedBloodType}
                                </motion.h3>
                                <motion.div 
                                  className="flex items-center gap-2"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                  <Badge className={`${rarityColors[bloodTypeData[selectedBloodType].rarity]} font-semibold`}>
                                    {bloodTypeData[selectedBloodType].rarity.replace("-", " ")}
                                  </Badge>
                                  {bloodTypeData[selectedBloodType].emergencyUse && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: 0.4 }}
                                    >
                                      <Badge variant="destructive" className="font-semibold">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Emergency Use
                                      </Badge>
                                    </motion.div>
                                  )}
                                </motion.div>
                              </div>
                            </motion.div>

                            <p className="text-sm text-muted-foreground mb-4">
                              {bloodTypeData[selectedBloodType].description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-foreground">Population:</p>
                                <p className="text-2xl font-bold text-primary">
                                  {bloodTypeData[selectedBloodType].percentage}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {viewMode === "donate" ? "Can Donate To:" : "Can Receive From:"}
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                  {viewMode === "donate"
                                    ? bloodTypeData[selectedBloodType].canDonateTo.length
                                    : bloodTypeData[selectedBloodType].canReceiveFrom.length}{" "}
                                  types
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Visualization */}
                      <div>
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          key={`${selectedBloodType}-${viewMode}-title`}
                          className="text-center mb-6"
                        >
                          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                            {viewMode === "donate"
                              ? `${selectedBloodType} Can Donate To:`
                              : `${selectedBloodType} Can Receive From:`}
                          </h3>
                          <motion.div 
                            className="w-24 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 96 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                        </motion.div>
                        <motion.div 
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                          key={`${selectedBloodType}-${viewMode}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          {bloodTypes.map((type, index) => {
                            const isCompatible =
                              viewMode === "donate"
                                ? bloodTypeData[selectedBloodType].canDonateTo.includes(type)
                                : bloodTypeData[selectedBloodType].canReceiveFrom.includes(type)

                            return (
                              <motion.div
                                key={type}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                  duration: 0.4, 
                                  delay: index * 0.05,
                                  ease: [0.23, 0.86, 0.39, 0.96]
                                }}
                                whileHover={{ 
                                  scale: isCompatible ? 1.02 : 0.98, 
                                  y: isCompatible ? -2 : 0,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                <Card
                                  className={`transition-all duration-300 overflow-hidden ${
                                    isCompatible
                                      ? "border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 shadow-lg"
                                      : "border-gray-200 dark:border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 opacity-60"
                                  }`}
                                >
                                  <CardContent className="p-4 relative">
                                    {isCompatible && (
                                      <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ 
                                          duration: 1.5, 
                                          delay: index * 0.1,
                                          repeat: Infinity,
                                          repeatDelay: 3
                                        }}
                                      />
                                    )}
                                    <div className="flex items-center justify-between relative z-10">
                                      <div className="flex items-center gap-3">
                                        <motion.div
                                          className={`w-10 h-10 sm:w-12 sm:h-12 ${bloodTypeColors[type]} flex items-center justify-center text-gray-900 dark:text-white font-black text-sm sm:text-base shadow-md`}
                                          style={{ borderRadius: '8px' }}
                                          whileHover={{ 
                                            scale: 1.1, 
                                            rotate: isCompatible ? 5 : 0,
                                            transition: { duration: 0.2 }
                                          }}
                                        >
                                          {type}
                                        </motion.div>
                                        <div>
                                          <p className="font-bold text-foreground text-sm sm:text-base">{type}</p>
                                          <p className="text-xs text-muted-foreground font-medium">
                                            {bloodTypeData[type].percentage} population
                                          </p>
                                        </div>
                                      </div>
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ 
                                          duration: 0.3, 
                                          delay: index * 0.05 + 0.2,
                                          type: "spring",
                                          stiffness: 300
                                        }}
                                      >
                                        {isCompatible ? (
                                          <motion.div
                                            whileHover={{ scale: 1.2, rotate: 360 }}
                                            transition={{ duration: 0.3 }}
                                          >
                                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-green-600 drop-shadow-sm" />
                                          </motion.div>
                                        ) : (
                                          <XCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-600 dark:text-gray-400" />
                                        )}
                                      </motion.div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="matrix" className="space-y-6">
                    <div className="text-center mb-4 md:mb-6">
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">Complete Compatibility Matrix</h3>
                      <p className="text-sm md:text-base text-muted-foreground px-2">
                        Comprehensive view of all blood type compatibility relationships
                      </p>
                    </div>

                    <div className="overflow-x-auto -mx-4 md:mx-0 scrollbar-hide will-change-scroll">
                      <div className="min-w-[640px] md:min-w-full">
                        <table className="w-full bg-card shadow-lg rounded-lg table-fixed md:table-auto">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="p-2 md:p-4 text-left font-medium text-foreground text-xs md:text-sm">Donor Type</th>
                            <th className="p-2 md:p-4 text-center font-medium text-foreground text-xs md:text-sm" colSpan={8}>
                              Can Donate To (Recipient Types)
                            </th>
                          </tr>
                          <tr className="bg-muted/30">
                            <th className="p-2 md:p-4"></th>
                            {bloodTypes.map((type, index) => (
                              <motion.th 
                                key={type} 
                                className="p-1 md:p-3 text-center text-xs md:text-sm font-medium text-foreground"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <motion.div
                                  className={`w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 ${bloodTypeColors[type]} flex items-center justify-center text-gray-900 dark:text-white font-black text-xs md:text-sm mx-auto mb-1 shadow-md`}
                                  style={{ borderRadius: '6px' }}
                                  whileHover={{ 
                                    scale: 1.1, 
                                    rotate: 5,
                                    transition: { duration: 0.2 }
                                  }}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ 
                                    duration: 0.4, 
                                    delay: index * 0.05 + 0.2,
                                    type: "spring",
                                    stiffness: 300
                                  }}
                                >
                                  {type}
                                </motion.div>
                              </motion.th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bloodTypes.map((donorType, rowIndex) => (
                            <motion.tr 
                              key={donorType} 
                              className={`${rowIndex % 2 === 0 ? "bg-muted/20" : "bg-background"} hover:bg-muted/40 transition-colors duration-200`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                            >
                              <td className="p-2 md:p-4 font-medium">
                                <div className="flex items-center gap-2 md:gap-4">
                                  <motion.div
                                    className={`w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 ${bloodTypeColors[donorType]} flex items-center justify-center text-gray-900 dark:text-white font-black text-xs md:text-sm shadow-md`}
                                    style={{ borderRadius: '6px' }}
                                    whileHover={{ 
                                      scale: 1.1, 
                                      rotate: 5,
                                      transition: { duration: 0.2 }
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ 
                                      duration: 0.4, 
                                      delay: rowIndex * 0.05 + 0.3,
                                      type: "spring",
                                      stiffness: 300
                                    }}
                                  >
                                    {donorType}
                                  </motion.div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-foreground text-sm md:text-base">{donorType}</div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                      {bloodTypeData[donorType].percentage}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              {bloodTypes.map((recipientType, colIndex) => (
                                <motion.td 
                                  key={recipientType} 
                                  className="p-1 md:p-2 lg:p-4 text-center"
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ 
                                    duration: 0.3, 
                                    delay: rowIndex * 0.05 + colIndex * 0.02 + 0.4,
                                    type: "spring",
                                    stiffness: 300
                                  }}
                                >
                                  <motion.div
                                    whileHover={{ 
                                      scale: bloodTypeData[donorType].canDonateTo.includes(recipientType) ? 1.2 : 1,
                                      rotate: bloodTypeData[donorType].canDonateTo.includes(recipientType) ? 360 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {bloodTypeData[donorType].canDonateTo.includes(recipientType) ? (
                                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-green-600 mx-auto drop-shadow-sm" />
                                    ) : (
                                      <XCircle className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-gray-600 dark:text-gray-400 mx-auto" />
                                    )}
                                  </motion.div>
                                </motion.td>
                              ))}
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Blood Type Facts */}
        <section className="py-16 bg-background">
          <div className="container">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-3xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Essential Blood Type Facts
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Important information every donor should know
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  title: "Universal Donor",
                  description: "O- is known as the universal donor because it can be given to any blood type. This makes O- blood especially valuable in emergency situations.",
                  badge: "O- Blood Type",
                  gradient: "from-red-50 to-white dark:from-red-900/20 dark:to-gray-800",
                  iconBg: "bg-red-100 dark:bg-red-900/30",
                  iconColor: "text-red-600 dark:text-red-400",
                  badgeColor: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                },
                {
                  icon: Users,
                  title: "Universal Recipient",
                  description: "AB+ is known as the universal recipient because it can receive blood from any blood type. However, AB+ donors can only donate to other AB+ recipients.",
                  badge: "AB+ Blood Type",
                  gradient: "from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800",
                  iconBg: "bg-blue-100 dark:bg-blue-900/30",
                  iconColor: "text-blue-600 dark:text-blue-400",
                  badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                },
                {
                  icon: Target,
                  title: "Most Common",
                  description: "O+ is the most common blood type, found in about 37.4% of the population. This means O+ blood is frequently needed for transfusions.",
                  badge: "O+ Blood Type",
                  gradient: "from-green-50 to-white dark:from-green-900/20 dark:to-gray-800",
                  iconBg: "bg-green-100 dark:bg-green-900/30",
                  iconColor: "text-green-600 dark:text-green-400",
                  badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                },
                {
                  icon: AlertTriangle,
                  title: "Rarest Type",
                  description: "AB- is the rarest blood type, found in only about 0.6% of the population. This makes AB- donors especially valuable for AB- patients.",
                  badge: "AB- Blood Type",
                  gradient: "from-orange-50 to-white dark:from-orange-900/20 dark:to-gray-800",
                  iconBg: "bg-orange-100 dark:bg-orange-900/30",
                  iconColor: "text-orange-600 dark:text-orange-400",
                  badgeColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                }
              ].map((fact, index) => (
                <motion.div
                  key={fact.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className={`hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br ${fact.gradient} h-full`}>
                    <CardHeader>
                      <motion.div 
                        className={`w-12 h-12 ${fact.iconBg} rounded-lg flex items-center justify-center mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <fact.icon className={`h-6 w-6 ${fact.iconColor}`} />
                      </motion.div>
                      <CardTitle className="text-foreground">{fact.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {fact.description}
                      </p>
                      <Badge className={fact.badgeColor}>{fact.badge}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-gray-900 dark:text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
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
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Know Your Blood Type?
              </motion.h2>
              
              <motion.p 
                className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Knowing your blood type is important for medical emergencies. If you don't know yours, consider donating
                blood to find out while helping save lives.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <AnimatedButton 
                  size="lg" 
                  className="bg-white text-red-600 hover:bg-gray-100 shadow-lg"
                  onClick={() => window.location.href = '/donate'}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Schedule a Donation
                </AnimatedButton>
                <AnimatedButton 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-gray-900 dark:text-white hover:bg-white/10"
                  onClick={() => window.location.href = '/faqs'}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Learn More About Donation
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
                    onError={(e) => {
                      console.error('Footer logo image failed to load:', e);
                      e.currentTarget.style.display = 'none';
                    }}
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
    </div>
  )
}
