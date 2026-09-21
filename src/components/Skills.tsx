import { skillGroups } from "../data/content";
import { SectionHead } from "./SectionHead";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead index="02 — SKILLS" title="THE TOOLBOX" note="cat /usr/bin/ibrahim" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g) => (
          <div key={g.title} data-reveal className="panel p-6 transition-colors hover:border-phos/45">
            <h3 className="text-[12px] font-semibold tracking-[0.22em] text-mint">
              /{g.title.toLowerCase()}
            </h3>
            <ul className="mt-4 space-y-2">
              {g.skills.map((s) => (
                <li key={s} className="flex items-start gap-2 text-[12.5px] text-mint/70">
                  <span aria-hidden className="text-phos">▸</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
