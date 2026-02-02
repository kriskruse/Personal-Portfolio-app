


export default function ContentBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto p-6 bg-white/50 dark:bg-zinc-900/50 rounded-lg shadow-lg backdrop-blur-sm">
      {children}
    </div>
  );
}