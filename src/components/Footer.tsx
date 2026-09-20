import { GITHUB_URL } from "../data/content";

export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10">
      <div className="border-t border-phos/12 pt-6" />
      <div className="flex flex-col items-center justify-between gap-3 text-[11px] tracking-[0.18em] text-fog sm:flex-row">
        <p>
          COMPILED IN CAIRO · NO TRACKERS · © {new Date().getFullYear()} IBRAHIM AHMED
        </p>
        <p dir="rtl" lang="ar" className="font-arabic text-[13px] tracking-normal text-fog/80">
          نفس الروح، شكل جديد
        </p>
      </div>
      {/* provenance for the page itself — baked at build time from git */}
      <p className="mt-3 text-center text-[10px] tracking-[0.18em] text-fog">
        [built {__BUILD_STAMP__}] ·{" "}
        <a
          href={`${GITHUB_URL}/portfolio`}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-phos/30 underline-offset-4 hover:text-phos"
        >
          source ↗
        </a>
      </p>
    </footer>
  );
}
