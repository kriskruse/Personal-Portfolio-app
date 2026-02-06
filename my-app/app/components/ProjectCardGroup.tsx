import ProjectCard from "@/app/components/ProjectCard";
import { Project, groupProjectsByCategory, CATEGORY_INFO } from "@/app/lib/projects";

interface ProjectCardGroupProps {
  projects: Project[];
}

export default function ProjectCardGroup({ projects }: ProjectCardGroupProps) {
  const grouped = groupProjectsByCategory(projects);
  const categories = Object.keys(grouped);

  return (
    <div className="space-y-8 mt-6">
      {categories.map((category) => {
        const info = CATEGORY_INFO[category] || { label: category, icon: null };
        const categoryProjects = grouped[category];

        return (
          <div key={category}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 flex items-center justify-center text-zinc-200">
                {info.icon}
              </span>
              <h3 className="text-xl font-semibold text-zinc-200">
                {info.label}
              </h3>
              <span className="text-sm text-zinc-400">
                ({categoryProjects.length} project{categoryProjects.length !== 1 ? "s" : ""})
              </span>
            </div>

            {/* Project cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
