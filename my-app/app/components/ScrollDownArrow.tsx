"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { SECTIONS } from "@/app/lib/sections";
import { scrollToId } from "@/app/lib/scroll";

const IDS = SECTIONS.map((s) => s.id as string);

type ArrowState = "idle" | "bouncing" | "hovered" | "pressed";

export default function ScrollDownArrow() {
  const [show, setShow] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      setShow(idx < IDS.length - 1);
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

    window.addEventListener("scroll", onScroll, { passive: true });
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

    const next = Math.min(currentIndex + 1, IDS.length - 1);
    const id = IDS[next];
    scrollToId(id, { duration: 900, easing: "easeOutCubic" });

    // After press animation completes (~600ms), go back to idle timer
    setTimeout(() => {
      startIdleTimer();
    }, 600);
  }

  if (!show) return null;

  // Determine arrow transform based on state
  const getArrowTransform = () => {
    switch (arrowState) {
      case "hovered":
        return "translateY(-4px)";
      case "pressed":
        return ""; // Handled by animation
      default:
        return "translateY(0)";
    }
  };

  // Determine animation class based on state
  const getArrowAnimation = () => {
    if (arrowState === "bouncing") {
      return "animate-single-bounce";
    }
    if (arrowState === "pressed") {
      return "animate-press-bounce";
    }
    return "";
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Scroll to next section"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-md cursor-pointer transition-transform"
      >
        <svg
          key={bounceCount} // Force re-render to restart animation
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className={`w-6 h-6 text-zinc-900 dark:text-zinc-100 transition-transform duration-200 ${getArrowAnimation()}`}
          style={{ transform: arrowState !== "bouncing" && arrowState !== "pressed" ? getArrowTransform() : undefined }}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
