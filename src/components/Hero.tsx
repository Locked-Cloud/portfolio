import { useRef } from "react";
import Terminal from "./Terminal";
import { GITHUB_URL } from "../data/content";

export default function Hero() {
  const termInput = useRef<HTMLInputElement>(null);

  return (
    <section id="top" className="relative z-10 mx-auto mt-6 max-w-6xl scroll-mt-24 px-4 pt-6">
      <div data-reveal>
        <Terminal inputRef={termInput} />
      </div>

      {/* the quiet human row — one warm element: the availability chip */}
      <div
        data-reveal
        className="mt-8 flex flex-col items-center justify-between gap-5 px-2 md:flex-row"
      >
        <div className="flex items-center gap-4">
          <h2 className="font-display text-xl font-bold tracking-tight text-mint">I. AHMED</h2>
          <div className="h-4 w-px bg-phos/20" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-fog">
            Cairo, Egypt <span className="text-gold">//</span> developer
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="#work"
            className="text-[11px] uppercase tracking-[0.2em] text-phos transition-colors hover:text-phos-bright"
          >
            selected_work
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] uppercase tracking-[0.2em] text-phos transition-colors hover:text-phos-bright"
          >
            github_profile
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3.5 py-1.5"
          >
            <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-gold">
              open to work
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
