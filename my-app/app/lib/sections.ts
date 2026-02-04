export const SECTIONS = [
  {id: "home", label: "Home"},
  {id: "about", label: "About"},
  {id: "projects", label: "Projects"},
  {id: "resume", label: "Resume"},
  {id: "work", label: "Work"},
  {id: "changelog", label: "Changelog"},
] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionId = Section["id"];
