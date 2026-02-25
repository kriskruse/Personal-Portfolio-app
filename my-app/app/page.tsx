import NavBar from "@/app/components/NavBar";
import ContentBox from "@/app/components/ContentBox";
import MetaBallsController from "@/app/components/MetaBallsController";
import Section from "@/app/components/Section";
import ScrollDownArrow from "@/app/components/ScrollDownArrow";
import WelcomeMessage from "@/app/components/WelcomeMessage";
import Changelog from "@/app/components/Changelog";
import ProjectsSection from "@/app/components/projects/ProjectsSection";

export default function Home() {
  return (
    <>
      <NavBar/>
      <MetaBallsController mode="combined"/>
      <ScrollDownArrow/>

      <main>
        <Section id="home">
          <ContentBox bounce>
            <WelcomeMessage/>
          </ContentBox>
        </Section>

        <Section id="about">
          <ContentBox>
            <h2 className="text-4xl font-semibold">About</h2>
            <p className="mt-4">A short about section on the same page.</p>
          </ContentBox>
        </Section>

        <Section id="projects">
          <ContentBox mask>
            <h2 className="text-4xl font-semibold">Projects</h2>
            <p className="standard-text">
              Here is a selection of some of my more finished and notable projects. Each project is a new adventure
              where I get to apply my skills and learn something new. Feel free to explore and reach out if you have
              any questions, ideas, feedback or just want to collaborate on a new or old project!
            </p>
            <ProjectsSection/>
          </ContentBox>
        </Section>

        <Section id="work">
          <ContentBox>
            <h2 className="text-4xl font-semibold">Work</h2>
            <p className="mt-4">This section will include some more professional experience</p>
          </ContentBox>
        </Section>

        <Section id="changelog">
          <ContentBox>
            <Changelog />
          </ContentBox>
        </Section>
      </main>
    </>
  );
}
