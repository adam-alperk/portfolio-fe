"use client";
import Scene3D from "./Scene3D";
import Text3DComponent from "./Text3D";

interface InteractiveSceneProps {
  mousePosition: { x: number; y: number };
}

export default function InteractiveScene({
  mousePosition,
}: InteractiveSceneProps) {
  return (
    <div className="w-full h-full">
      {/* 3D Scene with animated sphere */}
      <Scene3D>
        <Text3DComponent mousePosition={mousePosition} />
      </Scene3D>
    </div>
  );
}
