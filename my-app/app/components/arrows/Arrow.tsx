"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Direction = "up" | "down" | "left" | "right";
type ArrowState = "idle" | "bouncing" | "hovered" | "pressed";

interface ArrowProps {
  direction: Direction;
  onClick: () => void;
  colorClass?: string; // Background color class e.g. "bg-purple-900/60"
  hoverColorClass?: string; // Hover background color class e.g. "hover:bg-purple-800/80"
  iconColorClass?: string; // Icon/stroke color class e.g. "text-white"
  size?: "sm" | "md" | "lg";
  enableIdleBounce?: boolean; // Enable auto-bounce after idle (like scroll arrow)
  ariaLabel?: string;
}

export default function Arrow({
  direction,
  onClick,
  colorClass = "bg-zinc-900/70",
  hoverColorClass = "hover:bg-zinc-800/80",
  iconColorClass = "text-zinc-100",
  size = "md",
  enableIdleBounce = false,
  ariaLabel,
}: ArrowProps) {
  const [arrowState, setArrowState] = useState<ArrowState>("idle");
  const [bounceCount, setBounceCount] = useState(0);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bounceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (bounceIntervalRef.current) {
      clearInterval(bounceIntervalRef.current);
      bounceIntervalRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearTimers();
    setArrowState("idle");
    setBounceCount(0);

    if (!enableIdleBounce) return;

    // Start bouncing after 10 seconds of idle
    idleTimerRef.current = setTimeout(() => {
      setArrowState("bouncing");
      setBounceCount(1);

      // Bounce every 3 seconds after the first bounce
      bounceIntervalRef.current = setInterval(() => {
        setBounceCount((c) => c + 1);
      }, 3000);
    }, 10000);
  }, [clearTimers, enableIdleBounce]);

  // Start idle timer on mount if enabled
  useEffect(() => {
    if (enableIdleBounce) {
      startIdleTimer();
      return () => clearTimers();
    }
  }, [startIdleTimer, clearTimers, enableIdleBounce]);

  function handleMouseEnter() {
    if (enableIdleBounce) {
      clearTimers();
    }
    setArrowState("hovered");
  }

  function handleMouseLeave() {
    if (arrowState !== "pressed") {
      if (enableIdleBounce) {
        startIdleTimer();
      } else {
        setArrowState("idle");
      }
    }
  }

  function handleClick() {
    if (enableIdleBounce) {
      clearTimers();
    }
    setArrowState("pressed");
    onClick();

    // After press animation completes (~600ms), go back to idle
    setTimeout(() => {
      if (enableIdleBounce) {
        startIdleTimer();
      } else {
        setArrowState("idle");
      }
    }, 600);
  }

  // Get rotation based on direction (base arrow points down)
  const getRotation = (): string => {
    switch (direction) {
      case "up": return "180deg";
      case "down": return "0deg";
      case "left": return "90deg";
      case "right": return "-90deg";
    }
  };

  // Get transform based on state and direction
  const getArrowTransform = (): string => {
    const rotation = `rotate(${getRotation()})`;
    if (arrowState === "hovered") {
      // Slight movement in arrow direction on hover
      // this looks a bit weird but the rotation transforms the translateY and translateX direction
      // so in this case the translateY is in the direction of the tip of the arrow regardless of rotation
      switch (direction) {
        case "up": return `${rotation} translateY(-4px)`;
        case "down": return `${rotation} translateY(-4px)`;
        case "left": return `${rotation} translateY(4px)`;
        case "right": return `${rotation} translateY(4px)`;
      }
    }
    return rotation;
  };

  // Get animation class based on state and direction
  const getArrowAnimation = (): string => {
    if (arrowState === "bouncing") {
      switch (direction) {
        case "up": return "animate-single-bounce-up";
        case "down": return "animate-single-bounce";
        case "left": return "animate-single-bounce-left";
        case "right": return "animate-single-bounce-right";
      }
    }
    if (arrowState === "pressed") {
      switch (direction) {
        case "up": return "animate-press-bounce-up";
        case "down": return "animate-press-bounce";
        case "left": return "animate-press-bounce-left";
        case "right": return "animate-press-bounce-right";
      }
    }
    return "";
  };

  // Size classes
  const sizeClasses = {
    sm: { button: "w-8 h-8", icon: "w-4 h-4" },
    md: { button: "w-12 h-12", icon: "w-6 h-6" },
    lg: { button: "w-16 h-16", icon: "w-8 h-8" },
  };

  const defaultAriaLabel = `Navigate ${direction}`;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={ariaLabel || defaultAriaLabel}
      className={`${sizeClasses[size].button} flex items-center justify-center rounded-full ${colorClass} ${hoverColorClass} backdrop-blur shadow-md cursor-pointer transition-all duration-200`}
    >
      <svg
        key={bounceCount}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className={`${sizeClasses[size].icon} ${iconColorClass} transition-transform duration-300 ease-in-out ${getArrowAnimation()}`}
        style={{ transform: getArrowTransform() }}
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

