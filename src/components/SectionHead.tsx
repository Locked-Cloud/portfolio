interface SectionHeadProps {
  index: string;
  title: string;
  note?: string;
}

/** tmux-pane section header: box-drawn index rail, glowing mono title. */
export function SectionHead({ index, title, note }: SectionHeadProps) {
  return (
    <div data-reveal className="mb-10">
      <p className="text-[11px] tracking-[0.24em] text-fog">
        <span className="text-phos">┌─[</span> {index} <span className="text-phos">]─</span>
        {note ? <span className="ml-3 text-fog/70"># {note}</span> : null}
      </p>
      <h2 className="glow mt-2.5 font-display text-3xl font-bold tracking-tight text-phos-bright sm:text-4xl">
        {title}
      </h2>
      <p
        aria-hidden
        className="mt-3 select-none overflow-hidden whitespace-nowrap text-[11px] leading-none text-phos/25"
      >
        ────────────────────────────────────────────────────────────────────────────────────────────────
      </p>
    </div>
  );
}

/** Khayamiya seam — gold triangles, kept from the Neo-Bazaar identity. */
export function Khayamiya() {
  const triangles = Array.from({ length: 60 }, (_, i) => i);
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 16"
      preserveAspectRatio="none"
      className="block h-3 w-full text-gold/25"
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
