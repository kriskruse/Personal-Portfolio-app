"use client";

export interface ContentBoxProps {
  children: React.ReactNode;
  /** Enable bounce mode collision for this content box */
  bounce?: boolean;
  /** Enable mask mode for this content box */
  mask?: boolean;
}

export default function ContentBox({ children, bounce, mask }: ContentBoxProps) {
  return (
    <div
      {...(bounce ? { "data-metaball-bounce": true } : {})}
      {...(mask ? { "data-metaball-mask": true } : {})}
      className="content-box mx-auto p-6 bg-zinc-600/50 rounded-lg shadow-lg backdrop-blur-sm
      w-[60%] my-[10vh] max-h-[80vh] overflow-y-auto"
    >
      {children}
    </div>
  );
}