"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface CategorizedFaqAccordionProps {
  faqs: FaqItem[];
  categoryColor?: string;
  categoryName?: string;
}

const descriptionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function CategorizedFaqAccordion({ 
  faqs, 
  categoryColor = "from-orange-500 to-red-500",
  categoryName = "FAQ"
}: CategorizedFaqAccordionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(faqs[0]?.id ?? null);
  
  // Responsive pagination logic - adjust items per page based on screen size
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [screenWidth, setScreenWidth] = useState(1280);
  
  // Adjust items per page and track screen width with throttling
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const updateScreenSize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      
      let newItemsPerPage = 6;
      if (width < 640) { // sm
        newItemsPerPage = 2;
      } else if (width < 768) { // md
        newItemsPerPage = 3;
      } else if (width < 1024) { // lg
        newItemsPerPage = 4;
      } else if (width < 1280) { // xl
        newItemsPerPage = 5;
      }
      
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(0); // Reset to first page when changing items per page
    };
    
    const throttledUpdateScreenSize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScreenSize, 100); // Throttle resize events
    };
    
    updateScreenSize(); // Initial call
    window.addEventListener('resize', throttledUpdateScreenSize);
    return () => {
      window.removeEventListener('resize', throttledUpdateScreenSize);
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array is fine now
  
  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  
  const visibleFaqs = faqs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    // Reset hover to first item of new page
    const nextPageFirstItem = faqs[((currentPage + 1) % totalPages) * itemsPerPage];
    if (nextPageFirstItem) {
      setHoveredId(nextPageFirstItem.id);
    }
  };
  
  const handlePrev = () => {
    const prevPage = (currentPage - 1 + totalPages) % totalPages;
    setCurrentPage(prevPage);
    // Reset hover to first item of previous page
    const prevPageFirstItem = faqs[prevPage * itemsPerPage];
    if (prevPageFirstItem) {
      setHoveredId(prevPageFirstItem.id);
    }
  };

  // Ensure we have a hovered item when page changes
  React.useEffect(() => {
    if (visibleFaqs.length > 0 && (!hoveredId || !visibleFaqs.find(faq => faq.id === hoveredId))) {
      setHoveredId(visibleFaqs[0].id);
    }
  }, [currentPage, itemsPerPage]); // Only depend on page changes, not on hoveredId or visibleFaqs

  return (
    <div className="w-full h-full flex flex-col">
      {/* Container for the expandable cards - Responsive sizing */}
      <div className="flex items-end h-[20rem] sm:h-[22rem] md:h-[24rem] gap-2 sm:gap-3 w-full justify-center px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex h-full items-end gap-2 sm:gap-3 justify-center w-full max-w-7xl"
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
                    "transition-all duration-300 shadow-lg border",
                    // Apply category-specific colors on hover
                    isHovered 
                      ? `bg-gradient-to-br ${categoryColor} shadow-2xl border-transparent` 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                  style={{
                    // Responsive width calculation based on screen size
                    width: isHovered 
                      ? screenWidth < 640 
                        ? 'min(75%, 18rem)' 
                        : screenWidth < 768
                        ? 'min(65%, 22rem)'
                        : screenWidth < 1024
                        ? 'min(55%, 26rem)'
                        : 'min(50%, 28rem)'
                      : screenWidth < 640
                      ? '4rem'
                      : screenWidth < 768
                      ? '5rem'
                      : screenWidth < 1024
                      ? '6rem'
                      : '7rem',
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                  {/* Question text - positioned at top for expanded, center for collapsed */}
                  <div className={cn(
                    "transition-all duration-500",
                    isHovered ? "absolute top-6 left-6 right-6" : "h-full flex items-center justify-center"
                  )}>
                    <h3 className={cn(
                      "font-semibold transition-all duration-500 ease-in-out leading-tight",
                      isHovered
                        ? screenWidth < 640 
                          ? 'text-sm text-white px-2'
                          : screenWidth < 768
                          ? 'text-base text-white px-3'
                          : 'text-lg text-white px-4'
                        : screenWidth < 640
                        ? 'text-xs text-foreground [writing-mode:vertical-rl] transform rotate-180 text-center px-1 py-2 h-full flex items-center justify-center'
                        : 'text-sm text-foreground [writing-mode:vertical-rl] transform rotate-180 text-center px-2 py-2 h-full flex items-center justify-center'
                    )}>
                      {faq.question}
                    </h3>
                  </div>
                  
                  {/* Animated answer content - positioned below question with more spacing */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        variants={descriptionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cn(
                          "absolute overflow-y-auto",
                          screenWidth < 640 
                            ? "top-16 left-3 right-3 bottom-3"
                            : screenWidth < 768
                            ? "top-20 left-4 right-4 bottom-4"
                            : "top-28 left-6 right-6 bottom-6"
                        )}
                      >
                        <div className={cn(
                          "bg-white/10 backdrop-blur-sm rounded-lg h-full",
                          screenWidth < 640 ? "p-2" : screenWidth < 768 ? "p-3" : "p-4"
                        )}>
                          <p className={cn(
                            "text-white/95 leading-relaxed",
                            screenWidth < 640 ? "text-xs" : "text-sm"
                          )}>
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Subtle gradient overlay for non-hovered cards */}
                  {!isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-50/5 to-transparent dark:from-orange-900/5 pointer-events-none rounded-2xl" />
                  )}
                  
                  {/* Category indicator for non-hovered cards - positioned at bottom */}
                  {!isHovered && (
                    <div className={cn(
                      "absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full opacity-70",
                      categoryName === "Blood Donation" ? "bg-red-500" :
                      categoryName === "Organ Donation" ? "bg-blue-500" :
                      "bg-green-500"
                    )} />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination controls - Responsive */}
      {totalPages > 1 && (
        <motion.div 
          className={cn(
            "flex items-center justify-center mt-4 sm:mt-6",
            screenWidth < 640 ? "gap-3" : "gap-6"
          )}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.button 
            onClick={handlePrev} 
            className={cn(
              "flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-200 shadow-sm",
              screenWidth < 640 ? "w-8 h-8" : "w-10 h-10"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className={cn(
              "text-muted-foreground hover:text-orange-600",
              screenWidth < 640 ? "w-3 h-3" : "w-4 h-4"
            )} />
          </motion.button>
          
          <div className={cn(
            "flex items-center",
            screenWidth < 640 ? "gap-1" : "gap-2"
          )}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setCurrentPage(i);
                  const newPageFirstItem = faqs[i * itemsPerPage];
                  if (newPageFirstItem) {
                    setHoveredId(newPageFirstItem.id);
                  }
                }}
                className={cn(
                  "rounded-full transition-all duration-300",
                  screenWidth < 640 ? "h-1.5" : "h-2",
                  currentPage === i 
                    ? screenWidth < 640 
                      ? "w-4 bg-gradient-to-r from-orange-500 to-red-500 shadow-sm"
                      : "w-6 bg-gradient-to-r from-orange-500 to-red-500 shadow-sm"
                    : screenWidth < 640
                    ? "w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700"
                    : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700"
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
          
          <motion.button 
            onClick={handleNext} 
            className={cn(
              "flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-200 shadow-sm",
              screenWidth < 640 ? "w-8 h-8" : "w-10 h-10"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className={cn(
              "text-muted-foreground hover:text-orange-600",
              screenWidth < 640 ? "w-3 h-3" : "w-4 h-4"
            )} />
          </motion.button>
        </motion.div>
      )}
      
      {/* Page indicator - Responsive */}
      <motion.div 
        className={cn(
          "text-center",
          screenWidth < 640 ? "mt-3" : "mt-4"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className={cn(
          "text-muted-foreground",
          screenWidth < 640 ? "text-xs" : "text-sm"
        )}>
          {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, faqs.length)} of {faqs.length} questions
        </span>
      </motion.div>
    </div>
  );
}
