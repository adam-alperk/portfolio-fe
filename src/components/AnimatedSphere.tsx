"use client";
import { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, LoopRepeat } from "three";
import { useLoading } from "./LoadingContext";

export default function AnimatedSphere() {
  const group = useRef<Group>(null);
  const { updateProgress, isLoading } = useLoading();
  const [opacity, setOpacity] = useState(0);
  const [shouldStartFade, setShouldStartFade] = useState(false);

  // Load the glTF model with progress tracking (always load, regardless of loading state)
  const { scene, animations } = useGLTF("/3d/port2.glb", true);

  // Set up animations
  const { actions, mixer } = useAnimations(animations, group);

  // Track model loading completion
  useEffect(() => {
    if (scene) {
      // Simulate loading progress since GLTF loading is often instant
      let progress = 15; // Start from current progress
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Random increments
        updateProgress(Math.min(progress, 100), 100);

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200); // Update every 200ms

      return () => clearInterval(interval);
    }
  }, [scene, updateProgress]);

  // Start fade-in animation when loading completes
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure loading screen has started fading
      const timer = setTimeout(() => {
        setShouldStartFade(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Animate opacity when fade should start
  useEffect(() => {
    if (shouldStartFade) {
      const startTime = Date.now();
      const duration = 1000; // 1 second fade-in

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth easing function (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setOpacity(easedProgress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [shouldStartFade]);

  // Start the animation when component mounts
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAnimationName = Object.keys(actions)[0];
      const action = actions[firstAnimationName];

      if (action) {
        action.reset();
        action.setLoop(LoopRepeat, Infinity);
        action.timeScale = 0.1;
        action.play();
      }
    }
  }, [actions]);

  // Update animation mixer on each frame
  useFrame((state, delta) => {
    if (mixer) {
      mixer.update(delta);
    }

    if (group.current) {
      group.current.rotation.y += delta * 0;
      // Apply opacity to all materials in the scene
      group.current.traverse((child) => {
        if ((child as any).material) {
          (child as any).material.transparent = true;
          (child as any).material.opacity = opacity;
        }
      });
    }
  });

  return (
    <group
      ref={group}
      position={[0, 0, -16]}
      scale={[1, 1, 1]}
      rotation={[0, 0, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

// Preload the model for better performance
useGLTF.preload("/3d/port2.glb");
