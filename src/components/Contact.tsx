import { GITHUB_URL } from "../data/content";
import { Khayamiya } from "./SectionHead";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 bg-ink text-sand">
      <div className="text-sand/25">
        <Khayamiya />
      </div>
      <div className="mx-auto max-w-4xl px-5 py-24 text-center">
        <p data-reveal className="font-arabic text-4xl text-gold">
          نتكلّم؟
        </p>
        <h2
          data-reveal
          style={{ transitionDelay: "90ms" }}
          className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          Let's build something that
          <br />
          feels like <span className="text-terracotta">Cairo</span>.
        </h2>
        <p
          data-reveal
          style={{ transitionDelay: "180ms" }}
          className="mx-auto mt-6 max-w-xl leading-relaxed text-sand/65"
        >
          Open to internships and junior front-end roles — Cairo or remote.
          The fastest way to reach me is email; the code is one click away.
        </p>

        <div
          data-reveal
          style={{ transitionDelay: "260ms" }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {/* TODO: replace mailto with your real address */}
          <a
            href="mailto:you@example.com"
            className="rounded-full bg-terracotta px-8 py-3 font-display font-semibold text-sand shadow-lg shadow-terracotta/25 transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
          >
            Email me
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border-2 border-sand/20 px-8 py-2.5 font-display font-semibold transition-colors hover:border-gold hover:text-gold"
          >
            GitHub ↗
          </a>
          {/* TODO: add your LinkedIn URL */}
          <a
            href="#contact"
            className="rounded-full border-2 border-sand/20 px-8 py-2.5 font-display font-semibold transition-colors hover:border-gold hover:text-gold"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </section>
  );
}
