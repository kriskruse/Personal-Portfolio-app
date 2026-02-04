import NavBar from "@/app/components/NavBar";
import ContentBox from "@/app/components/ContentBox";
import MetaBallsController from "@/app/components/MetaBallsController";
import Section from "@/app/components/Section";
import ScrollDownArrow from "@/app/components/ScrollDownArrow";
import ProjectCardGroup from "@/app/components/ProjectCardGroup";
import WelcomeMessage from "@/app/components/WelcomeMessage";
import { PROJECTS } from "@/app/lib/projects";

export default function Home() {
  return (
    <>
      <NavBar/>
      <MetaBallsController/>
      <ScrollDownArrow/>

      <main>
        <Section id="home">
          <ContentBox>
            <WelcomeMessage />
          </ContentBox>
        </Section>

        <Section id="about">
          <ContentBox>
            <h2 className="text-4xl font-semibold">About</h2>
            <p className="mt-4">A short about section on the same page.</p>
          </ContentBox>
        </Section>

        <Section id="projects">
          <ContentBox>
            <h2 className="text-4xl font-semibold">Projects</h2>
            <p className="mt-4">Brief projects summary.</p>
            <ProjectCardGroup projects={PROJECTS} />
          </ContentBox>
        </Section>

        <Section id="resume">
          <ContentBox>
            <h2 className="text-4xl font-semibold">Resume</h2>
            <p className="mt-4">Download or view my resume here.</p>
          </ContentBox>
        </Section>
      </main>
    </>
  );
}
