const GLYPHS = { up: "↑", down: "↓", left: "←", right: "→" } as const;

export function Arrow({
  dir,
  className = "",
}: {
  dir: keyof typeof GLYPHS;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`font-display inline-block font-bold leading-none ${className}`}
    >
      {GLYPHS[dir]}
    </span>
  );
}

export function SwipeArrows({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`font-display inline-flex items-center gap-2 font-bold leading-none ${className}`}
    >
      {GLYPHS.left}
      {GLYPHS.right}
    </span>
  );
}
