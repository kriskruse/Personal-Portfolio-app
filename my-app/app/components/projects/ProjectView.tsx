"use client";

import { useState, useCallback } from "react";
import { ProjectData } from "@/app/components/projects/projectTypes";
import ProjectCard from "./ProjectCard";
import Arrow from "@/app/components/arrows/Arrow";

interface ProjectViewProps {
  projects: ProjectData[];
}

export default function ProjectView({ projects }: ProjectViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = projects.length;

  // Wrap index for infinite loop
  const getWrappedIndex = useCallback((index: number) => {
    return ((index % total) + total) % total;
  }, [total]);

  const goNext = () => setCurrentIndex((prev) => getWrappedIndex(prev + 1));
  const goPrev = () => setCurrentIndex((prev) => getWrappedIndex(prev - 1));

  // Handle card click - move to center if not already centered
  const handleCardClick = (position: number, e: React.MouseEvent) => {
    if (position !== 0) {
      e.preventDefault();
      e.stopPropagation();
      setCurrentIndex((prev) => getWrappedIndex(prev + position));
    }
    // Position 0 (center card) - let the click through to open the link
  };

  // Calculate position relative to current index (-2 to 2 are visible)
  const getRelativePosition = (index: number): number => {
    let diff = index - currentIndex;
    // Handle wrap-around for infinite loop
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  // Style based on position - slow-fast-slow (ease-in-out) animation
  const getCardStyle = (position: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: "transform 0.4s ease-in-out, opacity 0.4s ease-in-out, filter 0.4s ease-in-out",
      willChange: "transform, opacity, filter",
    };

    // Cards outside visible range
    if (position < -2 || position > 2) {
      return {
        ...baseStyle,
        transform: `translateX(${position * 30}%) scale(0.5)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none",
      };
    }

    switch (position) {
      case 0: // Center - focused
        return {
          ...baseStyle,
          transform: "translateX(0) scale(1)",
          opacity: 1,
          zIndex: 30,
          filter: "brightness(1)",
        };
      case -1: // Left - tucked under center with overlap
        return {
          ...baseStyle,
          transform: "translateX(-25%) scale(0.85)",
          opacity: 0.7,
          zIndex: 20,
          filter: "brightness(0.75)",
          cursor: "pointer",
        };
      case 1: // Right - tucked under center with overlap
        return {
          ...baseStyle,
          transform: "translateX(25%) scale(0.85)",
          opacity: 0.7,
          zIndex: 20,
          filter: "brightness(0.75)",
          cursor: "pointer",
        };
      case -2: // Far left
        return {
          ...baseStyle,
          transform: "translateX(-40%) scale(0.7)",
          opacity: 0.35,
          zIndex: 10,
          filter: "brightness(0.5)",
          cursor: "pointer",
        };
      case 2: // Far right
        return {
          ...baseStyle,
          transform: "translateX(40%) scale(0.7)",
          opacity: 0.35,
          zIndex: 10,
          filter: "brightness(0.5)",
          cursor: "pointer",
        };
      default:
        return {
          ...baseStyle,
          transform: "translateX(0) scale(0)",
          opacity: 0,
          zIndex: 0,
          pointerEvents: "none",
        };
    }
  };

  if (total === 0) {
    return <div className="text-zinc-400 text-center py-10">No projects found</div>;
  }

  return (
    <div className="relative w-full flex items-center justify-center">
      {/* Cards container with navigation */}
      <div className="relative w-[20vw] h-[40vh] flex items-center justify-center">
        {/* Navigation buttons - positioned relative to card container */}
        <div className="absolute -left-16 z-40">
          <Arrow
            direction="left"
            onClick={goPrev}
            colorClass="bg-purple-900/60"
            hoverColorClass="hover:bg-purple-800/80"
            iconColorClass="text-white"
            size="md"
            ariaLabel="Previous project"
          />
        </div>

        <div className="absolute -right-16 z-40">
          <Arrow
            direction="right"
            onClick={goNext}
            colorClass="bg-purple-900/60"
            hoverColorClass="hover:bg-purple-800/80"
            iconColorClass="text-white"
            size="md"
            ariaLabel="Next project"
          />
        </div>

        {projects.map((project, index) => {
          const position = getRelativePosition(index);
          return (
            <div
              key={project.id}
              className="absolute w-full h-full"
              style={getCardStyle(position)}
              onClick={(e) => handleCardClick(position, e)}
            >
              <ProjectCard project={project} isActive={position === 0} />
            </div>
          );
        })}
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-4 flex gap-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-purple-400 w-4"
                : "bg-zinc-600 hover:bg-zinc-500 w-2"
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

