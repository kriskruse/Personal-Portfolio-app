export default function Background({ className }: { className?: string }) {
  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none ${className ?? ""}`}
      aria-hidden
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        {/* Black base */}
        <rect width="100%" height="100%" fill="#000" />

        {/* Scattered dark-gray balls */}
        <circle cx="8" cy="18" r="6" fill="#1f1f1f" opacity="0.95" />
        <circle cx="25" cy="8" r="4.5" fill="#151515" opacity="0.9" />
        <circle cx="45" cy="20" r="5.5" fill="#1a1a1a" opacity="0.9" />
        <circle cx="70" cy="12" r="3.8" fill="#1f1f1f" opacity="0.85" />
        <circle cx="82" cy="30" r="6.5" fill="#161616" opacity="0.9" />
        <circle cx="60" cy="40" r="4" fill="#121212" opacity="0.8" />
        <circle cx="30" cy="50" r="7" fill="#1b1b1b" opacity="0.9" />
        <circle cx="15" cy="75" r="5" fill="#141414" opacity="0.85" />
        <circle cx="47" cy="72" r="6.5" fill="#181818" opacity="0.9" />
        <circle cx="75" cy="65" r="5" fill="#161616" opacity="0.85" />

        {/* Small purple accent at bottom-right */}
        <circle cx="90" cy="88" r="3.8" fill="#7c3aed" opacity="1" />
        <circle cx="93" cy="92" r="1.6" fill="#a78bfa" opacity="0.9" />
      </svg>
    </div>
  );
}
