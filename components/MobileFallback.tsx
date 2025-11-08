"use client";

export default function MobileFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-screen bg-zinc-950 text-white relative">
      <span className="absolute top-4 text-sm text-zinc-400">
        visit on desktop for full experience
      </span>
      <a href="https://l.willwhitehead.com/" className="hover:underline">
        linkedin
      </a>
      <a href="https://g.willwhitehead.com/" className="hover:underline">
        github
      </a>
    </div>
  );
}

