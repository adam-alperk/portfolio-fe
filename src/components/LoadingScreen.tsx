"use client";
import { useEffect, useState, useRef } from "react";

interface LoadingScreenProps {
  progress: number; // 0 to 100
  isLoading: boolean;
}

export default function LoadingScreen({
  progress,
  isLoading,
}: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const animationFrameRef = useRef<number | null>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Update target progress when progress prop changes
  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  // Smooth animation loop for progress
  useEffect(() => {
    const animateProgress = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const difference = target - current;

      if (Math.abs(difference) > 0.1) {
        // Smooth interpolation - adjust speed by changing the multiplier (0.08)
        const step = difference * 0.08;
        const newProgress = current + step;

        currentProgressRef.current = newProgress;
        setDisplayProgress(newProgress);

        animationFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        // Close enough, set to target
        currentProgressRef.current = target;
        setDisplayProgress(target);

        if (target < 100) {
          animationFrameRef.current = requestAnimationFrame(animateProgress);
        }
      }
    };

    if (isLoading) {
      animationFrameRef.current = requestAnimationFrame(animateProgress);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, progress]);

  // Handle fade out when loading completes
  useEffect(() => {
    if (!isLoading) {
      // Cancel any ongoing animation
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Start fade out
      setIsVisible(false);
      // Remove from DOM after fade animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 800); // Match this with the fade duration
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Reset states if loading starts again
  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setIsVisible(true);
      setDisplayProgress(0);
      currentProgressRef.current = 0;
      targetProgressRef.current = 0;
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#121212] flex items-center justify-center transition-opacity duration-1500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative">
        {/* Loading container */}
        <div className="relative w-80 h-20 border-2 border-accent rounded-lg overflow-hidden">
          {/* Background fill that acts as the loading bar */}
          <div
            className="absolute inset-0 bg-accent transition-all duration-75 ease-out"
            style={{
              width: `${displayProgress}%`,
            }}
          />

          {/* Text container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Base text (unfilled) */}
            <div
              className="absolute text-4xl font-normal text-accent select-none"
              style={{ fontFamily: "Orborn, sans-serif" }}
            >
              loading
            </div>

            {/* Masked text (filled) using CSS mask */}
            <div
              className="w-80 absolute text-4xl text-center font-normal text-background select-none transition-all duration-75 ease-out"
              style={{
                fontFamily: "Orborn, sans-serif",
                maskImage: `linear-gradient(to right, black ${displayProgress}%, transparent ${displayProgress}%)`,
                WebkitMaskImage: `linear-gradient(to right, black ${displayProgress}%, transparent ${displayProgress}%)`,
              }}
            >
              loading
            </div>
          </div>
        </div>

        {/* Progress percentage */}
        <div
          className="mt-4 text-center"
          style={{ fontFamily: "Orborn, sans-serif" }}
        >
          <span className="text-md text-accent font-mono">
            {Math.round(displayProgress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
