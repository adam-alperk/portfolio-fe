"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLoading } from "./LoadingContext";
import GlassButton from "./GlassButton";

export default function HeroButtons() {
  const { isLoading } = useLoading();
  const [shouldShowButtons, setShouldShowButtons] = useState(false);

  // Show buttons after loading completes and text animation finishes
  useEffect(() => {
    if (!isLoading) {
      // Wait for text animation to complete (1.5s for 3D model + 1.2s for text + 0.5s buffer)
      const timer = setTimeout(() => {
        setShouldShowButtons(true);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (!shouldShowButtons) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 pb-12 pointer-events-none">
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={buttonVariants} className="pointer-events-auto">
          <GlassButton
            variant="primary"
            size="md"
            onClick={() => {
              // Scroll to projects section or navigate to projects page
              console.log("View Work clicked");
            }}
          >
            View Work
          </GlassButton>
        </motion.div>

        <motion.div variants={buttonVariants} className="pointer-events-auto">
          <GlassButton
            variant="primary"
            size="md"
            onClick={() => {
              // Navigate to about or contact
              console.log("About Me clicked");
            }}
          >
            About Me
          </GlassButton>
        </motion.div>

        <motion.div variants={buttonVariants} className="pointer-events-auto">
          <GlassButton
            variant="primary"
            size="md"
            href="mailto:hello@adigoj.com"
          >
            Contact
          </GlassButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
