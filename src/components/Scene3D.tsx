"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Plane, shaderMaterial } from "@react-three/drei";
import { Suspense, useMemo, useRef, useEffect } from "react";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

// Create custom gradient shader material
const GradientMaterial = shaderMaterial(
  // Uniforms
  {
    uColorCenter: new THREE.Color("#5a5a5a"),
    uColorEdge: new THREE.Color("#373737"),
    uRadius: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform vec3 uColorCenter;
    uniform vec3 uColorEdge;
    uniform float uRadius;
    varying vec2 vUv;
    
    void main() {
      // Calculate distance from center (moved down from 0.5 to 0.3)
      vec2 center = vec2(0.5, 0.15);
      float distance = length(vUv - center) * 2.0; // Multiply by 2 to normalize to 0-1 range
      
      // Clamp distance to radius
      distance = min(distance, uRadius);
      
      // Create smooth gradient
      vec3 color = mix(uColorCenter, uColorEdge, smoothstep(0.0, uRadius, distance));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
);

// Create dithering overlay material
const DitheringMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uIntensity: 0.15,
    uScale: 100.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform float uScale;
    varying vec2 vUv;
    
    // Blue noise function for better dithering pattern
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    // Ordered dithering matrix (4x4)
    float dither4x4(vec2 position, float brightness) {
      int x = int(mod(position.x, 4.0));
      int y = int(mod(position.y, 4.0));
      int index = x + y * 4;
      float limit = 0.0;
      
      if (x < 8) {
        if (index == 0) limit = 0.0625;
        if (index == 1) limit = 0.5625;
        if (index == 2) limit = 0.1875;
        if (index == 3) limit = 0.6875;
        if (index == 4) limit = 0.8125;
        if (index == 5) limit = 0.3125;
        if (index == 6) limit = 0.9375;
        if (index == 7) limit = 0.4375;
        if (index == 8) limit = 0.25;
        if (index == 9) limit = 0.75;
        if (index == 10) limit = 0.125;
        if (index == 11) limit = 0.625;
        if (index == 12) limit = 1.0;
        if (index == 13) limit = 0.5;
        if (index == 14) limit = 0.875;
        if (index == 15) limit = 0.375;
      }
      
      return brightness < limit ? 0.0 : 1.0;
    }
    
    void main() {
      vec2 screenPos = vUv * uScale;
      
      // Create multiple noise layers
      float noise1 = rand(screenPos + uTime * 0.1);
      float noise2 = rand(screenPos * 1.7 + uTime * 0.15);
      float noise3 = dither4x4(screenPos, rand(screenPos + uTime * 0.05));
      
      // Blend different noise patterns
      float combinedNoise = mix(noise1, noise2, 0.5) * 0.7 + noise3 * 0.3;
      
      // Create dithering pattern
      float dither = (combinedNoise - 0.5) * uIntensity;
      
      // Output with additive blending
      gl_FragColor = vec4(dither, dither, dither, 1.0);
    }
  `,
);

// Extend both materials so they can be used in JSX
extend({ GradientMaterial, DitheringMaterial });

// TypeScript declarations for the extended materials
declare global {
  namespace JSX {
    interface IntrinsicElements {
      gradientMaterial: any;
      ditheringMaterial: any;
    }
  }
}

// Dithering overlay component
function DitheringOverlay() {
  const materialRef = useRef<any>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  // Position the plane to cover the entire screen
  return (
    <Plane args={[2, 2]} position={[0, 0, 1]} renderOrder={1000}>
      <ditheringMaterial
        ref={materialRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        depthTest={false}
        uIntensity={0.2}
        uScale={420.0}
      />
    </Plane>
  );
}

interface Scene3DProps {
  children: React.ReactNode;
}

export default function Scene3D({ children }: Scene3DProps) {
  const gradientMaterialProps = useMemo(
    () => ({
      uColorCenter: new THREE.Color("#5a5a5a"),
      uColorEdge: new THREE.Color("#373737"),
      uRadius: 1.0,
    }),
    [],
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        // Enable dithering on the renderer
        dithering: true,
      }}
    >
      <Suspense fallback={null}>
        {/* Custom lighting setup instead of Environment */}
        <ambientLight intensity={0.7} color="#d1ecff" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.6}
          color="#ffffff"
          castShadow
        />
        <directionalLight
          position={[-5, 10, 2]}
          intensity={1.2}
          color="#ffffff"
        />
        <pointLight position={[0, 10, 0]} intensity={2} color="#d1ecff" />

        {/* Background plane with circular gradient */}
        <Plane args={[100, 100]} position={[0, 0, -40]} rotation={[0, 0, 0]}>
          <gradientMaterial
            uColorCenter={gradientMaterialProps.uColorCenter}
            uColorEdge={gradientMaterialProps.uColorEdge}
            uRadius={gradientMaterialProps.uRadius}
          />
        </Plane>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
        />

        {children}

        {/* Dithering overlay on top of everything */}
        <DitheringOverlay />
      </Suspense>
    </Canvas>
  );
}
