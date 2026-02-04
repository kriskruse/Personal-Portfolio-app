"use client";

export default function ContentBox({children}: { children: React.ReactNode }) {
  return (
    <div
      className="content-box mx-auto p-6 bg-white/50 dark:bg-zinc-900/80 rounded-lg shadow-lg backdrop-blur-sm w-[60%] my-[10vh] max-h-[80vh] overflow-y-auto"
    >
      {children}
    </div>
  );
}