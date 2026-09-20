import { statClaims } from "../data/content";

const chipStyles: Record<string, string> = {
  record: "border-phos/40 text-phos",
  measured: "border-gold/50 text-gold",
  "by-design": "border-fog/40 text-fog",
};

export default function Stats({ repos }: { repos: number }) {
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4">
      <div className="grid grid-cols-2 gap-px border border-phos/15 bg-phos/10 md:grid-cols-4">
        {statClaims.map((s, i) => (
          <div key={s.label} data-reveal className="bg-bg2 px-6 py-7">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] tracking-[0.22em] text-fog">{s.label}</p>
              <span className={`tag shrink-0 ${chipStyles[s.chip]}`}>[{s.chip}]</span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-phos sm:text-4xl">
              {i === 0 ? repos : s.value}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-fog/70">{s.source}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
