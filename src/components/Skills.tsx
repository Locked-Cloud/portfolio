import { skillGroups } from "../data/content";
import { SectionHead } from "./SectionHead";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 bg-ink py-24 text-sand">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead arabic="المهارات" kicker="Toolbox" title="What I build with" inverted />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((g, i) => (
            <div
              key={g.title}
              data-reveal
              style={{ transitionDelay: `${i * 100}ms` }}
              className="rounded-2xl border border-sand/10 bg-ink-soft p-6 transition-colors hover:border-gold/40"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-bold">{g.title}</h3>
                <span className="font-arabic text-base text-gold">{g.arabic}</span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {g.skills.map((s) => (
                  <li key={s} className="flex items-start gap-2.5 text-sm text-sand/75">
                    <span aria-hidden className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
