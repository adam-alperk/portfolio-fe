"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from "react";

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number) => void;
  updateProgress: (loaded: number, total: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(5); // Start with small progress
  const [startTime] = useState(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateRef = useRef(Date.now());

  // Initialize with small progress for immediate feedback
  useEffect(() => {
    const timer = setTimeout(() => {
      setTargetProgress(15); // Quick initial boost
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  // Smooth progress animation with minimum time
  const animateProgress = useCallback(() => {
    const now = Date.now();
    const elapsed = now - startTime;
    const minLoadTime = 2000; // Minimum 2 seconds for loading

    setProgress((current) => {
      let target = targetProgress;

      // Ensure minimum loading time
      if (elapsed < minLoadTime && target >= 100) {
        target = Math.min(95, (elapsed / minLoadTime) * 100);
      }

      const diff = target - current;
      const step = Math.max(0.5, Math.abs(diff) * 0.05); // Slower, more controlled

      if (diff > 0) {
        const newProgress = Math.min(current + step, target);
        return newProgress;
      } else if (diff < 0) {
        return Math.max(current - step, target);
      }
      return current;
    });
  }, [targetProgress, startTime]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      animateProgress();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    if (isLoading) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, animateProgress]);

  // Handle completion
  useEffect(() => {
    const elapsed = Date.now() - startTime;
    const minLoadTime = 2000;

    if (targetProgress >= 100 && elapsed >= minLoadTime && progress >= 99) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [targetProgress, progress, startTime]);

  const updateProgress = useCallback(
    (loaded: number, total: number) => {
      const now = Date.now();

      // Throttle updates to prevent too rapid changes
      if (now - lastUpdateRef.current < 50) return;
      lastUpdateRef.current = now;

      if (total > 0) {
        const progressPercent = Math.min((loaded / total) * 100, 100);
        setTargetProgress(Math.max(progressPercent, targetProgress)); // Ensure progress only goes forward
      }
    },
    [targetProgress],
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        setLoading,
        setProgress,
        updateProgress,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
