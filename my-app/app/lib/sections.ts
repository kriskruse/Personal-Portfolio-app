export const Sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "github", label: "Github" },
] as const;

export type Section = (typeof Sections)[number];
export type SectionId = Section["id"];
