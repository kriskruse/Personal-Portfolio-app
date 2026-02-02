import { ReactNode } from "react";

// import SVGs as React components (SVGR)
import JavaIcon from "@/app/icons/java-svgrepo-com.svg";
import ReactIcon from "@/app/icons/react-svgrepo-com.svg";
import PythonIcon from "@/app/icons/python-svgrepo-com.svg";
import WebIcon from "@/app/icons/web-internet-seo-browser-network-website-url-svgrepo-com.svg";
import CSharpIcon from "@/app/icons/c-sharp-svgrepo-com.svg";
import BoxIcon from "@/app/icons/box-svgrepo-com.svg";

export interface Project {
  id: string; // format: "category.projectname" e.g. "java.myapp"
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
  java: { label: "Java", icon: <JavaIcon className="w-6 h-6" /> },
  python: { label: "Python", icon: <PythonIcon className="w-6 h-6" /> },
  web: { label: "Web", icon: <WebIcon className="w-6 h-6" /> },
  react: { label: "React", icon: <ReactIcon className="w-6 h-6" /> },
  csharp: { label: "C#", icon: <CSharpIcon className="w-6 h-6" /> },
  misc: { label: "Miscellaneous", icon: <BoxIcon className="w-6 h-6" /> },
};

// All projects - add your projects here
export const PROJECTS: Project[] = [
  {
    id: "java.sample-project",
    title: "Sample Java Project",
    description: "This is a sample Java project description showcasing backend development.",
    link: "#",
    tags: ["Java", "Spring Boot", "REST API"],
  },
  {
    id: "java.another-app",
    title: "Another Java App",
    description: "Another example Java application with database integration.",
    link: "#",
    tags: ["Java", "MySQL", "Maven"],
  },
  {
    id: "react.portfolio",
    title: "Portfolio Website",
    description: "A personal portfolio website built with React and Next.js.",
    link: "#",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: "python.data-analyzer",
    title: "Data Analyzer",
    description: "A Python tool for analyzing and visualizing datasets.",
    link: "#",
    tags: ["Python", "Pandas", "Matplotlib"],
  },
];
