"use client";
import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

// Custom shader material for the dots with glow effect
const DotMaterial = shaderMaterial(
  // Uniforms
  {
    uMousePos: new THREE.Vector2(0.5, 0.5),
    uRadius: 90.0,
    uBaseColor: new THREE.Color("#818181"),
    uActiveColor: new THREE.Color("#D89CFF"),
    uViewportSize: new THREE.Vector2(1920, 1080),
    uTime: 0,
  },
  // Vertex shader
  `
    uniform vec2 uMousePos;
    uniform float uRadius;
    uniform vec2 uViewportSize;
    uniform vec3 uActiveColor;
    uniform vec3 uBaseColor;
    
    varying vec3 vColor;
    varying float vGlow;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      
      // Get instance position from the matrix
      vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
      
      // Calculate world position
      vec3 worldPos = instancePos + (modelMatrix * vec4(position, 1.0)).xyz;
      
      // Project to screen space for mouse distance calculation
      vec4 mvPosition = viewMatrix * vec4(worldPos, 1.0);
      vec4 screenPos = projectionMatrix * mvPosition;
      
      // Convert to normalized device coordinates
      vec2 ndc = screenPos.xy / screenPos.w;
      vec2 screenUV = (ndc + 1.0) * 0.5;
      
      // Calculate distance to mouse in screen space
      vec2 mouseScreen = vec2(uMousePos.x, 1.0 - uMousePos.y);
      float distance = length((screenUV - mouseScreen) * uViewportSize);
      
      // Calculate color mixing factor with smooth falloff
      float influence = 1.0 - smoothstep(0.0, uRadius, distance);
      influence = pow(influence, 1.5); // Smooth falloff
      
      // Mix colors
      vColor = mix(uBaseColor, uActiveColor, influence);
      vGlow = influence;
      vPosition = worldPos;
      
      gl_Position = screenPos;
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    
    varying vec3 vColor;
    varying float vGlow;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Use normal-based lighting for spherical dots
      float NdotL = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0)));
      float lightIntensity = max(0.3, NdotL);
      
      // Add glow effect for active dots
      vec3 finalColor = vColor * lightIntensity;
      
      if (vGlow > 0.0) {
        // Enhance brightness for glowing dots
        float glowIntensity = vGlow * 1.5;
        finalColor += vColor * glowIntensity;
        
        // Add emissive glow with blue tint
        finalColor += vec3(0.2, 0.4, 1.0) * vGlow * 1.0;
        
        // Add subtle breathing effect to glowing dots
        float breathe = sin(uTime * 2.0) * 0.15 + 1.0;
        finalColor *= breathe;
      }
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
);

// Extend the material so it can be used in JSX
extend({ DotMaterial });

// TypeScript declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      dotMaterial: any;
    }
  }
}

interface InteractiveDotsProps {
  mousePosition: { x: number; y: number };
}

export default function InteractiveDots({
  mousePosition,
}: InteractiveDotsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<any>(null);
  const { size, viewport } = useThree();

  // Create grid data
  const { positions, count } = useMemo(() => {
    const gridSize = 60; // Grid dimensions
    const spacing = 1.4; // Space between dots
    const positions: number[] = [];

    let index = 0;
    for (let i = -gridSize / 2; i < gridSize / 2; i++) {
      for (let j = -gridSize / 2; j < gridSize / 2; j++) {
        // Create diagonal pattern by offsetting every other row
        const offsetX = (j % 2) * (spacing * 0.5);
        const x = i * spacing + offsetX;
        const y = j * spacing * 0.866; // 0.866 for proper diagonal spacing
        const z = -25; // Position behind the sphere

        positions.push(x, y, z);
        index++;
      }
    }

    return { positions, count: index };
  }, []);

  // Set up instanced mesh
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const dummy = new THREE.Object3D();

    // Set positions for each instance
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [positions, count]);

  // Update uniforms on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uMousePos.set(mousePosition.x, mousePosition.y);
      materialRef.current.uViewportSize.set(size.width, size.height);
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      renderOrder={-1} // Render before the sphere
    >
      <sphereGeometry args={[0.02, 8, 8]} />
      <dotMaterial
        ref={materialRef}
        transparent
        uRadius={650.0} // Radius in pixels
        uBaseColor={new THREE.Color("#818181")}
        uActiveColor={new THREE.Color("#9b00ff")}
      />
    </instancedMesh>
  );
}
