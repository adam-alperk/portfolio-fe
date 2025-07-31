"use client";
import { useState, useCallback, ReactNode } from "react";

interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  children: ({
    mousePosition,
    handleMouseMove,
  }: {
    mousePosition: MousePosition;
    handleMouseMove: (event: React.MouseEvent) => void;
  }) => ReactNode;
}

export default function MouseTracker({ children }: MouseTrackerProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0.5,
    y: 0.5,
  });

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  }, []);

  return <>{children({ mousePosition, handleMouseMove })}</>;
}
