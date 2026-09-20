import { GITHUB_URL } from "../data/content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-sand/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <a href="#top" className="group flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tight">
            Ibrahim Ahmed
          </span>
          <span className="font-arabic text-sm text-terracotta transition-colors group-hover:text-gold">
            إبراهيم
          </span>
        </a>
        <div className="flex items-center gap-5">
          <ul className="hidden items-center gap-5 sm:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-medium text-ink/70 transition-colors hover:text-terracotta"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink/20 px-4 py-1.5 text-sm font-medium transition-colors hover:border-terracotta hover:text-terracotta"
          >
            GitHub ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
