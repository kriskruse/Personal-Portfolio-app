"use client";

import React, {useEffect, useRef, useState} from "react";
import {SectionId, SECTIONS} from "@/app/lib/sections";
import {scrollToId} from "@/app/lib/scroll";

// Icons for each section
const ICONS: Record<SectionId, React.ReactNode> = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
         strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  ),
  about: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
         strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  ),
  projects: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
         strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
    </svg>
  ),
  resume: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
         strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
    </svg>
  ),
};

export default function NavBar() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const [isFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const PROXIMITY_PX = 96; // minimum proximity in px (will be combined with sidebar width)

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible section
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry;
          }
        }
        if (best && best.isIntersecting) {
          setActive(best.target.id);
        }
      },
      {root: null, threshold: [0.25, 0.5, 0.75]}
    );

    SECTIONS.forEach(({id}) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // proximity detection: expand when the cursor approaches the sidebar area
  useEffect(() => {
    if (typeof window === "undefined") return;

    // don't run proximity logic on touch devices or small viewports
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || window.innerWidth <= 640) return;

    let raf = 0;
    let lastX = 0;
    let isCurrentlyFocused = isFocused;

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      if (raf) return;

      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();

        // combine a minimum proximity with a fraction of the sidebar width so it scales
        const dynamicProximity = Math.max(PROXIMITY_PX, rect.width * 1.25);

        const within = lastX <= rect.right + dynamicProximity;

        if (within !== isCurrentlyFocused) {
          isCurrentlyFocused = within;
          setIsFocused(within);
        }
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isFocused]);

  return (
    <aside
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <div
        ref={containerRef}
        className={`flex flex-col gap-2 p-3 bg-white/50 dark:bg-zinc-900/50 rounded-r-lg shadow-lg backdrop-blur-sm transition-all duration-300 ${
          isFocused ? "w-40" : "w-16"
        }`}
      >
        {SECTIONS.map(({id, label}) => (
          <button
            key={id}
            onClick={() => scrollToId(id, {duration: 900, easing: "easeOutCubic"})}
            className={`flex items-center gap-3 p-2 rounded transition-all duration-200 ${
              active === id
                ? "bg-purple-600 text-white"
                : "bg-white/60 dark:bg-zinc-800/60 hover:bg-white/80 dark:hover:bg-zinc-700/60"
            }`}
          >
            <span className="shrink-0">{ICONS[id as SectionId]}</span>
            <span
              className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isFocused ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}