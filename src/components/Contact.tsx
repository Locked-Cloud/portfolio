import { useState } from "react";
import { socials, EMAIL_TODO } from "../data/content";
import { SectionHead, Khayamiya } from "./SectionHead";

export default function Contact() {
  const [alias, setAlias] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const mailto = `mailto:${EMAIL_TODO}?subject=${encodeURIComponent(
    `portfolio contact — ${alias || "hello"}`
  )}&body=${encodeURIComponent(message)}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_TODO);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="mt-28">
      <div className="text-gold/30">
        <Khayamiya />
      </div>
      <div className="mx-auto mt-14 max-w-6xl scroll-mt-24 px-4" id="contact-anchor">
        <SectionHead index="06 — CONTACT" title="SECURE CHANNEL" note="open channel, actually" />

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="panel p-6 sm:p-8" data-reveal>
            <label className="text-[10px] tracking-[0.22em] text-fog" htmlFor="alias">
              ALIAS
            </label>
            <input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="your name"
              className="mt-1.5 mb-5 w-full border border-phos/20 bg-transparent px-3.5 py-2.5 text-[13px] text-mint outline-none transition-colors placeholder:text-fog focus:border-phos/60"
            />
            <label className="text-[10px] tracking-[0.22em] text-fog" htmlFor="payload">
              PAYLOAD
            </label>
            <textarea
              id="payload"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="what should we build?"
              rows={5}
              className="mt-1.5 mb-5 w-full resize-none border border-phos/20 bg-transparent px-3.5 py-2.5 text-[13px] text-mint outline-none transition-colors placeholder:text-fog focus:border-phos/60"
            />
            <p className="text-[11px] leading-relaxed text-fog/70">
              transmit opens your mail client with the payload pre-filled — no
              trackers, no third-party form service.
            </p>
            <a href={mailto} className="btn solid mt-4 inline-block">
              transmit
            </a>
          </div>

          <div className="panel p-6 sm:p-8" data-reveal style={{ transitionDelay: "100ms" }}>
            <h3 className="text-[12px] font-semibold tracking-[0.22em] text-mint">
              DIRECT LINKS
            </h3>
            <ul className="mt-5 space-y-3.5">
              {socials.map((s) => (
                <li key={s.name} className="flex flex-wrap items-baseline gap-x-3">
                  <span className="w-20 text-[11px] tracking-widest text-fog">{s.name}</span>
                  {s.url !== "#" ? (
                    <a
                      href={s.url}
                      className="text-[13px] text-phos hover:text-phos-bright"
                      {...(s.url.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    >
                      {s.handle} ↗
                    </a>
                  ) : (
                    <span className="text-[13px] text-fog/50">
                      {s.handle} <span className="text-gold/60">(link todo)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <button type="button" onClick={copyEmail} className="btn mt-7">
              {copied ? "copied ✓" : "copy email"}
            </button>
            <p className="mt-6 text-[12px] leading-relaxed text-mint/55">
              From the shell you can also run{" "}
              <span className="text-phos">contact</span>,{" "}
              <span className="text-phos">github</span>, or{" "}
              <span className="text-phos">social</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
