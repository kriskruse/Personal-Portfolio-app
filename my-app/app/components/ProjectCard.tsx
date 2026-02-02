"use client";

import { Project } from "@/app/lib/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, description, link, tags, icon } = project;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 bg-white/60 dark:bg-zinc-800/60 rounded-xl shadow-md backdrop-blur-sm hover:shadow-lg hover:bg-white/80 dark:hover:bg-zinc-700/60 transition-all duration-200 hover:scale-[1.02]"
    >
      {/* Icon + Title row */}
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
            {icon}
          </span>
        )}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
        {description}
      </p>

      {/* Tags and Link hint row */}
      <div className="flex items-center justify-between gap-4">
        {/* Tags - left side, can wrap to multiple rows */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 flex-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Link hint - right side, vertically centered */}
        <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
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
      </div>
    </a>
  );
}
