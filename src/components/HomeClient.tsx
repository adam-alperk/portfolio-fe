"use client";
import { useState, useCallback } from "react";
import InteractiveScene from "./InteractiveScene";
import ChromaticText from "./ChromaticText";
import AnimatedLayout from "./AnimatedLayout";
import LoadingScreen from "./LoadingScreen";
import HeroButtons from "./HeroButtons";
import { LoadingProvider, useLoading } from "./LoadingContext";

function HomeContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const { isLoading, progress } = useLoading();

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  }, []);

  return (
    <AnimatedLayout>
      {/* Loading Screen */}
      <LoadingScreen progress={progress} isLoading={isLoading} />

      <div
        className="min-h-screen bg-gradient-to-br from-stone-100 via-neutral-50 to-stone-200 dark:from-stone-900 dark:via-neutral-900 dark:to-stone-800 relative"
        onMouseMove={handleMouseMove}
      >
        {/* Full screen 3D scene */}
        <div className="absolute inset-0">
          <InteractiveScene mousePosition={mousePosition} />
        </div>

        {/* 2D Chromatic Text - Top Level */}
        <div className="absolute inset-0 z-50">
          <ChromaticText mousePosition={mousePosition} />
        </div>

        {/* Hero Buttons */}
        <HeroButtons />
      </div>
    </AnimatedLayout>
  );
}

export default function HomeClient() {
  return (
    <LoadingProvider>
      <HomeContent />
    </LoadingProvider>
  );
}
