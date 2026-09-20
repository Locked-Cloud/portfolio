import { useEffect, useState } from "react";
import { featuredProjects, moreProjects, type Project } from "../data/content";
import { SectionHead } from "./SectionHead";

const statusStyles: Record<NonNullable<Project["status"]>, string> = {
  LIVE: "border-phos/50 text-phos",
  WIP: "border-gold/60 text-gold",
  PRIV: "border-fog/40 text-fog",
};

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
        <button type="button" className="btn gold" onClick={onClose}>
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
            className="aspect-[16/9] w-full border border-phos/15 object-cover"
          />
          {p.gallery && (
            <span className="tag absolute mt-2 ml-2 border-phos/40 bg-bg/80 text-phos">
              {p.gallery.length} images
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
      {p.arabic && (
        <p dir="rtl" lang="ar" className="mt-0.5 font-arabic text-sm text-gold/80">
          {p.arabic}
        </p>
      )}
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

type Gallery = NonNullable<Project["gallery"]>;

export default function Projects() {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [gIdx, setGIdx] = useState(0);

  return (
    <section id="work" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead index="01 — WORK" title="SHIPPED SYSTEMS" note="selected" arabic="الأعمال" />

      <div className="grid gap-5 md:grid-cols-2">
        {featuredProjects.map((p) => (
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
