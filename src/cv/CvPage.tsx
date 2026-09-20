import { useEffect } from "react";
import {
  featuredProjects,
  skillGroups,
  journey,
  statClaims,
  GITHUB_URL,
  EMAIL_TODO,
} from "../data/content";

/**
 * One-page printable CV — same identity as the site, inverted for paper:
 * white ground, ink text, teal/gold accents. Ctrl+P → save as PDF.
 */
export default function CvPage() {
  useEffect(() => {
    document.title = "Ibrahim Ahmed — CV";
  }, []);

  return (
    <div className="cv-page mx-auto max-w-[820px] bg-white px-10 py-12 text-ink font-body text-[12.5px] leading-relaxed">
      {/* screen-only toolbar */}
      <div className="mb-8 flex items-center justify-between border-b-2 border-[#1a1512] pb-4 print:hidden">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#7ca394]">
          this page prints on one A4 — Ctrl+P → save as PDF
        </p>
        <div className="flex gap-3">
          <a href="/" className="btn gold no-underline">← site</a>
          <button type="button" className="btn solid" onClick={() => window.print()}>
            print / pdf
          </button>
        </div>
      </div>

      <header className="mb-6 border-b-2 border-[#1a1512] pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#1a1512]">
          IBRAHIM AHMED
        </h1>
        <p className="mt-1 text-[13px] text-[#1f7a70]">
          Front-end Engineer — Cairo, Egypt · real-time 3D web · SaaS · edge ML
        </p>
        <p className="mt-2 text-[11.5px] text-[#5a6b62]">
          {GITHUB_URL.replace("https://", "")} · {EMAIL_TODO} · github.com/Locked-Cloud/Locked-Cloud
        </p>
      </header>

      <section className="mb-6">
        <h2 className="mb-2 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-[#c4552d]">
          Profile
        </h2>
        <p className="max-w-[70ch]">
          Front-end engineer and CS student in Cairo. I build interfaces that feel like Cairo, not
          California — real-time 3D (Three.js), multi-tenant SaaS on $0 infrastructure, and machine
          learning deployed on edge hardware. Comfortable across the whole stack: ESP32 firmware,
          Node/Express and Supabase backends, and React 18/19 frontends in TypeScript.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-[#c4552d]">
          Selected work
        </h2>
        <div className="space-y-4">
          {featuredProjects.map((p) => (
            <article key={p.id} className="grid grid-cols-[86px_1fr] gap-3">
              <p className="pt-0.5 text-[11px] font-semibold text-[#1f7a70]">{p.year}</p>
              <div>
                <h3 className="font-display text-[13.5px] font-bold text-[#1a1512]">
                  {p.title}
                  {p.link && (
                    <span className="ml-2 font-body text-[10.5px] font-normal text-[#1f7a70]">
                      {p.link.replace("https://github.com/Locked-Cloud/", "github.com/…/")}
                    </span>
                  )}
                </h3>
                <p className="mt-0.5 text-[12px] text-[#3a4a42]">{p.description}</p>
                <p className="mt-1 text-[11px] text-[#7ca394]">{p.tech.join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6 break-inside-avoid">
        <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-[#c4552d]">
          Skills
        </h2>
        <dl className="grid grid-cols-[110px_1fr] gap-y-1.5 gap-x-3">
          {skillGroups.map((g) => (
            <div key={g.title} className="col-span-2 grid grid-cols-subgrid">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-[#1a1512]">
                {g.title}
              </dt>
              <dd className="text-[12px] text-[#3a4a42]">{g.skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="break-inside-avoid">
        <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-[#c4552d]">
          Timeline
        </h2>
        <ul className="space-y-1">
          {journey.map((j) => (
            <li key={j.hash} className="grid grid-cols-[86px_1fr] gap-3 text-[12px]">
              <span className="font-semibold text-[#1f7a70]">{j.year}</span>
              <span className="text-[#3a4a42]">
                <strong className="text-[#1a1512]">{j.title}</strong> — {j.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-6 border-t border-[#c9c2b4] pt-3 text-[10.5px] text-[#7ca394]">
        {statClaims.map((s) => s.value).join(" · ")} — sources for every number: run{" "}
        <code>verify</code> in the site terminal · نفس الروح، شكل جديد
      </footer>
    </div>
  );
}
