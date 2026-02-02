"use client";

import { useEffect, useState } from "react";
import ContentBox from "@/app/components/ContentBox";

const SECTION_IDS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "github", label: "Github" },
];

export default function TopNav() {
  const [active, setActive] = useState<string>("home");

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
      { root: null, threshold: [0.25, 0.5, 0.75] }
    );

    SECTION_IDS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <ContentBox>
        <nav className="flex gap-2">
          {SECTION_IDS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              className={`px-3 py-1 rounded transition ${
                active === id ? "bg-purple-600 text-white" : "bg-white/60 dark:bg-zinc-800/60"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </ContentBox>
    </header>
  );
}