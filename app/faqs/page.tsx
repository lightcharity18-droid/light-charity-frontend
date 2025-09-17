"use client"

import { useState, useEffect } from "react"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/animated-card"
import { Heart, HelpCircle, Users, Shield, Clock, Phone, Gift, DollarSign, Award, Mail, CalendarDays, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainer, floating } from "@/lib/animations"
import CategorizedFaqAccordion from "@/components/ui/categorized-faq-accordion"
import { categorizedFaqData } from "@/lib/categorized-faq-data"

const categories = [
  {
    id: "blood",
    title: "Blood Donation",
    count: categorizedFaqData.blood.count,
    color: categorizedFaqData.blood.color,
    icon: Heart,
  },
  {
    id: "organ",
    title: "Organ Donation",
    count: categorizedFaqData.organ.count,
    color: categorizedFaqData.organ.color,
    icon: Gift,
  },
  {
    id: "fundraising",
    title: "Fundraising",
    count: categorizedFaqData.fundraising.count,
    color: categorizedFaqData.fundraising.color,
    icon: DollarSign,
  },
]

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("blood")

  const currentCategory = categorizedFaqData[selectedCategory as keyof typeof categorizedFaqData] || categorizedFaqData.blood

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 to-orange-100/20 dark:from-red-900/10 dark:to-orange-900/10"></div>
          
          {/* Floating background elements */}
          <motion.div
            variants={floating}
            animate="animate"
            className="absolute top-20 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 8 }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-red-500/10 rounded-full blur-xl"
          />
          
          <div className="container relative px-4">
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
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Get Your Questions Answered
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
                variants={fadeInUp}
              >
                Frequently Asked Questions
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                Find answers to common questions about blood donation, organ donation, and fundraising with Zeffy.
              </motion.p>
            </motion.div>
          </div>
        </section>


        {/* Dynamic FAQ Categories */}
        <section className="py-8 md:py-16 bg-muted/30">
          <div className="container max-w-7xl px-4">
            <motion.div 
              className="text-center mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Browse by Category
              </motion.h2>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Choose a category to find specific information
              </motion.p>
            </motion.div>

            {/* Category Selection */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    selectedCategory === category.id
                        ? `${category.color} shadow-lg`
                      : "hover:shadow-md border-border"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 md:p-6 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                    <category.icon
                      className={`h-6 w-6 md:h-8 md:w-8 mx-auto mb-3 ${
                        selectedCategory === category.id
                          ? category.id === "blood"
                            ? "text-red-600 dark:text-red-400"
                            : category.id === "organ"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    />
                      </motion.div>
                    <div
                      className={`text-sm md:text-base font-medium mb-2 ${
                        selectedCategory === category.id ? "text-foreground" : "text-foreground"
                      }`}
                    >
                      {category.title}
                    </div>
                    <p className="text-xs text-muted-foreground">{category.count} questions</p>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Selected Category Questions - Expandable Cards */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCategory}
                className="mb-12"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex items-center gap-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {(() => {
                    const category = categories.find((c) => c.id === selectedCategory)
                    const IconComponent = category?.icon || Heart
                    return (
                      <>
                        <motion.div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            selectedCategory === "blood"
                              ? "bg-red-100 dark:bg-red-900/30"
                              : selectedCategory === "organ"
                                ? "bg-blue-100 dark:bg-blue-900/30"
                                : "bg-green-100 dark:bg-green-900/30"
                          }`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <IconComponent
                            className={`h-4 w-4 ${
                              selectedCategory === "blood"
                                ? "text-red-600 dark:text-red-400"
                                : selectedCategory === "organ"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-green-600 dark:text-green-400"
                            }`}
                          />
                        </motion.div>
                        <h2 className="text-xl md:text-2xl font-bold text-foreground">{category?.title} Questions</h2>
                      </>
                    )
                  })()}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <CategorizedFaqAccordion 
                    faqs={currentCategory.faqs}
                    categoryColor={currentCategory.gradientColor}
                    categoryName={currentCategory.title}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 text-gray-900 dark:text-white relative overflow-hidden">
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
                  className="border-white/30 text-gray-900 dark:text-white hover:bg-white/10 hover:text-gray-900 dark:text-white hover:border-white/50"
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
    </div>
  )
}
