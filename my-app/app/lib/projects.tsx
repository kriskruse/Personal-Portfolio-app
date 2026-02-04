import React, { ReactNode } from "react";
import Image from "next/image";

// Import SVG icons
import javaIcon from "@/app/icons/java-svgrepo-com.svg";
import pythonIcon from "@/app/icons/python-svgrepo-com.svg";
import webIcon from "@/app/icons/web-internet-seo-browser-network-website-url-svgrepo-com.svg";
import reactIcon from "@/app/icons/react-svgrepo-com.svg";
import csharpIcon from "@/app/icons/c-sharp-svgrepo-com.svg";
import boxIcon from "@/app/icons/box-svgrepo-com.svg";
import minecraftIcon from "@/app/icons/minecraft-svgrepo-com.svg";
import dtuIcon from "@/app/icons/DTU-Corp-Red.svg"

export interface Project {
  id: string; // format: "category.project-name" e.g. "java.myapp"
  title: string;
  description: string;
  link: string;
  tags: string[]; // technologies, languages, etc.
  icon?: ReactNode; // optional custom icon for the project
}

// Helper to extract the category (first part of id before the dot)
export function getProjectCategory(id: string): string {
  const dotIndex = id.indexOf(".");
  return dotIndex > 0 ? id.substring(0, dotIndex) : id;
}

// Group projects by their category
export function groupProjectsByCategory(projects: Project[]): Record<string, Project[]> {
  return projects.reduce((acc, project) => {
    const category = getProjectCategory(project.id);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);
}

// Category display names and icons (customize as needed)
export const CATEGORY_INFO: Record<string, { label: string; icon: React.ReactNode }> = {
  java: { label: "Java", icon: (
    <Image src={javaIcon} alt="Java" className="w-6 h-6" aria-hidden />
  ) },
  python: { label: "Python", icon: (
    <Image src={pythonIcon} alt="Python" className="w-6 h-6" aria-hidden />
  ) },
  web: { label: "Web", icon: (
    <Image src={webIcon} alt="Web" className="w-6 h-6" aria-hidden />
  ) },
  react: { label: "React", icon: (
    <Image src={reactIcon} alt="React" className="w-6 h-6" aria-hidden />
  ) },
  csharp: { label: "C#", icon: (
    <Image src={csharpIcon} alt="C#" className="w-6 h-6" aria-hidden />
  ) },
  misc: { label: "Miscellaneous", icon: (
    <Image src={boxIcon} alt="Miscellaneous" className="w-6 h-6" aria-hidden />
  ) },
};

// All projects - add your projects here
export const PROJECTS: Project[] = [
  {
    id: "java.microservice-courseproject",
    title: "Microservice-courseproject ",
    description: "Course project on Software Development of Web Services, " +
      "involving proper use of micro service architecture .",
    link: "https://github.com/kriskruse/Microservice-courseproject",
    tags: ["Java", "REST API", "RabbitMQ" ,"Cucumber", "Maven", "Microservices",],
    icon: <Image src={dtuIcon} alt="DTU" className="w-6 h-6" aria-hidden />,
  },
  {
    id: "java.breakout-game",
    title: "Breakout Game",
    description: "A classic Breakout game implemented in Java using JavaFX.",
    link: "https://github.com/kriskruse/BreakOut_Java",
    tags: ["Java", "JavaFX", "CI /CD", "Maven",],
    icon: <Image src={dtuIcon} alt="DTU" className="w-6 h-6" aria-hidden />,
  },
  {
    id: "java.ninja-looter",
    title: "Ninja Looter",
    description: "A Minecraft client side only mod that automates looting items from " +
      "chests and other containers using customizable filters.",
    link: "https://github.com/kriskruse/NinjaLooter",
    tags: ["Java", "Gradle", "MC Forge",],
    icon: <Image src={minecraftIcon} alt="Minecraft" className="w-6 h-6" aria-hidden />,
  },
  {
    id: "java.sample-project",
    title: "RPG Style LevelUp Mod",
    description: "A Minecraft server side mod that introduces an RPG-style leveling system" +
      " where players earn experience points (XP) for various actions and can level up to gain perks.",
    link: "https://github.com/kriskruse/RPG-Style-LevelUp",
    tags: ["Java", "Gradle", "MC Forge",],
    icon: <Image src={minecraftIcon} alt="Minecraft" className="w-6 h-6" aria-hidden />,
  },
  {
    id: "react.portfolio",
    title: "Portfolio Website",
    description: "A personal portfolio website built with React and Next.js.",
    link: "#",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: "python.data-miner",
    title: "Web scraper",
    description: "Contributed to DTU course analyser a data mining project by developing web scraper using Python.",
    link: "https://github.com/SMKIDRaadet/dtu-course-analyzer",
    tags: ["Contributor", "Python", "Pandas", "Matplotlib", "Browser Extension", "+4k Downloads"],
  },
];