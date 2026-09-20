# Portfolio — Ibrahim Ahmed · CAIRO.SYS

**Live:** https://locked-cloud.github.io/portfolio/ · CV: [/cv.html](https://locked-cloud.github.io/portfolio/cv.html) (EN/عربي, print-ready)

Terminal × Cairo identity. The hero **is** an interactive shell — `help`, `verify`, `scorecard`, `neofetch`, `coverage`, `goto work`, `theme` — every stat carries a provenance chip, a real-time **three.js tooth** loads on scroll (`#proof`), the devlog holds three written posts, and PULPOVR's gallery opens from its card. Arabic glyphs fall in the matrix rain.

**Demo video:** [`docs/demo.webm`](docs/demo.webm) — a 35-second guided terminal session (recorded by the Playwright suite itself).

Direction chosen from a 4-variant superdesign exploration (V2 — "the shell is the hero").

**Stack:** React 18 · Vite · TypeScript · Tailwind CSS v4 (`@theme` tokens in `src/styles/tokens.css`) · zero runtime dependencies beyond React.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit + production build → dist/
```

## Structure

```
src/
├── App.tsx                  # page composition + reveal observer
├── styles/tokens.css        # ⭐ Neo-Bazaar tokens + lattice pattern + motion
├── data/content.ts          # ⭐ all copy lives here — edit this to update the site
├── lib/reveal.ts            # IntersectionObserver scroll-reveal (no deps)
└── components/
    ├── Nav · Hero · Stats · Projects · Skills · Journey · Contact · Footer
    └── SectionHead.tsx      # shared heading + Khayamiya triangle divider
```

**To update content** (projects, skills, journey, stats): edit `src/data/content.ts` only — every section renders from it.

**To change the theme**: the five hex tokens at the top of `tokens.css`. Alternative identities are catalogued in `../saas/docs/portfolio-study/github-profile/THEMES.md`.

## Deploy

Current hosting: **GitHub Pages** (`gh-pages` branch, auto-built from `dist`):

```bash
npm run build
npx gh-pages -d dist          # pushes dist → gh-pages → live in ~1 min
```

To move to **Cloudflare Pages** (run `npx wrangler login` once first):

```bash
npm run build
npx wrangler pages deploy dist --project-name=ibrahim-portfolio
```

The build uses a relative base (`./`), so it works at any path on either host.

## CI

GitHub Actions on every push: typecheck → build → Playwright smoke suite (6 tests: shell boots, terminal answers, provenance chips, project images, CV page).

## TODO before launch

- [ ] `Contact.tsx` — replace `mailto:you@example.com` with the real address; wire the LinkedIn URL
- [ ] Add `public/favicon.svg` (a khayamiya triangle works) + OG image (`public/og.png`, 1200×630)
- [ ] Optional: 3D hero moment (Three.js wireframe bazaar alley) — the slot is the hero backdrop
