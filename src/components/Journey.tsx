import { journey } from "../data/content";
import { SectionHead } from "./SectionHead";

export default function Journey() {
  return (
    <section id="journey" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <SectionHead arabic="الرحلة" kicker="The road so far" title="From calculators to real-time 3D" />

      <ol className="relative ml-3 border-l-2 border-ink/15">
        {journey.map((stop, i) => (
          <li
            key={stop.year}
            data-reveal
            style={{ transitionDelay: `${i * 90}ms` }}
            className="relative pb-10 pl-8 last:pb-0"
          >
            <span
              aria-hidden
              className="absolute -left-[9px] top-1.5 block h-4 w-4 rounded-full border-2 border-sand bg-terracotta"
            />
            <p className="font-display text-sm font-bold uppercase tracking-widest text-gold">
              {stop.year}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold">{stop.title}</h3>
            <p className="mt-1.5 max-w-2xl leading-relaxed text-ink/65">{stop.note}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
