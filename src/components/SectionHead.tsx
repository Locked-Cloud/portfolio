interface SectionHeadProps {
  arabic: string;
  kicker: string;
  title: string;
  inverted?: boolean;
}

export function SectionHead({ arabic, kicker, title, inverted }: SectionHeadProps) {
  return (
    <div data-reveal className="mb-14">
      <div className="flex items-baseline gap-4">
        <span className="font-arabic text-2xl text-gold">{arabic}</span>
        <span
          className={`font-display text-xs font-semibold uppercase tracking-[0.3em] ${
            inverted ? "text-teal" : "text-teal"
          }`}
        >
          {kicker}
        </span>
      </div>
      <h2
        className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl ${
          inverted ? "text-sand" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

/** Khayamiya triangle divider — tentmaker appliqué pattern as a section seam. */
export function Khayamiya({ className = "" }: { className?: string }) {
  const triangles = Array.from({ length: 60 }, (_, i) => i);
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 16"
      preserveAspectRatio="none"
      className={`block h-4 w-full ${className}`}
    >
      {triangles.map((i) => (
        <polygon
          key={i}
          points={`${i * 24},16 ${i * 24 + 12},0 ${i * 24 + 24},16`}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
