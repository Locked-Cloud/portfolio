import { GITHUB_URL } from "../data/content";

export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10">
      <div className="border-t border-phos/12 pt-6" />
      <div className="flex flex-col items-center justify-between gap-3 text-[11px] tracking-[0.18em] text-fog sm:flex-row">
        <p>COMPILED LOCALLY · NO TRACKERS · © {new Date().getFullYear()} IBRAHIM AHMED</p>
        {/* 49 42 52 41 48 49 4D — "IBRAHIM" in hex, because this is a terminal */}
        <p aria-hidden className="select-none tracking-[0.3em] text-fog/70">
          0x49 0x42 0x52 0x41 0x48 0x49 0x4D
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
