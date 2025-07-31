"use client";

interface ChromaticTextProps {
  mousePosition: { x: number; y: number };
}

export default function ChromaticText({ mousePosition }: ChromaticTextProps) {
  return (
    <div className="flex items-center justify-center h-screen relative">
      <h1
        className="text-8xl md:text-9xl font-bold cursor-pointer select-none"
        style={{
          fontFamily: "Orborn, sans-serif",
          color: "#9d8566",
        }}
      >
        adigoj
      </h1>
    </div>
  );
}
