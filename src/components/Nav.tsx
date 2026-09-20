import { GITHUB_URL } from "../data/content";

const links = [
  { href: "#work", label: "WORK" },
  { href: "#skills", label: "SKILLS" },
  { href: "#log", label: "LOG" },
  { href: "#github", label: "GITHUB" },
  { href: "#blog", label: "BLOG" },
  { href: "#contact", label: "CONTACT" },
];

export default function Nav() {
  return (
    <header className="sticky top-3 z-30 mx-auto mt-3 max-w-6xl px-2">
      <div className="panel flex items-center justify-between gap-4 px-5 py-3">
        <a href="#top" className="flex items-center gap-2.5 text-[12px] tracking-[0.22em] text-phos">
          <i className="pulse-dot block h-2 w-2 rounded-full bg-phos" />
          IBRAHIM.SYS <span dir="rtl" lang="ar" className="font-arabic text-[13px] tracking-normal text-gold">القاهرة</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="sections">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="border border-transparent px-2.5 py-1 text-[11px] tracking-[0.16em] text-fog transition-colors hover:border-phos/30 hover:bg-phos/5 hover:text-phos"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="tag border-phos/45 text-phos">OPEN TO WORK</span>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn !px-4 !py-1.5 hidden sm:inline-block">
            GITHUB ↗
          </a>
        </div>
      </div>
    </header>
  );
}
