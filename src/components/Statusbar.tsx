import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "top", n: 0, label: "shell" },
  { id: "proof", n: 1, label: "3d" },
  { id: "work", n: 2, label: "work" },
  { id: "skills", n: 3, label: "skills" },
  { id: "log", n: 4, label: "log" },
  { id: "github", n: 5, label: "github" },
  { id: "blog", n: 6, label: "blog" },
  { id: "contact", n: 7, label: "contact" },
];

/**
 * tmux-style status bar, pinned to the bottom of the viewport:
 * session name, window tabs (the sections), host, live clock.
 */
export default function Statusbar() {
  const [active, setActive] = useState("top");
  const [now, setNow] = useState(() => new Date());
  const startRef = useRef(Date.now());

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id || "top");
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const clock = now.toLocaleTimeString("en-GB", { hour12: false });

  /* session uptime, tmux-style — seconds since this tab mounted */
  const secs = Math.max(0, Math.floor((now.getTime() - startRef.current) / 1000));
  const up =
    secs >= 3600
      ? `${Math.floor(secs / 3600)}h${String(Math.floor((secs % 3600) / 60)).padStart(2, "0")}m`
      : secs >= 60
        ? `${Math.floor(secs / 60)}m${String(secs % 60).padStart(2, "0")}s`
        : `${secs}s`;

  return (
    <div
      data-statusbar
      className="fixed inset-x-0 bottom-0 z-40 flex h-7 items-center justify-between gap-3 border-t border-phos/25 bg-[#071009]/95 px-3 text-[10.5px] tracking-[0.08em]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 bg-phos px-1.5 font-bold text-bg">[IBRAHIM.SYS]</span>
        <nav aria-label="sections (status bar)" className="hidden min-w-0 md:flex">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`px-1.5 py-0.5 ${
                  isActive ? "bg-phos/20 font-semibold text-phos-bright" : "text-fog hover:text-phos"
                }`}
              >
                {s.n}:{s.label}
                {isActive ? "*" : ""}
              </a>
            );
          })}
        </nav>
        <span className="truncate text-fog md:hidden">
          {SECTIONS.find((s) => s.id === active)?.label ?? "shell"}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-fog">
        <span className="hidden sm:inline">up {up}</span>
        <span className="hidden sm:inline">guest@sys</span>
        <span className="text-phos">{clock}</span>
      </div>
    </div>
  );
}
