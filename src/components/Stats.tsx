import { heroStats } from "../data/content";

export default function Stats() {
  return (
    <section className="bg-ink text-sand">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-5 py-14 md:grid-cols-4">
        {heroStats.map((s, i) => (
          <div
            key={s.label}
            data-reveal
            style={{ transitionDelay: `${i * 90}ms` }}
            className="text-center"
          >
            <p className="font-display text-4xl font-bold text-gold md:text-5xl">
              {s.value}
            </p>
            <p className="mt-2 text-sm uppercase tracking-wider text-sand/60">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
