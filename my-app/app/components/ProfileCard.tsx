"use client";

import React, { useEffect, useRef, useState } from "react";
import githubIcon from "@/app/icons/github-svgrepo-com.svg";
import linkedinIcon from "@/app/icons/linkedin-svgrepo-com.svg";
import Image from "next/image";

interface ProfileCardProps {
  name?: string;
  description?: string;
  githubLink?: string;
  linkedinLink?: string;
  avatarUrl?: string;
}

export default function ProfileCard({
  name = "Kris Kruse",
  description = "Other info here",
  githubLink = "https://github.com/kriskruse",
  linkedinLink = "https://www.linkedin.com/in/kris-back-kruse/",
  avatarUrl = "https://avatars.githubusercontent.com/u/13639480?v=4",
}: ProfileCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // proximity: 0 = far away, 1 = fully close (triggers expand)
  const [proximity, setProximity] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const BASE_SIZE = 64;
  const MAX_CIRCLE_SIZE = 128;
  // Fixed center position from bottom-right corner
  const CENTER_OFFSET_X = MAX_CIRCLE_SIZE * 0.75;
  const CENTER_OFFSET_Y = MAX_CIRCLE_SIZE * 0.75;

  const MAX_DETECT_DISTANCE = 300;

  // Smooth size interpolation based on proximity
  const currentSize = BASE_SIZE + (MAX_CIRCLE_SIZE - BASE_SIZE) * proximity;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't run proximity logic on touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;

    const calculateProximity = () => {
      // Fixed center position (doesn't change with size)
      const centerX = window.innerWidth - CENTER_OFFSET_X;
      const centerY = window.innerHeight - CENTER_OFFSET_Y;

      // Distance from mouse to center
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Check if card should expand
      if (distance <= MAX_CIRCLE_SIZE) {
        setIsExpanded(true);
        setProximity(1);
        return;
      }

      setIsExpanded(false);

      // Smooth interpolation from 0 to 1 based on distance
      if (distance >= MAX_DETECT_DISTANCE) {
        setProximity(0);
      } else {
        // Map distance to 0-1 (closer = higher value)
        const normalized = 1 - (distance - MAX_CIRCLE_SIZE) / (MAX_DETECT_DISTANCE - MAX_CIRCLE_SIZE);
        setProximity(Math.max(0, Math.min(1, normalized)));
      }
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (raf) return;

      raf = requestAnimationFrame(() => {
        raf = 0;
        calculateProximity();
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);


  // Card dimensions for expanded state
  const CARD_WIDTH = 280;

  const handleIconClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, "_blank")?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-50 block"
      style={{
        // Position so the circle center stays fixed, card expands from bottom-right
        right: `${CENTER_OFFSET_X - currentSize / 2}px`,
        bottom: `${CENTER_OFFSET_Y - currentSize / 2}px`,
        width: isExpanded ? `${CARD_WIDTH}px` : `${currentSize}px`,
        height: isExpanded ? "auto" : `${currentSize}px`,
      }}
    >
      <div
        className={`
          transition-all duration-300 ease-out
          ${isExpanded 
            ? "rounded-2xl bg-zinc-900/90 shadow-xl backdrop-blur-sm p-4" 
            : "rounded-full bg-zinc-900/80 shadow-lg backdrop-blur-sm overflow-hidden hover:shadow-xl"
          }
        `}
        style={{
          width: "100%",
          height: isExpanded ? "auto" : `${currentSize}px`,
          // Anchor the card to the bottom-right when expanded
          position: isExpanded ? "absolute" : "relative",
          right: isExpanded ? 0 : "auto",
          bottom: isExpanded ? 0 : "auto",
        }}
      >
        {isExpanded ? (
          // Expanded Profile Card
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 w-full">
              <img
                src={avatarUrl}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
              />
              <h3 className="text-2xl font-bold text-white">
                {name}
              </h3>
            </div>
            <p className="text-sm text-zinc-400">
              {description}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={(e) => handleIconClick(e, githubLink)}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <Image src={githubIcon} alt="Github" className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => handleIconClick(e, linkedinLink)}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <Image src={linkedinIcon} alt="LinkedIn" className="w-10 h-10" />
              </button>
            </div>
          </div>
        ) : (
          // Circular Icon (smooth growing)
          <div className="w-full h-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
