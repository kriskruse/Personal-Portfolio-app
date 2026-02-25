"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/app/lib/sections";
import { scrollToId } from "@/app/lib/scroll";
import Arrow from "@/app/components/arrows/Arrow";

const IDS = SECTIONS.map((s) => s.id as string);

export default function ScrollDownArrow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"down" | "up">("down");

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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  function handleClick() {
    if (direction === "up") {
      // Scroll to top (first section)
      scrollToId(IDS[0], { duration: 900, easing: "easeOutCubic" });
    } else {
      // Scroll to next section
      const next = Math.min(currentIndex + 1, IDS.length - 1);
      const id = IDS[next];
      scrollToId(id, { duration: 900, easing: "easeOutCubic" });
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Arrow
        direction={direction}
        onClick={handleClick}
        colorClass="bg-zinc-900/70"
        hoverColorClass="hover:bg-zinc-800/80"
        iconColorClass="text-zinc-100"
        size="md"
        enableIdleBounce={true}
        ariaLabel={direction === "up" ? "Scroll to top" : "Scroll to next section"}
      />
    </div>
  );
}
