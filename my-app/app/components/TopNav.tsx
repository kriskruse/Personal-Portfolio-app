import Link from "next/link";
import ContentBox from "@/app/components/ContentBox";

export default function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <ContentBox>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">

            {/* Logo or Site Title */}
            <div className="flex items-center">
              <span className="text-purple-600 font-extrabold text-4xl">KRBK</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-2 mr-[5%]">
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-zinc-900 dark:text-zinc-100 hover:bg-purple-600 hover:text-white transition-colors"
              >
                {/* Home icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9.75L12 3l9 6.75M4.5 10.5v8.25A2.25 2.25 0 006.75 21h10.5A2.25 2.25 0 0019.5 18.75V10.5"
                  />
                </svg>
                Home
              </Link>

              <Link
                href="/about"
                className="flex items-center px-3 py-2 rounded-md text-zinc-900 dark:text-zinc-100 hover:bg-purple-600 hover:text-white transition-colors"
              >
                {/* Info icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75M12 17.25h.008v.008H12V17.25zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About
              </Link>

              <Link
                href="/projects"
                className="flex items-center px-3 py-2 rounded-md text-zinc-900 dark:text-zinc-100 hover:bg-purple-600 hover:text-white transition-colors"
              >
                {/* Folder / Projects icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h4.5l1.5 2.25h8.25A1.5 1.5 0 0119.5 10.5v7.5A1.5 1.5 0 0118 19.5H6a1.5 1.5 0 01-1.5-1.5V6.75z"
                  />
                </svg>
                Projects
              </Link>

              <Link
                href="/resume"
                className="flex items-center px-3 py-2 rounded-md text-zinc-900 dark:text-zinc-100 hover:bg-purple-600 hover:text-white transition-colors"
              >
                {/* Document / Resume icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6M7.5 3h9l3 3v12a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 017.5 18V4.5A1.5 1.5 0 019 3z"
                  />
                </svg>
                Resume
              </Link>

              <Link
                href="/github"
                className="flex items-center px-3 py-2 rounded-md text-zinc-900 dark:text-zinc-100 hover:bg-purple-600 hover:text-white transition-colors"
              >
                {/* GitHub icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                  aria-hidden
                >
                  <path
                    d="M12 .5C5.73.5.75 5.48.75 11.74c0 4.95 3.22 9.14 7.69 10.62.56.1.76-.24.76-.53 0-.26-.01-1.12-.02-2.03-3.13.68-3.79-1.51-3.79-1.51-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .17 1.58-.75 1.58-.75.99-1.7 2.6-1.21 3.24-.93.1-.73.39-1.21.71-1.49-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.15-3.03-.12-.29-.5-1.47.11-3.06 0 0 .95-.31 3.12 1.16a10.8 10.8 0 012.84-.39c.96 0 1.92.13 2.84.39 2.17-1.47 3.12-1.16 3.12-1.16.61 1.59.23 2.77.11 3.06.71.79 1.15 1.8 1.15 3.03 0 4.32-2.64 5.26-5.15 5.55.4.35.75 1.05.75 2.12 0 1.53-.01 2.76-.01 3.13 0 .29.2.64.77.53 4.46-1.49 7.68-5.68 7.68-10.62C23.25 5.48 18.27.5 12 .5z"/>
                </svg>
                Github
              </Link>
            </nav>
          </div>
        </div>

      </ContentBox>
    </header>
  );
}