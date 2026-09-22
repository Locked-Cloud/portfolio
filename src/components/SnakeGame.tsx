import { useEffect, useRef, useState } from "react";

const W = 24;
const H = 14;

interface Pt {
  x: number;
  y: number;
}

/**
 * The arcade break — playable inside the hero terminal's output area.
 * Arrows steer, gold is food, walls and tail end you. Esc quits.
 * User-initiated, so it runs regardless of reduced-motion preferences.
 */
export default function SnakeGame({ onExit }: { onExit: (score: number) => void }) {
  const [snake, setSnake] = useState<Pt[]>([
    { x: 8, y: 7 },
    { x: 7, y: 7 },
    { x: 6, y: 7 },
  ]);
  const [food, setFood] = useState<Pt>({ x: 16, y: 7 });
  const [dead, setDead] = useState(false);
  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);
  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  const score = snake.length - 3;

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onExit(snakeRef.current.length - 3);
        return;
      }
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y === 0) {
        e.preventDefault();
        dirRef.current = { x: 0, y: -1 };
      } else if (e.key === "ArrowDown" && d.y === 0) {
        e.preventDefault();
        dirRef.current = { x: 0, y: 1 };
      } else if (e.key === "ArrowLeft" && d.x === 0) {
        e.preventDefault();
        dirRef.current = { x: -1, y: 0 };
      } else if (e.key === "ArrowRight" && d.x === 0) {
        e.preventDefault();
        dirRef.current = { x: 1, y: 0 };
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  useEffect(() => {
    if (dead) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const s = snakeRef.current;
      const d = dirRef.current;
      const head = { x: s[0].x + d.x, y: s[0].y + d.y };
      const hitWall = head.x < 0 || head.x >= W || head.y < 0 || head.y >= H;
      const hitSelf = s.some((p) => p.x === head.x && p.y === head.y);
      if (hitWall || hitSelf) {
        setDead(true);
        return;
      }
      const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
      const next = [head, ...(ate ? s : s.slice(0, -1))];
      setSnake(next);
      if (ate) {
        let f: Pt;
        do {
          f = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
        } while (next.some((p) => p.x === f.x && p.y === f.y));
        setFood(f);
      }
    }, 140);
    return () => window.clearInterval(timer);
  }, [dead]);

  const cells: ("head" | "body" | "food" | null)[] = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (snake[0].x === x && snake[0].y === y) cells.push("head");
      else if (snake.some((p, i) => i > 0 && p.x === x && p.y === y)) cells.push("body");
      else if (food.x === x && food.y === y) cells.push("food");
      else cells.push(null);
    }
  }

  return (
    <div
      role="application"
      aria-label="snake game"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-bg px-4"
    >
      <p className="text-[11px] tracking-[0.22em] text-fog">
        SNAKE — SCORE <span className="text-phos">{score}</span> —{" "}
        <span className="text-gold">ESC TO QUIT</span>
      </p>
      <div
        className="grid w-full max-w-[600px] border border-phos/25 bg-bg2/60 p-1"
        style={{ gridTemplateColumns: `repeat(${W}, 1fr)` }}
      >
        {cells.map((c, i) => (
          <div
            key={i}
            aria-hidden
            className={`aspect-square ${
              c === "head"
                ? "bg-phos"
                : c === "body"
                  ? "bg-phos/55"
                  : c === "food"
                    ? "rounded-full bg-gold"
                    : ""
            }`}
          />
        ))}
      </div>
      {dead ? (
        <p className="glow text-sm tracking-[0.2em] text-phos-bright">
          GAME OVER — SCORE {score} — ESC TO QUIT
        </p>
      ) : (
        <p className="text-[10px] tracking-[0.2em] text-fog/70">↑ ↓ ← → steer · keyboard required</p>
      )}
    </div>
  );
}
