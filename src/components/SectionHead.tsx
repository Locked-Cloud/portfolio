interface SectionHeadProps {
  index: string;
  title: string;
  note?: string;
  arabic?: string;
}

export function SectionHead({ index, title, note, arabic }: SectionHeadProps) {
  return (
    <div data-reveal className="mb-10">
      <p className="text-[11px] tracking-[0.3em] text-fog">
        <span className="text-gold">//</span> {index}
        {note ? <span className="ml-3 text-fog/60">{note}</span> : null}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl font-bold tracking-tight text-mint sm:text-4xl">
          {title}
        </h2>
        {arabic && (
          <span dir="rtl" lang="ar" className="font-arabic text-xl text-gold/90">
            {arabic}
          </span>
        )}
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-phos/40 via-phos/10 to-transparent" />
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
