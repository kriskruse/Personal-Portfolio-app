import { ReactNode } from "react";

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
  java: { label: "Java", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm6.93 8h-2.06a15.9 15.9 0 00-1.1-3.32A8.025 8.025 0 0118.93 10zM12 4.07c1.7 1.06 3.05 2.78 3.77 4.93H8.23c.72-2.15 2.07-3.87 3.77-4.93zM4.07 12c0-.67.07-1.32.2-1.94h3.22c-.14.64-.22 1.3-.22 1.94s.08 1.3.22 1.94H4.27c-.14-.62-.2-1.27-.2-1.94zM12 19.93c-1.7-1.06-3.05-2.78-3.77-4.93h7.54c-.72 2.15-2.07 3.87-3.77 4.93zM12 20c-3.31 0-6.22-1.99-7.41-4.8A7.967 7.967 0 0112 4c3.31 0 6.22 1.99 7.41 4.8A7.967 7.967 0 0112 20z" />
    </svg>
  ) },
  python: { label: "Python", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ) },
  web: { label: "Web", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ) },
  react: { label: "React", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C9.8 2 7.7 2.9 6 4.4 4.1 6.1 3 8.8 3 12s1.1 5.9 3 7.6C7.7 21.1 9.8 22 12 22s4.3-.9 6-2.4c1.9-1.7 3-4.4 3-7.6s-1.1-5.9-3-7.6C16.3 2.9 14.2 2 12 2z" />
    </svg>
  ) },
  csharp: { label: "C#", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ) },
  misc: { label: "Miscellaneous", icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  ) },
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
