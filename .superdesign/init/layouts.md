# Layout Components — CAIRO.SYS Portfolio

## App shell

- Source: `src/App.tsx`
- Root layout: MatrixRain canvas (z-0) → vignette → scanlines → BootSequence → content wrapper (`relative z-10`): Nav, main (Hero, Stats, Projects, Skills, Journey, GitHubLive, Contact), Footer. Owns the live GitHub user fetch (falls back to bundled snapshot).

```tsx
export default function App() {
  useEffect(() => observeReveals(), []);
  const [user, setUser] = useState<GhUser>({ /* bundled snapshot */ });
  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/users/Locked-Cloud", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => setUser({ ...d }))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  return (
    <div className="relative min-h-screen bg-bg font-body text-mint">
      <MatrixRain />
      <div className="vignette" aria-hidden />
      <div className="scanlines" aria-hidden />
      <BootSequence />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero /> <Stats repos={user.public_repos} /> <Projects /> <Skills />
          <Journey /> <GitHubLive user={user} /> <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
```

## Nav

- Source: `src/components/Nav.tsx`
- Sticky panel bar: brand `IBRAHIM.SYS القاهرة` with pulsing dot, anchor links (WORK/SKILLS/LOG/GITHUB/CONTACT), `OPEN TO WORK` tag, GitHub button. `sticky top-3 z-30`.

```tsx
<header className="sticky top-3 z-30 mx-auto mt-3 max-w-6xl px-2">
  <div className="panel flex items-center justify-between gap-4 px-5 py-3">
    <a href="#top" className="flex items-center gap-2.5 text-[12px] tracking-[0.22em] text-phos">
      <i className="pulse-dot block h-2 w-2 rounded-full bg-phos" />
      IBRAHIM.SYS <span className="font-arabic text-[13px] tracking-normal text-gold">القاهرة</span>
    </a>
    <nav className="hidden items-center gap-1 md:flex">
      {/* WORK SKILLS LOG GITHUB CONTACT — hover: border-phos/30 bg-phos/5 text-phos */}
    </nav>
    <div className="flex items-center gap-3">
      <span className="tag border-phos/45 text-phos">OPEN TO WORK</span>
      <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn !px-4 !py-1.5 hidden sm:inline-block">GITHUB ↗</a>
    </div>
  </div>
</header>
```

## Footer

- Source: `src/components/Footer.tsx`
- One-line: `COMPILED IN CAIRO · NO TRACKERS · © {year} IBRAHIM AHMED` + Arabic `نفس الروح، شكل جديد` in gold.

```tsx
<footer className="mx-auto mt-24 max-w-6xl px-4 pb-10">
  <div className="border-t border-phos/12 pt-6" />
  <div className="flex flex-col items-center justify-between gap-3 text-[11px] tracking-[0.18em] text-fog/70 sm:flex-row">
    <p>COMPILED IN CAIRO <span className="text-gold">·</span> NO TRACKERS <span className="text-gold">·</span> © {new Date().getFullYear()} IBRAHIM AHMED</p>
    <p className="font-arabic text-[13px] tracking-normal text-gold/70">نفس الروح، شكل جديد</p>
  </div>
</footer>
```
