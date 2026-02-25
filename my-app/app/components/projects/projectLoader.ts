// Server-only file for loading projects from JSON files
import path from "node:path";
import * as fs from "node:fs";
import { ProjectData } from "./projectTypes";

export function loadProjects(): ProjectData[] {
  try {
    const projectsDir = path.join(process.cwd(), "app/data/projects");
    const files = fs.readdirSync(projectsDir).filter(f => f.endsWith(".json"));

    return files.map(file => {
      const content = fs.readFileSync(path.join(projectsDir, file), "utf-8");
      return JSON.parse(content) as ProjectData;
    });
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

