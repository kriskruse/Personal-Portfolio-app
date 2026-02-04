export const SECTIONS = [
  {id: "home", label: "Home"},
  {id: "about", label: "About"},
  {id: "projects", label: "Projects"},
  {id: "resume", label: "Resume"},
  {id: "work", label: "Work"},
] as const;

export type Section = (typeof SECTIONS)[number];
export type SectionId = Section["id"];
