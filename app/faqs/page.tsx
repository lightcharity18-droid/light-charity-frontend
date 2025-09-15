"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, HelpCircle, Users, Shield, Clock, Phone, Gift, DollarSign } from "lucide-react"
import Link from "next/link"

// FAQ Data organized by categories
const faqData = {
  blood: [
    {
      id: "blood-1",
      question: "Why should I donate blood?",
      answer:
        "Blood donation is a critical and selfless act that directly saves lives. When you donate blood, you're helping accident victims, surgery patients, cancer patients, and many others who depend on blood transfusions. A single donation can save up to three lives, making it one of the most impactful ways to help others.",
    },
    {
      id: "blood-2",
      question: "Who is eligible to donate blood?",
      answer:
        "Generally, individuals aged 17 and older, weighing at least 110 pounds, and in good health are eligible. Basic eligibility includes: At least 17 years old (16 with parental consent in some states), weigh at least 110 pounds, be in good general health, and feel well on donation day.",
    },
    {
      id: "blood-3",
      question: "How often can I donate blood?",
      answer:
        "Whole blood donations can typically be made every 56 days. Donation frequency depends on the type of donation: Whole Blood every 8 weeks (56 days), Double Red Cells every 16 weeks (112 days), and Platelets every 7 days (up to 24 times per year).",
    },
    {
      id: "blood-4",
      question: "What should I do to prepare for blood donation?",
      answer:
        "Stay hydrated, eat a healthy meal before donating, and bring a valid ID. Eat a healthy meal, drink plenty of water, get a good night's sleep, and avoid alcohol for 24 hours before donation. Bring your ID and wear comfortable clothing with sleeves that can be rolled up.",
    },
    {
      id: "blood-5",
      question: "Are there any risks associated with donating blood?",
      answer:
        "Blood donation is safe. Some may experience minor side effects like dizziness or bruising. Most people experience no side effects. Some may have slight fatigue, mild thirst, or temporary lightheadedness. Rare side effects include bruising at the needle site, fainting, or nausea.",
    },
    {
      id: "blood-6",
      question: "How can I find a blood donation center near me?",
      answer:
        "Visit the American Red Cross website or contact local hospitals and blood banks. You can also use our location finder on our website to find the nearest donation center to you.",
    },
    {
      id: "blood-7",
      question: "How long does a blood donation take?",
      answer:
        "The entire process takes about an hour: Registration & Health Check (15-20 min), Actual Donation (8-10 min), and Rest & Refreshments (15 min).",
    },
    {
      id: "blood-8",
      question: "What happens to my blood after donation?",
      answer:
        "Your donated blood is tested, processed, and separated into components (red cells, plasma, platelets) that can help multiple patients. It's then distributed to hospitals and medical centers where it's needed most.",
    },
  ],
  organ: [
    {
      id: "organ-1",
      question: "How do I become an organ donor?",
      answer:
        "Register through your state's donor registry, typically available online or at the DMV. You can also indicate your wish to donate on your driver's license or state ID card.",
    },
    {
      id: "organ-2",
      question: "Can I specify which organs I want to donate?",
      answer:
        "Yes, you can specify which organs and tissues you wish to donate. When you register, you'll have the option to choose which organs and tissues you're comfortable donating.",
    },
    {
      id: "organ-3",
      question: "Does my age or medical history affect my ability to donate organs?",
      answer:
        "Most people can donate, regardless of age or medical history. Medical professionals will assess suitability at the time of donation. There's no upper age limit for organ donation as long as you're healthy and meet all other eligibility requirements.",
    },
    {
      id: "organ-4",
      question: "Will organ donation affect funeral arrangements?",
      answer:
        "Organ donation does not interfere with traditional funeral arrangements, including open-casket services. The donation process is conducted with the utmost respect and care.",
    },
    {
      id: "organ-5",
      question: "Is there a cost to my family for organ donation?",
      answer:
        "No, all costs related to organ donation are covered by the transplant organization. Your family will not incur any expenses related to the donation process.",
    },
    {
      id: "organ-6",
      question: "Can I change my mind about organ donation?",
      answer:
        "Yes, you can change your organ donation status at any time by updating your registration with your state's donor registry or by updating your driver's license information.",
    },
    {
      id: "organ-7",
      question: "What organs and tissues can be donated?",
      answer:
        "Organs that can be donated include heart, lungs, liver, kidneys, pancreas, and intestines. Tissues include corneas, skin, bone, tendons, and heart valves.",
    },
    {
      id: "organ-8",
      question: "How many lives can one organ donor save?",
      answer:
        "One organ donor can save up to 8 lives through organ donation and enhance the lives of up to 75 people through tissue donation.",
    },
  ],
  fundraising: [
    {
      id: "fundraising-1",
      question: "What is Zeffy?",
      answer:
        "Zeffy is a 100% free fundraising platform for nonprofits, covering all transaction fees through voluntary contributions from donors. It's designed to help organizations raise funds without any platform fees.",
    },
    {
      id: "fundraising-2",
      question: "How does Zeffy remain free for nonprofits?",
      answer:
        "Zeffy relies entirely on optional contributions from donors to cover operational costs, ensuring nonprofits receive 100% of the funds raised. Donors can choose to add a small contribution to support Zeffy's free services.",
    },
    {
      id: "fundraising-3",
      question: "What fundraising tools does Zeffy offer?",
      answer:
        "Zeffy provides tools for donations, event ticketing, peer-to-peer campaigns, memberships, online shops, raffles, auctions, and donor management. It's a comprehensive platform for all your fundraising needs.",
    },
    {
      id: "fundraising-4",
      question: "How can I communicate Zeffy's model to my donors?",
      answer:
        "Inform donors that Zeffy allows 100% of their donation to support your mission, with optional contributions supporting Zeffy's free services. This transparency helps donors understand exactly where their money goes.",
    },
    {
      id: "fundraising-5",
      question: "Where can I find more information or assistance with Zeffy?",
      answer:
        "Visit Zeffy's Help Center for comprehensive guides and support. They offer detailed documentation, tutorials, and customer support to help you get started with fundraising.",
    },
    {
      id: "fundraising-6",
      question: "Can I track my fundraising progress on Zeffy?",
      answer:
        "Yes, Zeffy provides comprehensive donor management and tracking tools. You can monitor your fundraising progress, donor engagement, and campaign performance in real-time.",
    },
    {
      id: "fundraising-7",
      question: "Is there a minimum amount I need to raise to use Zeffy?",
      answer:
        "No, there's no minimum fundraising amount required to use Zeffy. Whether you're raising $100 or $100,000, the platform is free to use for all nonprofits.",
    },
    {
      id: "fundraising-8",
      question: "How quickly can I start fundraising with Zeffy?",
      answer:
        "You can start fundraising immediately after signing up. The platform is designed for quick setup, allowing you to create campaigns and start accepting donations right away.",
    },
  ],
}

const categories = [
  {
    id: "blood",
    title: "Blood Donation",
    count: faqData.blood.length,
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    icon: Heart,
  },
  {
    id: "organ",
    title: "Organ Donation",
    count: faqData.organ.length,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    icon: Gift,
  },
  {
    id: "fundraising",
    title: "Fundraising",
    count: faqData.fundraising.length,
    color:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    icon: DollarSign,
  },
]

export default function FAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("blood")

  const currentQuestions = faqData[selectedCategory as keyof typeof faqData] || faqData.blood

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/20 to-orange-100/20 dark:from-red-900/10 dark:to-orange-900/10"></div>
          <div className="container relative px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Get Your Questions Answered
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
                Frequently Asked Questions
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Find answers to common questions about blood donation, organ donation, and fundraising with Zeffy.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 md:py-16 bg-background">
          <div className="container px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-16">
              {[
                { icon: Heart, label: "Lives Saved Daily", value: "0", color: "text-red-500" },
                { icon: Users, label: "Active Donors", value: "0", color: "text-blue-500" },
                { icon: Shield, label: "Safety Rate", value: "0%", color: "text-green-500" },
                { icon: Clock, label: "Donation Time", value: "0 Minutes", color: "text-orange-500" },
              ].map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 md:p-6">
                    <stat.icon className={`h-6 w-6 md:h-8 md:w-8 ${stat.color} mx-auto mb-2 md:mb-3`} />
                    <div className="text-lg md:text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic FAQ Categories */}
        <section className="py-8 md:py-16 bg-muted/30">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Browse by Category</h2>
              <p className="text-muted-foreground">Choose a category to find specific information</p>
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:mb-12">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    selectedCategory === category.id
                      ? `${category.color} shadow-lg scale-105`
                      : "hover:shadow-md border-border"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 md:p-6 text-center">
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
              ))}
            </div>

            {/* Selected Category Questions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const category = categories.find((c) => c.id === selectedCategory)
                  const IconComponent = category?.icon || Heart
                  return (
                    <>
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedCategory === "blood"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : selectedCategory === "organ"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-green-100 dark:bg-green-900/30"
                        }`}
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
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground">{category?.title} Questions</h2>
                    </>
                  )
                })()}
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {currentQuestions.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg bg-card">
                    <AccordionTrigger className="text-left font-medium px-4 md:px-6 text-foreground hover:no-underline text-sm md:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 md:px-6 pb-4 md:pb-6">
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-6 md:p-8 text-center">
                <Phone className="h-8 w-8 md:h-12 md:w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Still Have Questions?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm md:text-base">
                  Our friendly staff is here to help! Contact us directly or visit one of our donation centers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us: 1-800-DONATE
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/locations">Find a Center</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8 md:mt-12">
              <p className="mb-4 text-foreground">Ready to make a difference?</p>
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              >
                <Link href="/donate">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate Now
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 border-t py-8 md:py-12">
        <div className="container text-center text-sm text-muted-foreground px-4">
          &copy; {new Date().getFullYear()} Light Charity. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
