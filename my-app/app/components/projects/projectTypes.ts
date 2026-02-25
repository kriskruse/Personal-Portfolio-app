import { ReactNode } from "react";

// Raw project data from JSON (no React nodes, fully serializable)
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  icon?: string; // icon key string
  main_language: string;
  group_size: number;
}

// Project with resolved icon (for rendering)
export interface Project extends Omit<ProjectData, "icon"> {
  icon?: ReactNode;
}


