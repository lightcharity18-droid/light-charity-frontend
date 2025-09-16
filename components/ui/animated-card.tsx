"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cardHover, fadeInUp } from "@/lib/animations";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className = "",
  hoverEffect = true,
  delay = 0,
  direction = "up",
  onClick,
}: AnimatedCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const getDirectionVariants = () => {
    switch (direction) {
      case "left":
        return fadeInUp; // We'll create fadeInLeft later
      case "right":
        return fadeInUp; // We'll create fadeInRight later
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: { delay, duration: 0.5 }
          }
        };
      default:
        return {
          ...fadeInUp,
          animate: {
            ...fadeInUp.animate,
            transition: {
              ...fadeInUp.animate?.transition,
              delay,
            },
          },
        };
    }
  };

  return (
    <motion.div
      variants={getDirectionVariants()}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={hoverEffect ? "hover" : undefined}
      variants={hoverEffect ? cardHover : getDirectionVariants()}
      className="cursor-pointer"
      onClick={onClick}
      onMouseMove={(e) => {
        if (!hoverEffect) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <Card className={`relative overflow-hidden group transition-all duration-300 ${className}`}>
        {/* Spotlight effect overlay */}
        {hoverEffect && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
                rgba(251, 146, 60, 0.1) 0%, transparent 50%)`,
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}

// Specialized animated card for feature sections
export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}) {
  return (
    <AnimatedCard
      delay={delay}
      className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 ${className}`}
    >
      <CardContent className="pt-8 pb-8 px-6">
        <motion.div
          className="rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: 5 }}
        >
          <Icon className="h-8 w-8 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </AnimatedCard>
  );
}

// Animated button component
export function AnimatedButton({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  loading = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const baseClasses = "relative overflow-hidden";
  const variantClasses = {
    default: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white",
    outline: "border border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/50",
    ghost: "hover:bg-orange-50 dark:hover:bg-orange-950/50",
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
      <span className={`${loading ? "opacity-0" : "opacity-100"} flex items-center`}>{children}</span>
    </motion.button>
  );
}
