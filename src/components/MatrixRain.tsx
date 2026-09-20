import { useEffect, useRef } from "react";

const GLYPHS =
  "01أبتثجحخدذرزسشصضطظعغفقكلمنهوي<>/\\{}[]()$#@%&*+=~^;:.";

/**
 * Matrix rain with Arabic + latin glyphs. Fixed full-screen canvas at low
 * opacity behind the app. Pauses when the tab is hidden, skipped entirely
 * under prefers-reduced-motion.
 */
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
      drops = Array.from(
        { length: Math.ceil(canvas.width / fontSize) },
        () => Math.floor((Math.random() * canvas.height) / fontSize)
      );
      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (t - last < 66) return; // ~15fps — rain doesn't need more
      last = t;

      ctx.fillStyle = "rgba(7, 12, 10, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const gold = Math.random() < 0.03;
        ctx.fillStyle = gold ? "rgba(217, 164, 65, 0.9)" : "rgba(45, 212, 167, 0.8)";
        ctx.fillText(glyph, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.976) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.16]"
    />
  );
}
