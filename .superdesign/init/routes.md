# Routes — CAIRO.SYS Portfolio

Single-page application, **no router** — one route with anchor sections. React Router not installed.

| URL | Component | Notes |
|---|---|---|
| `/` | `src/App.tsx` | All sections in one page |

Anchor map (in-page `href="#..."`):

| Anchor | Section | Component |
|---|---|---|
| `#top` | Hero + shell | `src/components/Hero.tsx` (contains `Terminal`) |
| — | Stats | `src/components/Stats.tsx` |
| `#work` | Shipped systems | `src/components/Projects.tsx` |
| `#skills` | Toolbox | `src/components/Skills.tsx` |
| `#log` | Git-log journey | `src/components/Journey.tsx` |
| `#github` | GitHub live | `src/components/GitHubLive.tsx` |
| `#contact` | Secure channel | `src/components/Contact.tsx` |

Planned (not built): `/cv` print-optimized one-pager.

Deployment: static SPA — Cloudflare Pages with `public/_redirects` (`/* /index.html 200`) once routing is added; currently pure single page.
