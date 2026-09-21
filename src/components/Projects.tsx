import { useEffect, useState, type KeyboardEvent } from "react";
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
    const onKey = (e: globalThis.KeyboardEvent) => {
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

/** list-row "file size" — LOC where counted, dash where not */
function fileSize(p: Project): string {
  if (p.id === "pulpoVr") return pulpoLoc.total.replace("~", "");
  if (p.id === "plant-diseases") return "1.7K";
  return "—";
}

/**
 * ~/work as a TUI file manager (ranger-style): select a directory on the
 * left — click or ↑↓ — and the right pane cats its README. Enter opens
 * the source repo. The flagship (first entry) is selected on arrival.
 */
export default function Projects() {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [gIdx, setGIdx] = useState(0);
  const [sel, setSel] = useState(0);
  const p = featuredProjects[sel];

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, featuredProjects.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSel(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSel(featuredProjects.length - 1);
    } else if (e.key === "Enter" && p?.link) {
      window.open(p.link, "_blank", "noreferrer");
    }
  };

  if (!p) return null;

  return (
    <section id="work" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead index="01 — WORK" title="SHIPPED SYSTEMS" note="ranger — pick a file" />

      <div className="panel grid overflow-hidden md:grid-cols-[290px_1fr]" data-reveal>
        {/* ── left: the directory listing ── */}
        <div className="border-b border-phos/15 md:border-b-0 md:border-r">
          <p className="border-b border-phos/10 px-4 py-2.5 text-[10px] tracking-[0.22em] text-fog">
            ~/WORK — {featuredProjects.length} OBJECTS
          </p>
          <ul
            role="listbox"
            aria-label="project files"
            tabIndex={0}
            onKeyDown={onListKey}
            className="terminal-scrollbar outline-none focus-visible:shadow-[inset_0_0_0_1px_rgba(61,255,136,0.5)]"
          >
            {featuredProjects.map((proj, i) => {
              const active = i === sel;
              return (
                <li key={proj.id} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => setSel(i)}
                    className={`flex w-full items-baseline gap-2.5 px-4 py-2.5 text-left text-[12.5px] transition-colors ${
                      active
                        ? "bg-phos font-semibold text-bg"
                        : "text-mint/80 hover:bg-phos/10 hover:text-mint"
                    }`}
                  >
                    <span aria-hidden className="w-3 shrink-0">
                      {active ? "▶" : ""}
                    </span>
                    <span className="truncate">
                      {String(i + 1).padStart(2, "0")}-{proj.id}/
                    </span>
                    <span
                      className={`ml-auto shrink-0 text-[10px] tracking-wider ${
                        active ? "text-bg/70" : "text-fog"
                      }`}
                    >
                      {fileSize(proj).padStart(4)} {proj.year}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-phos/10 px-4 py-2.5 text-[10px] tracking-[0.18em] text-fog">
            ↑↓ SELECT · ENTER OPEN SRC
          </p>
        </div>

        {/* ── right: cat the selected README ── */}
        <div className="p-6 sm:p-8">
          <p className="text-[11px] tracking-[0.2em] text-fog">
            ibrahim@sys:~${" "}
            <span className="text-phos">
              cat ~/work/{String(sel + 1).padStart(2, "0")}-{p.id}/README.md
            </span>
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] tracking-[0.2em] text-fog">
              {p.index} · {p.year ?? "—"}
            </span>
            {p.status && <span className={`tag ${statusStyles[p.status]}`}>{p.status}</span>}
          </div>

          <h3 className="glow mt-3 font-display text-2xl font-bold tracking-wide text-phos-bright">
            {p.link ? (
              <a href={p.link} target="_blank" rel="noreferrer">
                {p.title} <span className="text-phos">↗</span>
              </a>
            ) : (
              p.title
            )}
          </h3>
          <p className="mt-1 text-[13px] tracking-wide text-phos">{p.tagline}</p>

          {p.image && (
            <button
              type="button"
              onClick={() => {
                if (p.gallery) {
                  setGallery(p.gallery);
                  setGIdx(0);
                }
              }}
              className={`relative mt-5 block ${p.gallery ? "cursor-zoom-in" : "cursor-default"}`}
              aria-label={p.gallery ? `open ${p.title} image gallery` : undefined}
            >
              <img
                src={p.image}
                alt={p.imageAlt ?? ""}
                loading="lazy"
                className={`aspect-[16/9] w-full border border-phos/15 object-cover ${p.lift ? "thumb-lift" : ""}`}
              />
              {p.gallery && (
                <span className="tag absolute bottom-3 left-3 border-phos/40 bg-bg/85 text-phos">
                  view gallery ↗
                </span>
              )}
            </button>
          )}

          <p className="mt-5 text-[13px] leading-relaxed text-mint/65">{p.description}</p>

          {/* where the effort went — counted from HEAD, not estimated */}
          {p.id === "pulpoVr" && (
            <div className="mt-6">
              <div aria-hidden className="flex h-2 w-full overflow-hidden border border-phos/20">
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
            </div>
          )}

          <dl className="mt-5 divide-y divide-phos/10 border-t border-phos/12">
            {(p.id === "pulpoVr"
              ? ([
                  ["telemetry", "40 Hz [measured]"],
                  ["codebase", `${pulpoLoc.total} LOC [counted]`],
                  ["layers", "firmware → 3D"],
                  ["license", "MIT"],
                  ["selection", "merit verdict 28/30 — chosen"],
                ] as [string, string][])
              : p.metrics?.map((m) => [m.label, m.value] as [string, string]) ?? []
            ).map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-[10.5px] uppercase tracking-[0.18em] text-fog">{k}</dt>
                <dd className="text-right text-[12.5px] text-mint">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-4 text-[11px] leading-relaxed text-fog">{p.tech.join(" · ")}</p>

          {p.link && (
            <a href={p.link} target="_blank" rel="noreferrer" className="btn solid mt-6">
              view source ↗
            </a>
          )}
        </div>
      </div>

      {gallery && (
        <GalleryModal gallery={gallery} index={gIdx} onIndex={setGIdx} onClose={() => setGallery(null)} />
      )}

      <div className="panel mt-6 p-6" data-reveal>
        <p className="text-[11px] tracking-[0.2em] text-fog">
          ibrahim@sys:~$ <span className="text-phos">ls -la ~/more</span>
        </p>
        <ul className="mt-4 divide-y divide-phos/8">
          {moreProjects.map((m) => (
            <li key={m.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
              {m.link ? (
                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] font-semibold text-mint hover:text-phos"
                >
                  {m.title} ↗
                </a>
              ) : (
                <span className="text-[13px] font-semibold text-mint">{m.title}</span>
              )}
              <span className="text-[12px] text-fog">{m.tagline}</span>
              <span className="ml-auto text-[11px] text-fog/60">{m.tech.join(" · ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type Gallery = NonNullable<Project["gallery"]>;
