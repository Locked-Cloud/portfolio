export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10">
      <div className="border-t border-phos/12 pt-6" />
      <div className="flex flex-col items-center justify-between gap-3 text-[11px] tracking-[0.18em] text-fog sm:flex-row">
        <p>
          COMPILED IN CAIRO <span className="text-gold">·</span> NO TRACKERS{" "}
          <span className="text-gold">·</span> © {new Date().getFullYear()} IBRAHIM AHMED
        </p>
        <p dir="rtl" lang="ar" className="font-arabic text-[13px] tracking-normal text-gold/70">
          نفس الروح، شكل جديد
        </p>
      </div>
    </footer>
  );
}
