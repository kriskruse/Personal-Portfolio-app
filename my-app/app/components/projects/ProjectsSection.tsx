// Server component - loads projects and renders the client ProjectView
import { loadProjects } from "@/app/components/projects/projectLoader";
import ProjectView from "./ProjectView";

export default function ProjectsSection() {
  const projects = loadProjects();

  return <ProjectView projects={projects} />;
}

