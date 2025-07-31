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
      {/* Always render the animated sphere so it can load and track progress */}
      <AnimatedSphere />
    </>
  );
}
