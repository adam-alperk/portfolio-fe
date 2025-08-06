"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export default function GlassButton({
  children,
  onClick,
  href,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: GlassButtonProps) {
  const baseClasses = `
    relative overflow-hidden
    backdrop-blur-[6px]
    border border-white/10
    rounded-xl
    transition-all duration-300 ease-out
    cursor-pointer
    select-none
    group
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: `
      bg-white/1 
      text-accent 
      shadow-lg shadow-black/30
      hover:shadow-xl hover:shadow-black/30
      hover:border-white/10
      duration-300
      ease-in-out
    `,
    secondary: `
      bg-accent/10 
      text-accent 
      shadow-lg shadow-accent/20
      hover:shadow-xl hover:shadow-accent/30
      hover:border-accent/10
    `,
  };

  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const ButtonContent = () => (
    <>
      {/* Button content */}
      <span className="relative z-10 font-medium tracking-wide">
        {children}
      </span>

      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-30" />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% -200%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
      `}</style>
    </>
  );

  const motionProps = {
    whileHover: disabled
      ? {}
      : {
          scale: 1.02,
          y: -2,
        },
    whileTap: disabled
      ? {}
      : {
          scale: 0.98,
          y: 0,
        },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  };

  if (href && !disabled) {
    return (
      <motion.a
        href={href}
        className={buttonClasses}
        {...motionProps}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button
      className={buttonClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...motionProps}
    >
      <ButtonContent />
    </motion.button>
  );
}
