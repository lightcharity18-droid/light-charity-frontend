"use client";

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Heart, Users, Globe, Award, Target, Eye, Lightbulb, Shield, TrendingUp, MapPin, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-card"
import { fadeInUp, staggerContainer, floating } from "@/lib/animations"
import FaqAccordion from "@/components/ui/faq-accordion"
import { faqData } from "@/lib/faq-data"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20 dark:from-orange-900/10 dark:to-red-900/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-orange-50/30 dark:to-gray-900/30"></div>
          
          {/* Floating background elements */}
          <motion.div
            variants={floating}
            animate="animate"
            className="absolute top-20 right-20 w-40 h-40 bg-orange-500/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 10 }}
            className="absolute bottom-20 left-20 w-32 h-32 bg-red-500/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 2, duration: 12 }}
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-400/3 rounded-full blur-2xl"
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
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                <Heart className="h-5 w-5 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Saving Lives</span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 text-center"
                variants={fadeInUp}
              >
                <span className="gradient-text-fallback gradient-text line-height-tight">
                  About Light Charity Foundation
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                Every drop of blood, every tree planted, every life touched—our mission is to save lives and build hope. From connecting donors worldwide to bringing clean water, disaster relief, and greener cities, Light Charity Foundation stands for humanity, health, and a brighter future.
              </motion.p>
              
            </motion.div>
          </div>
        </section>


        {/* What We Do */}
        <section className="py-20 bg-muted/30 relative overflow-hidden">
          {/* Background decoration */}
          <motion.div
            variants={floating}
            animate="animate"
            className="absolute top-10 right-10 w-32 h-32 bg-orange-300/5 rounded-full blur-2xl"
          />
          
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <motion.div 
                    className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-300">What We Do</span>
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-6 text-foreground">
                    Connecting Lives Through <span className="text-orange-600 dark:text-orange-400">Innovation</span>
                  </h2>
                </motion.div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Users,
                      title: "Integrated Platform",
                      description: "We provide an integrated platform that connects patients with compatible donors, blood banks, and hospitals within their vicinity to facilitate timely access to life-saving blood matches during emergencies.",
                      bgColor: "bg-orange-100 dark:bg-orange-900/30",
                      iconColor: "text-orange-600 dark:text-orange-400"
                    },
                    {
                      icon: Globe,
                      title: "Collaborative Network",
                      description: "In collaboration with local blood services and charitable organizations, we work to enhance the efficiency and reach of our support network. Our operations encompass the collection of blood, plasma, stem cells, organs, and tissues.",
                      bgColor: "bg-red-100 dark:bg-red-900/30",
                      iconColor: "text-red-600 dark:text-red-400"
                    },
                    {
                      icon: TrendingUp,
                      title: "Advanced Technology",
                      description: "Using cutting-edge technology and data analytics, we optimize blood distribution, predict demand, and ensure the right blood reaches the right patient at the right time.",
                      bgColor: "bg-blue-100 dark:bg-blue-900/30",
                      iconColor: "text-blue-600 dark:text-blue-400"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      className="flex gap-4 group"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.2 + index * 0.1,
                        ease: [0.42, 0, 0.58, 1]
                      }}
                      whileHover={{ x: 10 }}
                    >
                      <motion.div 
                        className={`flex-shrink-0 w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </motion.div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                      </p>
                    </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>


        {/* Mission & Vision */}
        <section className="py-20 bg-background relative overflow-hidden">
          {/* Background decorations */}
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 0.5, duration: 15 }}
            className="absolute top-1/4 left-10 w-28 h-28 bg-red-300/5 rounded-full blur-2xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1.5, duration: 18 }}
            className="absolute bottom-1/4 right-10 w-36 h-36 bg-orange-300/5 rounded-full blur-2xl"
          />
          
          <div className="container">
            <motion.div 
              className="grid lg:grid-cols-2 gap-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -8 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <CardContent className="p-10 relative">
                    <motion.div 
                      className="flex items-center gap-3 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: 10 }}
                      >
                      <Eye className="h-6 w-6 text-white" />
                      </motion.div>
                    <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
                    </motion.div>
                  <div className="space-y-4">
                    {[
                      { text: "To save", icon: "💝", desc: "Every life matters to us" },
                      { text: "To help", icon: "🤝", desc: "Communities in need" },
                      { text: "To match", icon: "🎯", desc: "Donors with recipients" },
                      { text: "To serve", icon: "🌟", desc: "With excellence and care" },
                    ].map((item, index) => (
                        <motion.div
                        key={index}
                          className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors group/item"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.3 }}
                          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                        >
                          <motion.span 
                            className="text-2xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.icon}
                          </motion.span>
                        <div>
                            <span className="text-xl font-medium text-foreground group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors">
                              {item.text}
                            </span>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>

              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -8 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 opacity-5 group-hover:opacity-10 transition-opacity"></div>
                <CardContent className="p-10 relative">
                    <motion.div 
                      className="flex items-center gap-3 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                        whileHover={{ rotate: -10 }}
                      >
                      <Target className="h-6 w-6 text-white" />
                      </motion.div>
                    <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
                    </motion.div>
                    <motion.div 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      <motion.div 
                        className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-l-4 border-orange-500"
                        whileHover={{ scale: 1.02, borderLeftWidth: 6 }}
                        transition={{ duration: 0.2 }}
                      >
                      <p className="text-xl font-semibold text-foreground mb-2">
                        To save lives, just one donation can save up to three lives.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Every donation makes a difference in someone's life
                      </p>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg group/innovation"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: 0.7 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                      >
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                      <Lightbulb className="h-8 w-8 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                        </motion.div>
                      <div>
                          <p className="text-lg font-medium text-foreground group-hover/innovation:text-orange-600 dark:group-hover/innovation:text-orange-400 transition-colors">
                            Research and Innovation
                          </p>
                        <p className="text-sm text-muted-foreground">
                          Advancing medical technologies for better patient outcomes
                        </p>
                      </div>
                      </motion.div>
                    </motion.div>
                </CardContent>
              </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-muted/30 relative overflow-hidden">
          {/* Background decorations */}
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 2, duration: 20 }}
            className="absolute top-1/3 right-1/4 w-40 h-40 bg-orange-400/3 rounded-full blur-3xl"
          />
          
          <div className="container">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full mb-6 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                <Award className="h-5 w-5 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-muted-foreground">Expert Leadership</span>
              </motion.div>
              <motion.h2 
                className="text-4xl font-bold mb-4 text-foreground"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Our Valuable Partners
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Meet the dedicated professionals leading our mission to save lives and serve communities.
              </motion.p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Canadian Blood Services Partnership */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden w-full max-w-sm mx-auto border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="h-48 bg-white flex items-center justify-center relative overflow-hidden">
                      <motion.div 
                        className="p-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                      <Link 
                        href="https://www.blood.ca/en/blood/donating-blood/new-donor" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src="/images/canadian-blood-services-partnership.png" 
                          alt="Canadian Blood Services Partnership" 
                          className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      </motion.div>
                    </div>
                    <motion.div 
                      className="p-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        Canadian Blood Services
                      </h3>
                    <p className="text-sm text-muted-foreground">
                      Official blood donation partner
                    </p>
                    </motion.div>
                </CardContent>
              </Card>
              </motion.div>

              {/* The Tabios Foundation Partnership */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                whileHover={{ y: -8 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden w-full max-w-sm mx-auto border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="h-48 bg-white flex items-center justify-center relative overflow-hidden">
                      <motion.div 
                        className="p-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                      <Link 
                        href="https://thetabiosfoundation.org/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src="/images/tabios-foundation-logo.png" 
                          alt="The Tabios Foundation Partnership" 
                          className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      </motion.div>
                    </div>
                    <motion.div 
                      className="p-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                      <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        The Tabios Foundation
                      </h3>
                    <p className="text-sm text-muted-foreground">
                      Mental health awareness and veteran support partner
                    </p>
                    </motion.div>
                </CardContent>
              </Card>
              </motion.div>

              {/* Placeholder for future partners */}
              {[
                {
                  color: "from-orange-400 to-red-400",
                  title: "Future Partner",
                  desc: "Coming Soon"
                },
                {
                  color: "from-red-400 to-orange-400",
                  title: "Join Us",
                  desc: "Partner with us"
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0">
                      <motion.div
                      className={`h-48 bg-gradient-to-br ${member.color} flex items-center justify-center relative overflow-hidden`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-black/10"></div>
                        <motion.div 
                          className="relative w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className="h-8 w-8 text-white" />
                        </motion.div>
                      </motion.div>
                      <motion.div 
                        className="p-6 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                      >
                        <h3 className="font-semibold text-lg mb-2 text-foreground">
                          {member.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {member.desc}
                        </p>
                      </motion.div>
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background relative overflow-hidden">
          {/* Background decorations */}
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 16 }}
            className="absolute top-1/4 right-10 w-32 h-32 bg-orange-300/5 rounded-full blur-2xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 2.5, duration: 20 }}
            className="absolute bottom-1/4 left-10 w-40 h-40 bg-red-300/5 rounded-full blur-2xl"
          />
          
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <FaqAccordion faqs={faqData} />
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 text-white relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Floating background elements */}
          <motion.div
            variants={floating}
            animate="animate"
            className="absolute top-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 1, duration: 12 }}
            className="absolute bottom-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"
          />
          <motion.div
            variants={floating}
            animate="animate"
            transition={{ delay: 2, duration: 15 }}
            className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/3 rounded-full blur-2xl"
          />
          
          <div className="container relative">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to Make a Difference?
              </motion.h2>
              <motion.p 
                className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Join our community of heroes and help save lives. Every donation counts, and together we can ensure that
                life-saving blood is available when it's needed most.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatedButton 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-100 shadow-lg"
                  onClick={() => window.location.href = '/donate'}
                >
                    <Heart className="h-4 w-4 mr-2" />
                    Become a Blood Donor
                </AnimatedButton>
                <AnimatedButton 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 hover:border-white/80"
                  onClick={() => window.location.href = '/volunteer'}
                >
                    <Users className="h-4 w-4 mr-2" />
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
