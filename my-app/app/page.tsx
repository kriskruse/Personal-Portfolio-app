import NavBar from "@/app/components/NavBar";
import ContentBox from "@/app/components/ContentBox";
import MetaBallsController from "@/app/components/MetaBallsController";
import Section from "@/app/components/Section";
import ScrollDownArrow from "@/app/components/ScrollDownArrow";

export default function Home() {
  return (
    <>
      <NavBar/>
      <MetaBallsController/>
      <ScrollDownArrow/>

      <main>
        <Section id="home">
          <ContentBox>
            <h1 className="text-8xl font-bold text-zinc-900 dark:text-zinc-100 text-outline-black">
              Welcome to <span className="text-blue-600">Next.js!</span>
            </h1>
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
          </ContentBox>
        </Section>

        <Section id="resume">
          <ContentBox>
            <h2 className="text-4xl font-semibold">Resume</h2>
            <p className="mt-4">Download or view my resume here.</p>
          </ContentBox>
        </Section>

        <Section id="github">
          <ContentBox>
            <h2 className="text-4xl font-semibold">GitHub</h2>
            <p className="mt-4">Links to GitHub projects.</p>
          </ContentBox>
        </Section>
      </main>
    </>
  );
}
