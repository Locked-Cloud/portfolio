import { useEffect, useRef, useState } from "react";
import Terminal from "./Terminal";
import { typedRoles, GITHUB_URL } from "../data/content";

function useTypedRole(): string {
  const [text, setText] = useState("");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(typedRoles[0]);
      return;
    }
    let role = 0;
    let char = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const current = typedRoles[role];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));
      let delay = deleting ? 32 : 62;
      if (!deleting && char === current.length) {
        deleting = true;
        delay = 1900;
      } else if (deleting && char === 0) {
        deleting = false;
        role = (role + 1) % typedRoles.length;
        delay = 420;
      }
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, []);
  return text;
}

export default function Hero() {
  const typed = useTypedRole();
  const termInput = useRef<HTMLInputElement>(null);

  return (
    <section id="top" className="relative z-10 mx-auto mt-14 max-w-6xl scroll-mt-24 px-4">
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        {/* ── operator file ── */}
        <div className="panel flex flex-col p-7 sm:p-9" data-reveal>
          <pre aria-hidden className="mb-6 text-[11.5px] leading-relaxed text-fog/80">
{`const self = {
  compile: "nightly",
  latency: "low",
  trust: "zero-assume"
};`}
          </pre>

          <p className="mb-3 text-[11px] tracking-[0.3em] text-fog">
            DEVELOPER FILE <span className="text-gold">//</span> 2026
          </p>
          <h1
            className="glitch font-display text-4xl font-bold tracking-tight text-mint sm:text-6xl"
            data-text="IBRAHIM AHMED"
          >
            IBRAHIM AHMED
          </h1>

          <p className="mt-4 min-h-[1.6em] text-[15px] text-phos">
            <span aria-live="polite">{typed}</span>
            <span className="cursor-blink" aria-hidden />
          </p>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-mint/70">
            I build interfaces that feel like <span className="text-terra">Cairo</span>, not
            California — real-time 3D web, SaaS products, and ML that runs on $45
            hardware.{" "}
            <span className="font-arabic text-phos/80">نفس الروح، شكل جديد.</span>
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#work" className="btn solid">view work</a>
            <a href="#contact" className="btn">init contact</a>
            <button type="button" className="btn gold" onClick={() => termInput.current?.focus()}>
              open shell
            </button>
          </div>

          <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-phos/15 pt-5 text-[11px] tracking-widest text-fog">
            <div>
              <dt>LOC</dt>
              <dd className="mt-1 text-[13px] text-mint">Cairo, EG</dd>
            </div>
            <div>
              <dt>FOCUS</dt>
              <dd className="mt-1 text-[13px] text-mint">3D · SaaS · ML</dd>
            </div>
            <div>
              <dt>UPTIME</dt>
              <dd className="mt-1 text-[13px] text-mint">3+ yrs</dd>
            </div>
          </dl>
        </div>

        {/* ── the shell ── */}
        <div data-reveal style={{ transitionDelay: "120ms" }} className="min-h-[420px]">
          <Terminal inputRef={termInput} />
        </div>
      </div>

      <p className="mt-6 text-center text-[11px] tracking-[0.2em] text-fog/60">
        THE SHELL IS REAL — TRY <span className="text-phos">help</span> ·{" "}
        <span className="text-phos">projects</span> ·{" "}
        <span className="text-phos">sudo make me a job</span>
      </p>

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="sr-only"
      >
        GitHub profile
      </a>
    </section>
  );
}
