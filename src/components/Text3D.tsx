"use client";
import AnimatedSphere from "./AnimatedSphere";

interface Text3DComponentProps {
  mousePosition: { x: number; y: number };
}

export default function Text3DComponent({
  mousePosition,
}: Text3DComponentProps) {
  return (
    <>
      {/* Animated sphere in the 3D scene */}
      <AnimatedSphere />
    </>
  );
}
