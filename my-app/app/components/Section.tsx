export default function Section({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`min-h-screen flex items-center justify-center ${className}`}>
      {children}
    </section>
  );
}
