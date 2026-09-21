import { journey, graveyard } from "../data/content";
import { SectionHead } from "./SectionHead";

export default function Journey() {
  return (
    <section id="log" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead index="03 — LOG" title="GIT LOG — JOURNEY" note="press j to scroll, like a pro" />

      <div className="panel p-6 sm:p-8" data-reveal>
        <p className="text-[11px] tracking-[0.2em] text-fog">
          ibrahim@sys:~$ <span className="text-phos">git log --oneline --reverse</span>
        </p>
        <ol className="mt-5 space-y-0">
          {journey.map((j, i) => (
            <li key={j.hash} className="relative flex gap-4 pb-7 pl-1 last:pb-0">
              {/* graph rail */}
              <div aria-hidden className="flex flex-col items-center">
                <span className={`mt-1 block h-2.5 w-2.5 rotate-45 border ${i === journey.length - 1 ? "border-phos bg-phos" : "border-phos bg-bg"}`} />
                {i < journey.length - 1 && <span className="w-px grow bg-phos/20" />}
              </div>
              <div className="pb-1">
                <p className="text-[13px] leading-snug">
                  <span className="text-phos">{j.hash}</span>{" "}
                  <span className="text-fog">{j.year}</span>{" "}
                  <span className="font-semibold text-mint">{j.title}</span>
                </p>
                <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-mint/60">
                  {j.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[11px] text-fog/60">
          <span className="text-phos">(HEAD → main)</span> still committing
        </p>
      </div>

      {/* ~/graveyard — the kill-list. deletions are decisions. */}
      <div className="panel mt-5 p-6 sm:p-8" data-reveal>
        <p className="text-[11px] tracking-[0.2em] text-fog">
          ibrahim@sys:~$ <span className="text-phos">git log --diff-filter=D --summary</span>
        </p>
        <ul className="mt-3 space-y-2">
          {graveyard.map((g) => (
            <li key={g.name} className="text-[12.5px] leading-snug">
              <span className="text-danger">✗</span> <span className="text-mint">{g.name}</span>{" "}
              <span className="text-fog/60">— killed {g.killed}</span>
              <p className="pl-4 text-[12px] text-fog">{g.reason}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-fog/60">
          deletions are decisions — every kill has a reason on record.
        </p>
      </div>
    </section>
  );
}
