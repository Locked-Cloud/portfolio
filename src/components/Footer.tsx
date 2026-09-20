export default function Footer() {
  return (
    <footer className="border-t border-sand/10 bg-ink py-8 text-sand/50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm sm:flex-row">
        <p>
          © {new Date().getFullYear()} Ibrahim Ahmed · Cairo, Egypt
        </p>
        <p className="flex items-center gap-2">
          <span className="font-arabic text-gold">البازار الجديد</span>
          Neo-Bazaar theme · designed &amp; built from scratch
        </p>
      </div>
    </footer>
  );
}
