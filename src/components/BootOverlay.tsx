import { useEffect, useState } from "react";

const LINES = [
  "IBRAHIM.SYS BIOS 6.4.2 — (c) ibrahim industries",
  "MEM CHECK ................ 65536K OK",
  "CPU ..................... REALTIME-3D [ENABLED]",
  "GPU ..................... NOT REQUIRED — −192 KB",
  "NET ..................... GITHUB API [ARMED]",
  "SEC ..................... ARSENAL LOADED [ARMED]",
  "MOUNT /work /skills /log /github /blog",
  "LOAD  kernel/ibrahim.sys [██████████] 100%",
  "AUTH .................... GUEST → READ-ONLY",
];

/**
 * Fullscreen BIOS-style boot, once per session. Skipped entirely for
 * reduced-motion users, automation (navigator.webdriver), and repeat
 * visits; any key or click skips it. Decorative — aria-hidden.
 */
export default function BootOverlay() {
  const [phase, setPhase] = useState<"boot" | "granted" | "fade" | "done">(() => {
    if (typeof window === "undefined") return "done";
    if (sessionStorage.getItem("sys-booted")) return "done";
    if (navigator.webdriver) return "done";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "done";
    return "boot";
  });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (phase !== "boot") return;

    const finish = () => {
      sessionStorage.setItem("sys-booted", "1");
      setPhase("fade");
      window.setTimeout(() => setPhase("done"), 350);
    };

    const timer = window.setInterval(() => {
      setShown((n) => {
        if (n >= LINES.length) return n;
        return n + 1;
      });
    }, 170);

    // after the last line: ACCESS GRANTED flash, then out
    const hold = window.setTimeout(() => setPhase("granted"), 170 * LINES.length + 250);
    const out = window.setTimeout(finish, 170 * LINES.length + 950);

    const skip = () => {
      window.clearInterval(timer);
      finish();
    };
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(hold);
      window.clearTimeout(out);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[80] bg-bg px-6 py-10 transition-opacity duration-300 sm:px-12 ${
        phase === "fade" ? "opacity-0" : "opacity-100"
      }`}
    >
      <pre className="text-[11px] leading-[1.9] text-phos sm:text-[13px]">
        {LINES.slice(0, shown).join("\n")}
        {shown < LINES.length && <span className="cursor-blink" />}
      </pre>
      {phase === "granted" && (
        <p className="glow mt-6 font-display text-2xl font-bold tracking-[0.28em] text-phos-bright">
          ACCESS GRANTED
        </p>
      )}
      <p className="absolute bottom-8 left-6 text-[10px] tracking-[0.3em] text-fog sm:left-12">
        PRESS ANY KEY TO SKIP
      </p>
    </div>
  );
}
