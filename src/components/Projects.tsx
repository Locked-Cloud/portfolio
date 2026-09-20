import { featuredProjects, moreProjects, type Project } from "../data/content";
import { SectionHead } from "./SectionHead";

const statusStyles: Record<NonNullable<Project["status"]>, string> = {
  LIVE: "border-phos/50 text-phos",
  WIP: "border-gold/60 text-gold",
  PRIV: "border-fog/40 text-fog",
};

function ProjectCard({ p, delay }: { p: Project; delay: number }) {
  return (
    <article
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className="panel group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-phos/45"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] tracking-[0.2em] text-fog">
          {p.index} · {p.year ?? "—"}
        </span>
        {p.status && <span className={`tag ${statusStyles[p.status]}`}>{p.status}</span>}
      </div>

      <h3 className="mt-3 font-display text-xl font-bold tracking-wide text-mint group-hover:text-phos-bright">
        {p.link ? (
          <a href={p.link} target="_blank" rel="noreferrer">
            {p.title} <span className="text-phos">↗</span>
          </a>
        ) : (
          p.title
        )}
      </h3>
      {p.arabic && <p className="mt-0.5 font-arabic text-sm text-gold/80">{p.arabic}</p>}
      <p className="mt-1 text-[12px] tracking-wide text-phos">{p.tagline}</p>

      <p className="mt-3.5 flex-1 text-[13px] leading-relaxed text-mint/65">{p.description}</p>

      {p.metrics && (
        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-phos/12 pt-4">
          {p.metrics.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-sm font-bold text-gold">{m.value}</dd>
              <dt className="text-[10px] tracking-wider text-fog/70">{m.label}</dt>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-fog">
        {p.tech.join(" · ")}
      </p>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead index="01 — WORK" title="SHIPPED SYSTEMS" note="selected" arabic="الأعمال" />

      <div className="grid gap-5 md:grid-cols-2">
        {featuredProjects.map((p, i) => (
          <ProjectCard key={p.id} p={p} delay={i * 90} />
        ))}
      </div>

      <div className="panel mt-6 p-6" data-reveal>
        <p className="text-[11px] tracking-[0.2em] text-fog">
          ibrahim@cairo:~$ <span className="text-phos">ls -la ~/more</span>
        </p>
        <ul className="mt-4 divide-y divide-phos/8">
          {moreProjects.map((p) => (
            <li key={p.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
              {p.link ? (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] font-semibold text-mint hover:text-phos"
                >
                  {p.title} ↗
                </a>
              ) : (
                <span className="text-[13px] font-semibold text-mint">{p.title}</span>
              )}
              <span className="text-[12px] text-fog">{p.tagline}</span>
              <span className="ml-auto text-[11px] text-fog/60">
                {p.tech.join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
