import { useEffect, useRef, useState } from "react";
import { SectionHead } from "./SectionHead";

/**
 * 00 — SESSION: the "no trackers" claim, proven live. Everything a page
 * CAN see about the visitor without a single request leaving — pointer
 * travel, clicks, keys, scroll depth, fps — shown to the visitor, plus
 * the page's own load receipts measured in their browser (Performance
 * API). Replaced the three.js scene; zero dependencies.
 */

interface Packet {
  t: string;
  tag: string;
  msg: string;
}

function clock(): string {
  const d = new Date();
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

function parseUA(): string {
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR|Opera/.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "unknown";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
        ? "iOS"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "unknown";
  return `${browser} · ${os}`;
}

function fmtUp(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Session() {
  const [live, setLive] = useState({ travel: 0, clicks: 0, keys: 0, depth: 0, fps: 0, up: 0 });
  const [log, setLog] = useState<Packet[]>([]);
  const [receipts, setReceipts] = useState<{
    ttfb: string;
    dom: string;
    transfer: string;
    entryJs: string;
    budget: string;
  } | null>(null);

  /* static environment — computed once, client-side */
  const [env] = useState(() => ({
    ua: parseUA(),
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    net: (() => {
      const c = (navigator as Navigator & { connection?: { downlink?: number; rtt?: number } })
        .connection;
      return c?.downlink ? `${c.downlink} Mbps · ${c.rtt ?? "?"} ms rtt` : "—";
    })(),
    viewport: `${window.innerWidth}×${window.innerHeight} @${window.devicePixelRatio}x`,
  }));

  /* accumulators — events write refs, a 1s tick flushes to state */
  const acc = useRef({ travel: 0, clicks: 0, keys: 0, x: -1, y: -1, lastPtr: 0, depth: 0 });
  const fpsRef = useRef(0);
  const startRef = useRef(Date.now());
  const push = (tag: string, msg: string) =>
    setLog((l) => [...l.slice(-7), { t: clock(), tag, msg }]);

  useEffect(() => {
    push("SYS", "session opened — tcpdump -i session0");

    const onMove = (e: PointerEvent) => {
      const a = acc.current;
      if (a.x >= 0) {
        a.travel += Math.hypot(e.clientX - a.x, e.clientY - a.y);
      }
      a.x = e.clientX;
      a.y = e.clientY;
      const now = performance.now();
      if (now - a.lastPtr > 900) {
        a.lastPtr = now;
        push("PTR", `(${e.clientX}, ${e.clientY}) · ${Math.round(a.travel).toLocaleString()} px traveled`);
      }
    };
    const onDown = (e: PointerEvent) => {
      acc.current.clicks += 1;
      push("CLK", `#${acc.current.clicks} at (${e.clientX}, ${e.clientY})`);
    };
    const onKey = () => {
      const a = acc.current;
      a.keys += 1;
      if (a.keys % 5 === 0) push("KEY", `×${a.keys} this session`);
    };
    const onScroll = () => {
      const doc = document.documentElement;
      const depth = Math.min(
        100,
        Math.round(((window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1)) * 100)
      );
      if (depth > acc.current.depth) {
        const crossed = Math.floor(depth / 10) > Math.floor(acc.current.depth / 10);
        acc.current.depth = depth;
        if (crossed) push("SCR", `depth ${depth}%`);
      }
    };
    const onVis = () =>
      push("VIS", document.hidden ? "tab hidden" : "tab visible");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    /* fps meter — the section proves its own liveness */
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const dt = t - last;
      last = t;
      if (dt > 0) fpsRef.current = fpsRef.current * 0.9 + (1000 / dt) * 0.1;
    };
    raf = requestAnimationFrame(tick);

    /* 1s flush + uptime */
    const flush = window.setInterval(() => {
      const a = acc.current;
      setLive({
        travel: Math.round(a.travel),
        clicks: a.clicks,
        keys: a.keys,
        depth: a.depth,
        fps: Math.round(fpsRef.current),
        up: Math.floor((Date.now() - startRef.current) / 1000),
      });
    }, 1000);

    /* page receipts — real numbers from the browser's own Performance API */
    const receiptsTimer = window.setTimeout(() => {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      const wire =
        (nav?.transferSize ?? 0) + resources.reduce((s, r) => s + (r.transferSize || 0), 0);
      const entryJs = resources
        .filter((r) => /\/(main|tokens)-[^/]+\.js$/.test(r.name))
        .reduce((s, r) => s + (r.transferSize || 0), 0);
      setReceipts({
        ttfb: nav ? `${Math.round(nav.responseStart)} ms` : "—",
        dom: nav ? `${Math.round(nav.domContentLoadedEventEnd)} ms` : "—",
        transfer: `${Math.round(wire / 1024)} KB`,
        entryJs: `${Math.round(entryJs / 1024)} KB (wire)`,
        budget: entryJs < 120 * 1024 ? "PASS" : "CHECK CI",
      });
    }, 800);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
      window.clearInterval(flush);
      window.clearTimeout(receiptsTimer);
    };
  }, []);

  const rows: [string, string][] = [
    ["pointer travel", `${live.travel.toLocaleString()} px`],
    ["clicks", String(live.clicks)],
    ["keystrokes", String(live.keys)],
    ["scroll depth", `${live.depth}%`],
    ["fps", live.fps ? `${live.fps} live` : "—"],
    ["uptime", fmtUp(live.up)],
    ["viewport", env.viewport],
    ["user agent", env.ua],
    ["language · tz", `${env.lang} · ${env.tz}`],
    ["connection", env.net],
  ];

  return (
    <section id="session" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead
        index="00 — SESSION"
        title="YOUR SESSION, VISIBLE"
        note="no trackers — everything this page can see, it shows you"
      />

      <div className="grid gap-5 lg:grid-cols-2" data-reveal>
        <div className="panel p-6">
          <p className="border-b border-phos/10 pb-3 text-[10px] tracking-[0.22em] text-fog">
            SESSION — LIVE
          </p>
          <dl className="mt-3 divide-y divide-phos/8">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                <dt className="text-[11px] tracking-[0.14em] text-fog">{k}</dt>
                <dd className="text-[12.5px] text-mint">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="panel p-6">
          <p className="border-b border-phos/10 pb-3 text-[10px] tracking-[0.22em] text-fog">
            PAGE RECEIPTS — MEASURED IN YOUR BROWSER
          </p>
          {receipts ? (
            <dl className="mt-3 divide-y divide-phos/8">
              {(
                [
                  ["ttfb", receipts.ttfb],
                  ["dom content loaded", receipts.dom],
                  ["transferred (wire)", receipts.transfer],
                  ["entry js", receipts.entryJs],
                  ["budget 120 KB", receipts.budget],
                  ["three.js", "REMOVED — −192 KB gz"],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-2">
                  <dt className="text-[11px] tracking-[0.14em] text-fog">{k}</dt>
                  <dd
                    className={`text-[12.5px] ${
                      v === "PASS" ? "text-phos" : v.startsWith("REMOVED") ? "text-gold" : "text-mint"
                    }`}
                  >
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-[11px] tracking-[0.2em] text-fog">MEASURING…</p>
          )}
        </div>
      </div>

      <div className="panel mt-5 p-6" data-reveal>
        <p className="text-[11px] tracking-[0.2em] text-fog">
          ibrahim@sys:~$ <span className="text-phos">tcpdump -i session0 -c 8</span>
        </p>
        <ul className="mt-4 space-y-1.5">
          {log.map((p, i) => (
            <li key={`${p.t}-${i}`} className="text-[12px] text-mint/70">
              <span className="text-fog/70">{p.t}</span>{" "}
              <span className="text-phos">{p.tag}</span> {p.msg}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-center text-[12px] text-fog">
        every number above is computed in your browser — not one request leaves this page
        for it. that is the entire surveillance surface: your own screen.
      </p>
    </section>
  );
}
