import { heroStats } from "../data/content";

export default function Stats({ repos }: { repos: number }) {
  const values = [String(repos), ...heroStats.slice(1).map((s) => s.value)];
  return (
    <section className="mx-auto mt-20 max-w-6xl px-4">
      <div className="grid grid-cols-2 gap-px border border-phos/15 bg-phos/10 md:grid-cols-4">
        {heroStats.map((s, i) => (
          <div
            key={s.label}
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
            className="bg-bg2 px-6 py-7"
          >
            <p className="text-[10px] tracking-[0.22em] text-fog">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-phos sm:text-4xl">
              {values[i]}
            </p>
            <p className="mt-1 text-[11px] text-fog/70">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
