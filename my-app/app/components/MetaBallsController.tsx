"use client";

import { useEffect, useState } from "react";
import MetaBalls from "@/app/components/MetaBalls";

export default function MetaBallsController() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    function update() {
      ticking = false;
      const y = window.scrollY || window.pageYOffset || 0;
      const h = window.innerHeight || document.documentElement.clientHeight || 1;
      const raw = 1 - Math.min(Math.max(y / h, 0), 1);
      setOpacity(raw);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    // run once to set initial opacity
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <MetaBalls opacity={opacity} />;
}
