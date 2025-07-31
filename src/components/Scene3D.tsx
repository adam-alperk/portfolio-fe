"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane } from "@react-three/drei";
import { Suspense } from "react";

interface Scene3DProps {
  children: React.ReactNode;
}

export default function Scene3D({ children }: Scene3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <Suspense fallback={null}>
        {/* Custom lighting setup instead of Environment */}
        <ambientLight intensity={0.7} color="#f0f0f0" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.6}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-5, 10, 2]}
          intensity={1.2}
          color="#ffe2d1"
        />
        <pointLight position={[0, 10, 0]} intensity={2} color="#d1ecff" />

        {/* Background plane */}
        <Plane args={[100, 100]} position={[0, 0, -40]} rotation={[0, 0, 0]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </Plane>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
        />
        {children}
      </Suspense>
    </Canvas>
  );
}
