# Page Dependency Trees — CAIRO.SYS Portfolio

## / (the single page)

Entry: `src/main.tsx` → `src/App.tsx`

Dependencies:

```
src/App.tsx
- src/components/MatrixRain.tsx
- src/components/BootSequence.tsx
  - src/data/content.ts (bootLines)
- src/components/Nav.tsx
  - src/data/content.ts (GITHUB_URL)
- src/components/Hero.tsx
  - src/components/Terminal.tsx
    - src/data/content.ts (featuredProjects, moreProjects, skillGroups, journey, socials, GITHUB_URL)
  - src/data/content.ts (typedRoles, GITHUB_URL)
- src/components/Stats.tsx
  - src/data/content.ts (heroStats)
- src/components/Projects.tsx
  - src/data/content.ts (featuredProjects, moreProjects, Project type)
  - src/components/SectionHead.tsx (SectionHead)
- src/components/Skills.tsx
  - src/data/content.ts (skillGroups)
  - src/components/SectionHead.tsx
- src/components/Journey.tsx
  - src/data/content.ts (journey)
  - src/components/SectionHead.tsx
- src/components/GitHubLive.tsx
  - src/data/content.ts (ghFallback)
  - src/App.tsx (type GhUser — type-only import)
  - src/components/SectionHead.tsx
- src/components/Contact.tsx
  - src/data/content.ts (socials, EMAIL_TODO)
  - src/components/SectionHead.tsx (SectionHead, Khayamiya)
- src/components/Footer.tsx
- src/lib/reveal.ts (observeReveals)
- src/data/content.ts (ghFallback for initial user state)
```

All copy/projects/skills/journey/socials/boot lines live in **`src/data/content.ts`** — the single content source. `src/styles/tokens.css` provides the theme (see `theme.md`).
