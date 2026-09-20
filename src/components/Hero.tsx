import { GITHUB_URL } from "../data/content";

const focusAreas = ["Real-time 3D", "SaaS products", "Edge ML", "Arabic-first UX"];

export default function Hero() {
  return (
    <section
      id="top"
      className="lattice relative flex min-h-[94vh] items-center overflow-hidden pt-24"
    >
      {/* warm glows */}
      <div
        aria-hidden
        className="glow absolute -top-32 right-[8%] h-96 w-96 rounded-full bg-gold/25 blur-3xl"
      />
      <div
        aria-hidden
        className="glow absolute bottom-0 left-[4%] h-80 w-80 rounded-full bg-teal/20 blur-3xl"
      />
      {/* arabic backdrop accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-6 top-28 select-none font-arabic text-[16vw] leading-none text-terracotta/10 md:top-24 md:text-[9rem]"
      >
        من القاهرة
      </span>

      <div className="relative mx-auto w-full max-w-6xl px-5">
        <p
          data-reveal
          className="mb-5 font-display text-sm font-medium uppercase tracking-[0.25em] text-teal"
        >
          Front-end engineer · Cairo, Egypt 🇪🇬
        </p>

        <h1
          data-reveal
          style={{ transitionDelay: "80ms" }}
          className="max-w-4xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
        >
          I build interfaces that feel like{" "}
          <span className="relative whitespace-nowrap text-terracotta">
            Cairo
            <svg
              aria-hidden
              viewBox="0 0 120 12"
              preserveAspectRatio="none"
              className="absolute -bottom-2 left-0 h-3 w-full text-gold"
            >
              <path
                d="M2 8 Q 30 2 60 7 T 118 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          , not California.
        </h1>

        <p
          data-reveal
          style={{ transitionDelay: "160ms" }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-ink/70"
        >
          Real-time 3D web, SaaS products, and machine learning that runs on
          $45 hardware — from sensor firmware to the last pixel.{" "}
          <span className="font-arabic text-base text-teal">
            نفس الروح، شكل جديد.
          </span>
        </p>

        <div
          data-reveal
          style={{ transitionDelay: "240ms" }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <a
            href="#work"
            className="rounded-full bg-terracotta px-7 py-3 font-display font-semibold text-sand shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
          >
            See the work
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-ink/15 px-7 py-2.5 font-display font-semibold transition-colors hover:border-ink hover:text-terracotta"
          >
            GitHub ↗
          </a>
        </div>

        <ul
          data-reveal
          style={{ transitionDelay: "320ms" }}
          className="mt-10 flex flex-wrap gap-2.5"
        >
          {focusAreas.map((f) => (
            <li
              key={f}
              className="rounded-full border border-ink/15 bg-card/70 px-4 py-1.5 text-sm font-medium text-ink/75"
            >
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div
        aria-hidden
        className="scroll-cue absolute bottom-6 left-1/2 -translate-x-1/2 text-ink/40"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
