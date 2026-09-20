import { useEffect, useState } from "react";
import { bootLines } from "../data/content";

const SESSION_KEY = "cairo-sys-booted";

/**
 * BIOS-style boot overlay. Runs once per browser session, ~2.4s total,
 * skippable with any key or click.
 */
export default function BootSequence() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY));
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const dismiss = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(false);
    };
    window.addEventListener("keydown", dismiss);
    window.addEventListener("click", dismiss);

    const lineTimer = window.setInterval(
      () => setShown((n) => (n >= bootLines.length ? n : n + 1)),
      150
    );
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
    <div
      aria-hidden
      className="fixed inset-0 z-[60] cursor-pointer bg-black p-8 text-[12px] leading-7 text-phos transition-opacity duration-500 sm:p-12 sm:text-[13px]"
      style={{ opacity: shown >= bootLines.length ? 0.4 : 1 }}
    >
      {bootLines.slice(0, shown).map((line, i) => (
        <p
          key={i}
          className={`boot-line show ${
            line.tone === "warn"
              ? "text-gold"
              : line.tone === "dim"
                ? "text-fog"
                : "text-phos"
          }`}
        >
          {line.text}
        </p>
      ))}
      <p className="boot-line show mt-4 text-fog">
        press any key to skip <span className="cursor-blink" />
      </p>
    </div>
  );
}
