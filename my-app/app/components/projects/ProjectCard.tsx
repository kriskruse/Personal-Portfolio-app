"use client";

import Image from "next/image";
import { ProjectData } from "@/app/components/projects/projectTypes";

// Import SVG icons
import javaIcon from "@/app/icons/java-svgrepo-com.svg";
import pythonIcon from "@/app/icons/python-svgrepo-com.svg";
import webIcon from "@/app/icons/web-internet-seo-browser-network-website-url-svgrepo-com.svg";
import reactIcon from "@/app/icons/react-svgrepo-com.svg";
import csharpIcon from "@/app/icons/c-sharp-svgrepo-com.svg";
import boxIcon from "@/app/icons/box-svgrepo-com.svg";
import minecraftIcon from "@/app/icons/minecraft-svgrepo-com.svg";
import dtuIcon from "@/app/icons/DTU-Corp-Red.svg";
import typescriptIcon from "@/app/icons/typescript-svgrepo-com.svg";

// Icon mapping
const iconMap: Record<string, { src: string; alt: string }> = {
  java: { src: javaIcon, alt: "Java" },
  python: { src: pythonIcon, alt: "Python" },
  web: { src: webIcon, alt: "Web" },
  react: { src: reactIcon, alt: "React" },
  csharp: { src: csharpIcon, alt: "C#" },
  misc: { src: boxIcon, alt: "Miscellaneous" },
  minecraft: { src: minecraftIcon, alt: "Minecraft" },
  dtu: { src: dtuIcon, alt: "DTU" },
  typescript: { src: typescriptIcon, alt: "TypeScript" },
};

interface ProjectCardProps {
  project: ProjectData;
  isActive?: boolean;
}

function Icon({ src, alt, size = "md" }: { src: string; alt: string; size?: "sm" | "md" }) {
  const sizeClasses = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  return <Image src={src} alt={alt} className={sizeClasses} aria-hidden />;
}

export default function ProjectCard({ project, isActive = true }: ProjectCardProps) {
  const { title, description, link, tags, icon } = project;
  const resolvedTypeIcon = icon ? iconMap[icon] : undefined;

  const handleClick = (e: React.MouseEvent) => {
    // Only prevent the link navigation when not active
    // Don't stopPropagation - let parent handle navigation
    if (!isActive) {
      e.preventDefault();
    }
  };

  return (
    <a
      href={isActive ? link : undefined}
      target={isActive ? "_blank" : undefined}
      rel={isActive ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      className={`group flex flex-col p-5 bg-zinc-800 rounded-xl shadow-md backdrop-blur-sm transition-all duration-200 relative w-full h-full overflow-hidden ${
        isActive 
          ? "hover:shadow-lg hover:bg-zinc-700 hover:scale-[1.02] cursor-pointer" 
          : "cursor-default"
      }`}
    >

      {/* Icon + Title row */}
      <div className="flex items-center gap-3 mb-2 pr-10">
        {resolvedTypeIcon && (
          <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-purple-900/40 text-purple-300">
            <Icon src={resolvedTypeIcon.src} alt={resolvedTypeIcon.alt} />
          </span>
        )}
        <h2 className={`text-3xl font-semibold text-zinc-100 transition-colors ${
          isActive ? "group-hover:text-purple-400" : ""
        }`}>
          {title}
        </h2>
      </div>

      {/* Description */}
      <p className="text-lg text-zinc-400 leading-relaxed mb-3">
        {description}
      </p>

      {/* Spacer to push tags to bottom */}
      <div className="flex-1" />

      {/* Tags and Link hint row - pinned to bottom */}
      <div className="flex items-center justify-between gap-4 mt-auto">
        {/* Tags - left side, can wrap to multiple rows */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 flex-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-s font-medium rounded-full bg-purple-900/40 text-purple-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Link hint - right side, only show when active */}
        {isActive && (
          <span className="inline-flex items-center gap-1 text-s font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            View project
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        )}
      </div>
    </a>
  );
}
