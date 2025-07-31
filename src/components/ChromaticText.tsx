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

  return (
    <div className="flex items-center justify-center h-screen relative">
      {/* Container with hidden overflow to create the "invisible box" effect */}
      <div className="overflow-hidden">
        <motion.div
          initial={{ y: 120 }} // Start from below
          animate={shouldStartTextAnimation ? { y: 0 } : { y: 120 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1], // Organic, smooth easing
            delay: 0.2,
          }}
          className="flex"
          style={{
            fontFamily: "Orborn, sans-serif",
          }}
        >
          {characters.map((char, index) => (
            <span
              key={index}
              className="text-8xl md:text-9xl font-bold mx-1 cursor-pointer select-none inline-block  transition-transform duration-200"
              style={{
                color: "#a9a9a9",
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
