"use client";

import {useCallback, useEffect, useRef, useState} from "react";
import {SECTIONS} from "@/app/lib/sections";
import {scrollToId} from "@/app/lib/scroll";

const IDS = SECTIONS.map((s) => s.id as string);

type ArrowState = "idle" | "bouncing" | "hovered" | "pressed";
type Direction = "down" | "up";

export default function ScrollDownArrow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [arrowState, setArrowState] = useState<ArrowState>("idle");
  const [bounceCount, setBounceCount] = useState(0);
  const [direction, setDirection] = useState<Direction>("down");

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

    // Start bouncing after 10 seconds of idle
    idleTimerRef.current = setTimeout(() => {
      setArrowState("bouncing");
      setBounceCount(1);

      // Bounce every 3 seconds after the first bounce
      bounceIntervalRef.current = setInterval(() => {
        setBounceCount((c) => c + 1);
      }, 3000);
    }, 10000);
  }, [clearTimers]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function update() {
      const y = window.scrollY || window.pageYOffset || 0;
      const h = window.innerHeight || document.documentElement.clientHeight || 1;
      const idx = Math.round(y / h);
      setCurrentIndex(idx);

      // Check if at last section OR near bottom of page
      const scrollHeight = document.documentElement.scrollHeight;
      const isNearBottom = y + h >= scrollHeight - 50; // 50px threshold
      const isAtLastSection = idx >= IDS.length - 1;

      setDirection(isAtLastSection || isNearBottom ? "up" : "down");
    }

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    }

    update();

    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Start idle timer on mount
  useEffect(() => {
    startIdleTimer();
    return () => clearTimers();
  }, [startIdleTimer, clearTimers]);

  function handleMouseEnter() {
    clearTimers();
    setArrowState("hovered");
  }

  function handleMouseLeave() {
    if (arrowState !== "pressed") {
      startIdleTimer();
    }
  }

  function handleClick() {
    clearTimers();
    setArrowState("pressed");

    if (direction === "up") {
      // Scroll to top (first section)
      scrollToId(IDS[0], {duration: 900, easing: "easeOutCubic"});
    } else {
      // Scroll to next section
      const next = Math.min(currentIndex + 1, IDS.length - 1);
      const id = IDS[next];
      scrollToId(id, {duration: 900, easing: "easeOutCubic"});
    }

    // After press animation completes (~600ms), go back to idle timer
    setTimeout(() => {
      startIdleTimer();
    }, 600);
  }

  // Determine arrow transform based on state and direction
  const getArrowTransform = () => {
    const rotation = direction === "up" ? "rotate(180deg)" : "rotate(0deg)";
    switch (arrowState) {
      case "hovered":
        return direction === "up"
          ? `${rotation} translateY(-4px)`
          : `${rotation} translateY(-4px)`;
      case "pressed":
        return rotation; // Bounce animation handles the rest
      default:
        return rotation;
    }
  };

  // Determine animation class based on state and direction
  const getArrowAnimation = () => {
    if (arrowState === "bouncing") {
      return direction === "up" ? "animate-single-bounce-up" : "animate-single-bounce";
    }
    if (arrowState === "pressed") {
      return direction === "up" ? "animate-press-bounce-up" : "animate-press-bounce";
    }
    return "";
  };


  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={direction === "up" ? "Scroll to top" : "Scroll to next section"}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900/70 backdrop-blur shadow-md cursor-pointer transition-transform"
      >
        <svg
          key={bounceCount} // Force re-render only for bounce animation restart
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className={`w-6 h-6 text-zinc-100 transition-transform duration-1000 ease-in-out ${getArrowAnimation()}`}
          style={{transform: getArrowTransform()}}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>
  );
}
