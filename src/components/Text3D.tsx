"use client";
import AnimatedSphere from "./AnimatedSphere";
import InteractiveDots from "./InteractiveDots";

interface Text3DComponentProps {
  mousePosition: { x: number; y: number };
}

export default function Text3DComponent({
  mousePosition,
}: Text3DComponentProps) {
  return (
    <>
      {/* Interactive dots grid behind the sphere */}
      <InteractiveDots mousePosition={mousePosition} />

      {/* Always render the animated sphere so it can load and track progress */}
      <AnimatedSphere />
    </>
  );
}
