import { useEffect, useState } from "react";
import { featuredProjects, moreProjects, pulpoLoc, type Project } from "../data/content";
import { SectionHead } from "./SectionHead";

const statusStyles: Record<NonNullable<Project["status"]>, string> = {
  LIVE: "border-phos/50 text-phos",
  WIP: "border-gold/60 text-gold",
  PRIV: "border-fog/40 text-fog",
};

/* effort-allocation bar colors — index-matched to pulpoLoc.split */
const LOC_COLORS = ["bg-phos/80", "bg-mint/40", "bg-terra/70"];

function GalleryModal({
  gallery,
  index,
  onIndex,
  onClose,
}: {
  gallery: Gallery;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % gallery.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, gallery.length, onClose, onIndex]);

  const item = gallery[index];
  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/85 p-6"
      role="dialog"
      aria-modal="true"
      aria-label="project image gallery"
      onClick={onClose}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="max-h-[72vh] max-w-full border border-phos/30 object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="mt-4 text-[12px] text-fog" onClick={(e) => e.stopPropagation()}>
        {item.alt} — {index + 1}/{gallery.length}
      </p>
      <div className="mt-4 flex gap-3" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn"
          onClick={() => onIndex((index - 1 + gallery.length) % gallery.length)}
        >
          ← prev
        </button>
        <button type="button" className="btn" onClick={onClose}>
          close (esc)
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => onIndex((index + 1) % gallery.length)}
        >
          next →
        </button>
      </div>
    </div>
  );
}

/** The flagship breaks the grid: one full-width case-study row, real evidence. */
function CaseStudy({
  p,
  onGallery,
}: {
  p: Project;
  onGallery: (p: Project) => void;
}) {
  const specs: [string, string][] = [
    ["telemetry", "40 Hz [measured]"],
    ["codebase", `${pulpoLoc.total} LOC [counted]`],
    ["layers", "firmware → 3D"],
    ["license", "MIT"],
    ["selection", "merit verdict 28/30 — chosen"],
  ];
  return (
    <article data-reveal className="panel overflow-hidden">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <button
          type="button"
          onClick={() => onGallery(p)}
          className="group relative block border-b border-phos/15 lg:border-b-0 lg:border-r"
          aria-label={`open ${p.title} image gallery`}
        >
          <img
            src={p.image}
            alt={p.imageAlt ?? ""}
            loading="lazy"
            className="aspect-[16/10] h-full w-full object-cover transition-opacity group-hover:opacity-90"
          />
          <span className="tag absolute bottom-3 left-3 border-phos/40 bg-bg/85 text-phos">
            view gallery ↗
          </span>
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] tracking-[0.2em] text-fog">
              {p.index} · {p.year ?? "—"}
            </span>
            {p.status && <span className={`tag ${statusStyles[p.status]}`}>{p.status}</span>}
          </div>

          <h3 className="mt-3 font-display text-2xl font-bold tracking-wide text-mint">
            <a href={p.link} target="_blank" rel="noreferrer" className="hover:text-phos-bright">
              {p.title} <span className="text-phos">↗</span>
            </a>
          </h3>
          <p className="mt-1 text-[12.5px] tracking-wide text-phos">{p.tagline}</p>
          <p className="mt-3.5 text-[13px] leading-relaxed text-mint/65">{p.description}</p>

          {/* where the effort went — counted from HEAD, not estimated */}
          <div aria-hidden className="mt-6 flex h-2 w-full overflow-hidden border border-phos/20">
            {pulpoLoc.split.map((s, i) => (
              <span key={s.lang} style={{ width: `${s.pct}%` }} className={LOC_COLORS[i]} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {pulpoLoc.split.map((s, i) => (
              <li key={s.lang} className="flex items-center gap-1.5 text-[10.5px] text-fog">
                <i aria-hidden className={`h-2 w-2 ${LOC_COLORS[i]}`} />
                {s.lang} <span className="text-mint/75">{s.loc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[10px] tracking-wider text-fog">loc — {pulpoLoc.source}</p>

          <dl className="mt-5 divide-y divide-phos/10 border-t border-phos/12">
            {specs.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-[10.5px] uppercase tracking-[0.18em] text-fog">{k}</dt>
                <dd className="text-right text-[12.5px] text-mint">{v}</dd>
              </div>
            ))}
          </dl>

          <a href={p.link} target="_blank" rel="noreferrer" className="btn solid mt-6">
            view source ↗
          </a>
        </div>
      </div>
    </article>
  );
}

function ProjectCard({
  p,
  onGallery,
}: {
  p: Project;
  onGallery: (p: Project) => void;
}) {
  return (
    <article
      data-reveal
      className="panel group flex flex-col p-6 transition-colors duration-300 hover:border-phos/45"
    >
      {p.image && (
        <button
          type="button"
          onClick={() => p.gallery && onGallery(p)}
          className={`mb-5 block ${p.gallery ? "cursor-zoom-in" : "cursor-default"}`}
          aria-label={p.gallery ? `open ${p.title} image gallery` : undefined}
        >
          <img
            src={p.image}
            alt={p.imageAlt ?? ""}
            loading="lazy"
            className={`aspect-[16/9] w-full border border-phos/15 object-cover ${p.lift ? "thumb-lift" : ""}`}
          />
          {p.gallery && (
            <span className="tag absolute mt-2 ml-2 border-phos/40 bg-bg/80 text-phos">
              view {p.gallery.length} ↗
            </span>
          )}
        </button>
      )}

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
      <p className="mt-1 text-[12px] tracking-wide text-phos">{p.tagline}</p>

      <p className="mt-3.5 flex-1 text-[13px] leading-relaxed text-mint/65">{p.description}</p>

      {p.metrics && (
        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-phos/12 pt-4">
          {p.metrics.map((m) => (
            <div key={m.label}>
              <dd className="font-display text-sm font-bold text-phos-bright">{m.value}</dd>
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

type Gallery = NonNullable<Project["gallery"]>;

export default function Projects() {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [gIdx, setGIdx] = useState(0);
  const [flagship, ...rest] = featuredProjects;

  return (
    <section id="work" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead index="01 — WORK" title="SHIPPED SYSTEMS" note="selected" />

      {flagship && (
        <CaseStudy
          p={flagship}
          onGallery={(proj: Project) => {
            setGallery(proj.gallery ?? null);
            setGIdx(0);
          }}
        />
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {rest.map((p) => (
          <ProjectCard
            key={p.id}
            p={p}
            onGallery={(proj: Project) => {
              setGallery(proj.gallery ?? null);
              setGIdx(0);
            }}
          />
        ))}
      </div>

      {gallery && (
        <GalleryModal gallery={gallery} index={gIdx} onIndex={setGIdx} onClose={() => setGallery(null)} />
      )}

      <div className="panel mt-6 p-6" data-reveal>
        <p className="text-[11px] tracking-[0.2em] text-fog">
          ibrahim@sys:~$ <span className="text-phos">ls -la ~/more</span>
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
