# Portfolio — Ibrahim Ahmed

Personal portfolio site in the **Neo-Bazaar** design language (the same identity as [Bazarna](https://github.com/Locked-Cloud) — sand, terracotta, nile-teal, gold; khayamiya dividers; dual-script AR/EN accents).

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

## Deploy (Cloudflare Pages, $0)

```bash
npm run build
npx wrangler pages deploy dist --project-name=ibrahim-portfolio
```

Add a `public/_redirects` file with `/* /index.html 200` if you add client-side routing.

## TODO before launch

- [ ] `Contact.tsx` — replace `mailto:you@example.com` with the real address; wire the LinkedIn URL
- [ ] Add `public/favicon.svg` (a khayamiya triangle works) + OG image (`public/og.png`, 1200×630)
- [ ] Optional: 3D hero moment (Three.js wireframe bazaar alley) — the slot is the hero backdrop
