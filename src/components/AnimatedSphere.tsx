"use client";
import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, LoopRepeat } from "three";
import { useLoading } from "./LoadingContext";

export default function AnimatedSphere() {
  const group = useRef<Group>(null);
  const { updateProgress, setLoading } = useLoading();

  // Load the glTF model with progress tracking
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
