# Theme — CAIRO.SYS (terminal × Neo-Bazaar)

## Part 1 — Token summary

**Colors** (Tailwind v4 `@theme`, utilities auto-generated: `bg-bg`, `text-mint`, `border-phos/15`, …):

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#070c0a` | page background (warm-dark ink, green-tinted near-black) |
| `--color-bg2` | `#0b1310` | raised sections / stat tiles |
| `--color-panel` | `#0d1714` | panel surface (used at 0.82 alpha + blur) |
| `--color-phos` | `#2dd4a7` | phosphor nile-teal — primary accent (borders, links, prompt) |
| `--color-phos-bright` | `#7ef0cd` | hover/bright phosphor |
| `--color-mint` | `#d6efe4` | body text |
| `--color-fog` | `#7ca394` | secondary text / labels |
| `--color-gold` | `#d9a441` | warm accent — Arabic words, metric values, warnings (used sparingly) |
| `--color-terra` | `#e0713f` | terracotta — the single word "Cairo" in the hero lede |
| `--color-danger` | `#ff6b5a` | errors, terminal traffic pill |
| `--color-cyan` | `#4dffe7` | glitch layer only |

**Type:**
- `--font-body`: IBM Plex Mono (everything — the terminal voice)
- `--font-display`: Space Grotesk (h1/h2, stat numbers)
- `--font-arabic`: IBM Plex Sans Arabic (Arabic accents)

**Signature CSS classes** (`src/styles/tokens.css`):
- `.panel` — bordered translucent card: `border-phos/18`, `rgba(13,23,20,.82)`, `backdrop-blur(12px)`, faint teal glow shadow
- `.btn` / `.btn.solid` / `.btn.gold` — rectangular terminal buttons (no radius), uppercase, letterspaced; solid = phosphor bg + dark text
- `.tag` — small uppercase status pill
- `.scanlines` — fixed CRT scanline overlay (opacity .3)
- `.vignette` — fixed radial + linear vignette
- `.glitch` — name RGB-split via `::before/::after` with 4.2s keyframe bursts (cyan/terra)
- `.cursor-blink`, `.pulse-dot`, `[data-reveal]` fade-rise (`.is-visible`), `.boot-line`
- `prefers-reduced-motion`: kills rain, glitch, cursor, scanlines, reveal transitions

**Motion inventory (current):** boot sequence → typed hero line = orchestrated entry; matrix rain (global canvas, opacity .16, ~15fps); CRT scanlines; glitch bursts on name; staggered `[data-reveal]` per section; card hover translate.

## Part 2 — Raw source

### `src/styles/tokens.css` (full)

```css
@import "tailwindcss";

@theme {
  --color-bg: #070c0a;
  --color-bg2: #0b1310;
  --color-panel: #0d1714;
  --color-phos: #2dd4a7;
  --color-phos-bright: #7ef0cd;
  --color-mint: #d6efe4;
  --color-fog: #7ca394;
  --color-gold: #d9a441;
  --color-terra: #e0713f;
  --color-danger: #ff6b5a;
  --color-cyan: #4dffe7;
  --font-display: "Space Grotesk", "IBM Plex Sans Arabic", system-ui, sans-serif;
  --font-body: "IBM Plex Mono", "IBM Plex Sans Arabic", ui-monospace, monospace;
  --font-arabic: "IBM Plex Sans Arabic", sans-serif;
}

html { scroll-behavior: smooth; }
body { background-color: var(--color-bg); color: var(--color-mint); font-family: var(--font-body); -webkit-font-smoothing: antialiased; }
::selection { background: var(--color-gold); color: var(--color-bg); }

.panel { border: 1px solid rgba(45, 212, 167, 0.18); background: rgba(13, 23, 20, 0.82); backdrop-filter: blur(12px); box-shadow: 0 0 40px rgba(45, 212, 167, 0.05); }

.btn { display: inline-block; border: 1px solid rgba(45, 212, 167, 0.5); color: var(--color-phos); padding: 0.65rem 1.4rem; font-size: 0.8rem; letter-spacing: 0.16em; text-transform: uppercase; transition: all 0.2s ease; }
.btn:hover { background: rgba(45, 212, 167, 0.1); border-color: var(--color-phos); box-shadow: 0 0 18px rgba(45, 212, 167, 0.18); }
.btn.solid { background: var(--color-phos); color: var(--color-bg); font-weight: 600; }
.btn.solid:hover { background: var(--color-phos-bright); }
.btn.gold { border-color: rgba(217, 164, 65, 0.55); color: var(--color-gold); }
.btn.gold:hover { background: rgba(217, 164, 65, 0.1); border-color: var(--color-gold); }

.tag { display: inline-block; border: 1px solid; padding: 0.1rem 0.55rem; font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; }

.scanlines { pointer-events: none; position: fixed; inset: 0; z-index: 40; background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.16) 3px); opacity: 0.3; }
.vignette { pointer-events: none; position: fixed; inset: 0; z-index: 1; background: radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.6) 100%), linear-gradient(180deg, rgba(0,12,8,0.4), transparent 16%, transparent 84%, rgba(0,0,0,0.5)); }

/* glitch keyframes (4.2s bursts), blink, pulse-dot, boot-line, [data-reveal] — see components.md usage */
@media (prefers-reduced-motion: reduce) { /* all motion off, scanlines hidden */ }
```
