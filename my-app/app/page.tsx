import Image from "next/image";
import TopNav from "@/app/components/TopNav";

export default function Home() {
  return (
      <><TopNav/>
        <div className="flex min-h-screen items-center justify-center">
          <main className="">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Welcome to <span className="text-blue-600">Next.js!</span>
            </h1>
          </main>
        </div>
      </>
  );
}
