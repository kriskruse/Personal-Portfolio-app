"use client";

import {useEffect, useState} from "react";
import {MetaBalls, MetaBallMode} from "@/app/components/metaballs";

export type {MetaBallMode};

export interface MetaBallsControllerProps {
  /**
   * Mode of operation:
   * - "default": Metaballs move freely
   * - "bounce": Metaballs bounce off elements matching selector
   * - "mask": Metaballs are hidden behind elements matching selector
   */
  mode?: MetaBallMode;
  /**
   * CSS selector for elements to interact with.
   * Defaults based on mode if not specified.
   */
  selector?: string;
}

export default function MetaBallsController({
  mode = "default",
  selector,
}: MetaBallsControllerProps) {
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

    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <MetaBalls opacity={opacity} mode={mode} selector={selector} />;
}
