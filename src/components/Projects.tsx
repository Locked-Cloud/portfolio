import { featuredProjects, moreProjects, type Project } from "../data/content";
import { SectionHead } from "./SectionHead";

const statusStyles: Record<NonNullable<Project["status"]>, { label: string; cls: string }> = {
  live: { label: "Live on GitHub", cls: "bg-teal/10 text-teal border-teal/30" },
  "in-progress": { label: "In progress", cls: "bg-gold/15 text-terracotta-deep border-gold/50" },
  private: { label: "Private codebase", cls: "bg-ink/5 text-ink/50 border-ink/15" },
};

function StatusPill({ status }: { status?: Project["status"] }) {
  if (!status) return null;
  const s = statusStyles[status];
  return (
    <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

function FeaturedCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <article
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className="group flex flex-col rounded-2xl border border-ink/10 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-terracotta/40 hover:shadow-xl hover:shadow-terracotta/10"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-3xl font-bold text-gold">
          {project.index}
        </span>
        <StatusPill status={project.status} />
      </div>

      <h3 className="font-display text-xl font-bold leading-snug tracking-tight">
        {project.title}
      </h3>
      {project.arabic && (
        <p className="mt-1 font-arabic text-base text-terracotta">{project.arabic}</p>
      )}
      <p className="mt-1.5 text-sm font-semibold uppercase tracking-wide text-teal">
        {project.tagline}
      </p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
        {project.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <li
            key={t}
            className="rounded-full border border-ink/12 bg-sand px-3 py-1 text-xs font-medium text-ink/70"
          >
            {t}
          </li>
        ))}
      </ul>

      {project.metrics && (
        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-ink/10 pt-4">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-base font-bold text-ink">{m.value}</dd>
              <dt className="text-xs text-ink/55">{m.label}</dt>
            </div>
          ))}
        </dl>
      )}

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-terracotta transition-colors hover:text-terracotta-deep"
        >
          View the repo
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      )}
    </article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <SectionHead arabic="الأعمال" kicker="Featured work" title="Built end to end" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((p, i) => (
          <FeaturedCard key={p.id} project={p} delay={i * 110} />
        ))}
      </div>

      <div data-reveal className="mt-20">
        <div className="flex items-baseline gap-4">
          <span className="font-arabic text-xl text-gold">المزيد</span>
          <h3 className="font-display text-2xl font-bold">More work</h3>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {moreProjects.map((p) => (
            <article
              key={p.id}
              className="group rounded-2xl border border-ink/10 bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40 hover:bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-gold/80">{p.index}</span>
                <StatusPill status={p.status} />
              </div>
              <h4 className="mt-2.5 font-display text-base font-bold leading-snug">
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-terracotta">
                    {p.title} ↗
                  </a>
                ) : (
                  p.title
                )}
              </h4>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-teal">
                {p.tagline}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-ink/65">{p.description}</p>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li key={t} className="text-xs font-medium text-ink/50">
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
