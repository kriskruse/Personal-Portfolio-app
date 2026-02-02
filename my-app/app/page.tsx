import TopNav from "@/app/components/TopNav";
import ContentBox from "@/app/components/ContentBox";
import MetaBallsController from "@/app/components/MetaBallsController";

export default function Home() {
  return (
    <><TopNav/>
      <div className="flex min-h-screen items-center justify-center">
        <MetaBallsController />
        <main className="">
          <ContentBox>
            <h1 className="text-8xl font-bold text-zinc-900 dark:text-zinc-100 text-outline-black">
              Welcome to <span className="text-blue-600">Next.js!</span>
            </h1>
          </ContentBox>
        </main>
      </div>

      <div id="stop-section" className="flex min-h-screen items-center justify-center">
        <ContentBox>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            This is a starter template for a Next.js project with TypeScript, Tailwind CSS, and some
            pre-built components.
          </p>
        </ContentBox>
      </div>
    </>
  );
}
