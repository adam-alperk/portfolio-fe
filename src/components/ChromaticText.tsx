"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLoading } from "./LoadingContext";

interface ChromaticTextProps {
  mousePosition: { x: number; y: number };
}

export default function ChromaticText({ mousePosition }: ChromaticTextProps) {
  const { isLoading } = useLoading();
  const [shouldStartTextAnimation, setShouldStartTextAnimation] =
    useState(false);

  const text = "adigoj";
  const characters = text.split("");

  // Start text animation after loading completes and 3D model has faded in
  useEffect(() => {
    if (!isLoading) {
      // Wait for 3D model fade-in to complete (1.5 seconds)
      const timer = setTimeout(() => {
        setShouldStartTextAnimation(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Animation variants for each character
  const characterVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
      },
    },
  };

  // Container variants to orchestrate the sequence
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // Delay between each character
        delayChildren: 0.2, // Initial delay before starting
      },
    },
  };

  return (
    <div className="flex items-center justify-center h-screen relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={shouldStartTextAnimation ? "visible" : "hidden"}
        className="flex"
        style={{
          fontFamily: "Orborn, sans-serif",
        }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            variants={characterVariants}
            className="text-8xl md:text-9xl font-bold cursor-pointer select-none inline-block"
            style={{
              color: "#9d8566",
            }}
            whileHover={{
              scale: 1,
              transition: { duration: 0.2 },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
