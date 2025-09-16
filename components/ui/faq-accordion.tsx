"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

const descriptionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(faqs[0]?.id ?? null);
  
  // Pagination logic for mobile/smaller screens
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  
  const visibleFaqs = faqs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked <span className="text-orange-600 dark:text-orange-400">Questions</span>
          </motion.h2>
          <motion.p 
            className="mt-2 text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hover over a card to expand and read the answer.
          </motion.p>
        </div>
      </div>
      
      {/* Container for the expandable cards */}
      <div className="flex items-end h-[28rem] gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex h-full w-full items-end gap-4"
          >
            {visibleFaqs.map((faq) => {
              const isHovered = hoveredId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  layout
                  onMouseEnter={() => setHoveredId(faq.id)}
                  className={cn(
                    "relative h-full rounded-2xl p-6 cursor-pointer flex-shrink-0",
                    "flex flex-col justify-between overflow-hidden",
                    "transition-all duration-300 shadow-lg",
                    // Apply brand colors on hover
                    isHovered 
                      ? "bg-gradient-to-br from-orange-500 to-red-500 shadow-2xl" 
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl"
                  )}
                  style={{
                    width: isHovered ? 'min(60%, 32rem)' : '6rem',
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="h-full">
                    {/* Vertical text when collapsed, horizontal when expanded */}
                    <h3 className={cn(
                      "font-semibold transition-all duration-500 ease-in-out",
                      isHovered
                        ? 'text-xl text-white'
                        : 'text-lg text-foreground [writing-mode:vertical-rl] transform rotate-180 h-full flex items-center whitespace-nowrap'
                    )}>
                      {faq.question}
                    </h3>
                  </div>
                  
                  {/* Animated answer content */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        variants={descriptionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute bottom-6 left-6 right-6"
                      >
                        <p className="text-white/90 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Subtle gradient overlay for non-hovered cards */}
                  {!isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-50/5 to-transparent dark:from-orange-900/5 pointer-events-none" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <motion.div 
          className="flex items-center justify-center gap-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button 
            onClick={handlePrev} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-orange-600" />
          </motion.button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  currentPage === i 
                    ? "w-8 bg-orange-500" 
                    : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700"
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
          
          <motion.button 
            onClick={handleNext} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-5 h-5 text-muted-foreground hover:text-orange-600" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
