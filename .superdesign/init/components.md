# Shared UI Components — CAIRO.SYS Portfolio

Framework: React 18 + Vite + TypeScript. CSS: Tailwind CSS v4 (`@theme` tokens in `src/styles/tokens.css`) + a few semantic classes (`.panel`, `.btn`, `.tag`). No component library — custom primitives only.

The project has few shared primitives (single-page site); page-specific components live in `src/components/` and are listed in `pages.md`.

## SectionHead + Khayamiya

- Source: `src/components/SectionHead.tsx`
- Shared section heading (index kicker + display title + optional Arabic word) and the khayamiya triangle divider.
- Props: `index`, `title`, `note?`, `arabic?`

```tsx
interface SectionHeadProps {
  index: string;
  title: string;
  note?: string;
  arabic?: string;
}

export function SectionHead({ index, title, note, arabic }: SectionHeadProps) {
  return (
    <div data-reveal className="mb-10">
      <p className="text-[11px] tracking-[0.3em] text-fog">
        <span className="text-gold">//</span> {index}
        {note ? <span className="ml-3 text-fog/60">{note}</span> : null}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-3xl font-bold tracking-tight text-mint sm:text-4xl">
          {title}
        </h2>
        {arabic && <span className="font-arabic text-xl text-gold/90">{arabic}</span>}
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-phos/40 via-phos/10 to-transparent" />
    </div>
  );
}

export function Khayamiya() {
  const triangles = Array.from({ length: 60 }, (_, i) => i);
  return (
    <svg aria-hidden viewBox="0 0 1440 16" preserveAspectRatio="none" className="block h-3 w-full text-gold/25">
      {triangles.map((i) => (
        <polygon key={i} points={`${i * 24},16 ${i * 24 + 12},0 ${i * 24 + 24},16`} fill="currentColor" />
      ))}
    </svg>
  );
}
```

## MatrixRain

- Source: `src/components/MatrixRain.tsx`
- Full-screen fixed canvas behind the app; Arabic + latin glyph rain in phosphor teal with rare gold glyphs. ~15fps, pauses when tab hidden, skipped under prefers-reduced-motion.

```tsx
import { useEffect, useRef } from "react";

const GLYPHS = "01أبتثجحخدذرزسشصضطظعغفقكلمنهوي<>/\\{}[]()$#@%&*+=~^;:.";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let drops: number[] = [];
    let last = 0;
    const fontSize = 15;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array.from({ length: Math.ceil(canvas.width / fontSize) }, () =>
        Math.floor((Math.random() * canvas.height) / fontSize));
      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (t - last < 66) return;
      last = t;
      ctx.fillStyle = "rgba(7, 12, 10, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drops.length; i++) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const gold = Math.random() < 0.03;
        ctx.fillStyle = gold ? "rgba(217, 164, 65, 0.9)" : "rgba(45, 212, 167, 0.8)";
        ctx.fillText(glyph, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.976) drops[i] = 0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.16]" />;
}
```

## BootSequence

- Source: `src/components/BootSequence.tsx`
- BIOS-style boot overlay, one run per browser session (sessionStorage), lines every 150ms, skippable by key/click.

```tsx
import { useEffect, useState } from "react";
import { bootLines } from "../data/content";
const SESSION_KEY = "cairo-sys-booted";

export default function BootSequence() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY));
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const dismiss = () => { sessionStorage.setItem(SESSION_KEY, "1"); setVisible(false); };
    window.addEventListener("keydown", dismiss);
    window.addEventListener("click", dismiss);
    const lineTimer = window.setInterval(() => setShown((n) => (n >= bootLines.length ? n : n + 1)), 150);
    const doneTimer = window.setTimeout(dismiss, 150 * bootLines.length + 900);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("click", dismiss);
      window.clearInterval(lineTimer);
      window.clearTimeout(doneTimer);
    };
  }, [visible]);
  if (!visible) return null;
  return (
    <div aria-hidden className="fixed inset-0 z-[60] cursor-pointer bg-black p-8 text-[12px] leading-7 text-phos">
      {bootLines.slice(0, shown).map((line, i) => (
        <p key={i} className="boot-line show">{line.text}</p>
      ))}
      <p className="boot-line show mt-4 text-fog">press any key to skip</p>
    </div>
  );
}
```

## Terminal

- Source: `src/components/Terminal.tsx` (full file ~180 lines)
- Interactive shell in a `.panel` with chrome bar (traffic-light pills + `ibrahim@cairo — zsh — 80×24`), scrollable output, prompt row with input. Commands: `help, whoami, projects, skills, log, github, social, contact, uptime, date, sudo, echo, clear`. ↑/↓ history. Takes optional `inputRef` so the hero "open shell" button can focus it.
- Key state: `lines: {kind:"in"|"out"|"err", text}[]`, `history[]`, `histIdx`.
