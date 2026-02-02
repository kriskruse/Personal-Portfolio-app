"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/app/lib/sections";
import { scrollToId } from "@/app/lib/scroll";

const IDS = SECTIONS.map((s) => s.id as string);

export default function ScrollDownArrow() {
  const [show, setShow] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function update() {
      const y = window.scrollY || window.pageYOffset || 0;
      const h = window.innerHeight || document.documentElement.clientHeight || 1;
      // use rounding so it snaps to the nearest section
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

    // initial
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  function goNext() {
    const next = Math.min(currentIndex + 1, IDS.length - 1);
    const id = IDS[next];
    scrollToId(id, { duration: 900, easing: "easeOutCubic" });
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={goNext}
        aria-label="Scroll to next section"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-md hover:scale-105 active:scale-95 transition-transform"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-6 h-6 text-zinc-900 dark:text-zinc-100 animate-bounce"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
