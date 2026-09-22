import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import SnakeGame from "./SnakeGame";
import {
  featuredProjects,
  skillGroups,
  journey,
  socials,
  statClaims,
  scorecard,
  neofetchArt,
  neofetchSpecs,
  coverageLines,
  kernelLog,
  stackChips,
  pulpoLoc,
  GITHUB_URL,
} from "../data/content";

type BlockId = "whoami" | "projects" | "stack";
type Line = { kind: "in" | "out" | "err"; text: string } | { kind: "block"; block: BlockId };

const SCRIPT: Line[] = [
  ...kernelLog.map((text): Line => ({ kind: "out", text })),
  { kind: "in", text: "ibrahim@sys:~$ whoami" },
  { kind: "block", block: "whoami" },
  { kind: "in", text: "ibrahim@sys:~$ cat projects/active.md" },
  { kind: "block", block: "projects" },
  { kind: "in", text: "ibrahim@sys:~$ ls -a .stack" },
  { kind: "block", block: "stack" },
  { kind: "out", text: "" },
  { kind: "out", text: "your turn — type `help`" },
];

const HELP: string[] = [
  "available commands:",
  "  whoami      — who is this",
  "  projects    — selected work",
  "  stack       — the loadout",
  "  skills      — full toolbox",
  "  log         — journey, git-style",
  "  verify      — the source behind every stat",
  "  scorecard   — merit vs. stars",
  "  coverage    — what this page can't show",
  "  neofetch    — system card",
  "  arsenal     — the security toolkit",
  "  encode <s>  — text → base64 (works, try it)",
  "  decode <s>  — base64 → text",
  "  hex <s>     — text → hex",
  "  sha256 <s>  — real hash, via webcrypto",
  "  rot13 <s>   — rotate it",
  "  uuid        — mint one",
  "  nmap        — scan ibrahim.sys",
  "  ps          — projects as processes",
  "  df          — where the lines live",
  "  file        — identify the kernel",
  "  hack        — do not run this",
  "  trace       — find the visitor",
  "  banner      — the flag",
  "  man <cmd>   — the manual",
  "  history     — what you typed this session",
  "  !!          — run the last one again",
  "  share <cmd> — copy a ?run= deep-link",
  "  snake       — the arcade break",
  "  goto <x>    — scroll to: session · work · skills · log · github · blog · contact",
  "  theme       — the matrix rain · or theme amber · blue · green",
  "  github      — open github profile",
  "  social      — direct channels",
  "  contact     — how to reach me",
  "  uptime      — years at the keyboard",
  "  clear       — wipe the screen",
];

/** tab-completion surface — everything the prompt knows */
const COMMAND_NAMES = [
  "help", "whoami", "projects", "stack", "skills", "log", "verify", "scorecard",
  "coverage", "neofetch", "arsenal", "encode", "decode", "hex", "sha256", "rot13",
  "uuid", "nmap", "ps", "df", "file", "hack", "trace", "banner", "matrix", "goto",
  "theme", "github", "social", "contact", "uptime", "date", "echo", "sudo", "clear",
  "man", "history", "snake",
];

/* ── man pages — the shell documents itself ────────────────────────────── */
const MAN: Record<string, string[]> = {
  verify: [
    "VERIFY(1)",
    "  prints the source behind every stat on this page.",
    "  policy: no number without a source — chips [record]/[measured]/[by-design].",
  ],
  scorecard: [
    "SCORECARD(1)",
    "  project selection by engineering merit, not stars.",
    "  the least-starred repos are the flagships — pin accordingly.",
  ],
  coverage: [
    "COVERAGE(1)",
    "  what this page honestly cannot show: private repos, unpushed work.",
    "  gaps are named, not hidden.",
  ],
  arsenal: [
    "ARSENAL(1)",
    "  the security toolkit actually in use — web, RE, malware triage.",
    "  scope policy: bounty programs + own labs. nothing else.",
  ],
  hack: [
    "HACK(1)",
    "  theater. the only intrusion here is into your expectations.",
    "  everything on this page is already yours — MIT-licensed.",
  ],
  snake: [
    "SNAKE(6)",
    "  the arcade break. arrows steer, gold is food, esc quits.",
    "  section 6: games. every serious system ships one.",
  ],
  goto: [
    "GOTO(1)",
    "  scroll to a section: session · work · skills · log · github · blog · contact.",
  ],
  theme: [
    "THEME(1)",
    "  no argument: toggle the matrix rain.",
    "  amber | blue | green: swap the phosphor tube.",
  ],
  encode: [
    "ENCODE(1)",
    "  text → base64, for real. decode reverses it, hex dumps it.",
    "  sha256 uses the browser's own webcrypto.",
  ],
  share: [
    "SHARE(1)",
    "  copies a ?run= deep-link — opens the site and auto-runs the command.",
    "  `share hack`, then paste it to someone who types slow.",
  ],
};

/* ── phosphor tubes for `theme <color>` — runtime CSS-var swap ─────────── */
const PHOSPHORS: Record<string, [string, string]> = {
  green: ["#3dff88", "#b0ffcf"],
  amber: ["#ffb000", "#ffd699"],
  blue: ["#6ecbff", "#c9e9ff"],
};
const TUBE_LORE: Record<string, string> = {
  green: "P1 — the classic",
  amber: "P3 — the collector's tube",
  blue: "P11 — the night-vision tube",
};

/* ── working codecs — real transforms, not decoration ──────────────────── */
const toB64 = (s: string) =>
  btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const fromB64 = (s: string) =>
  new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0)));
const toHex = (s: string) =>
  Array.from(new TextEncoder().encode(s), (b) => b.toString(16).padStart(2, "0")).join(" ");
const rot13 = (s: string) =>
  s.replace(/[a-z]/gi, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });

function codecLines(cmd: string, rawArg: string): Line[] {
  if (!rawArg) return [{ kind: "err", text: `${cmd}: give me an argument — try \`${cmd} hello\`` }];
  try {
    if (cmd === "encode") return [{ kind: "out", text: `b64: ${toB64(rawArg)}` }];
    if (cmd === "decode") return [{ kind: "out", text: `txt: ${fromB64(rawArg)}` }];
    if (cmd === "rot13") return [{ kind: "out", text: `rot13: ${rot13(rawArg)}` }];
    return [{ kind: "out", text: `hex: ${toHex(rawArg)}` }];
  } catch {
    return [{ kind: "err", text: `${cmd}: not valid input for this codec` }];
  }
}

const GOTO_TARGETS: Record<string, string> = {
  top: "top",
  session: "session",
  work: "work",
  skills: "skills",
  log: "log",
  github: "github",
  blog: "blog",
  contact: "contact",
};

function commands(): Record<string, Line[]> {
  return {
    help: HELP.map((text): Line => ({ kind: "out", text })),
    whoami: [{ kind: "block", block: "whoami" }],
    projects: [{ kind: "block", block: "projects" }],
    stack: [{ kind: "block", block: "stack" }],
    skills: skillGroups.map((g): Line => ({
      kind: "out",
      text: `${g.title.toLowerCase().padEnd(9)} ${g.skills.join(" · ")}`,
    })),
    log: journey.map((j): Line => ({ kind: "out", text: `  ${j.hash}  ${j.year}  ${j.title}` })),
    verify: [
      { kind: "out", text: "every number on this page, with its source:" },
      ...statClaims.map(
        (s): Line => ({
          kind: "out",
          text: `  ${s.value.padEnd(7)} [${s.chip}]  ${s.source}`,
        })
      ),
      { kind: "out", text: "policy: no number without a source." },
    ],
    scorecard: [
      { kind: "out", text: "project selection — engineering merit, not stars:" },
      ...scorecard.map(
        (s): Line => ({
          kind: "out",
          text: `  ${s.repo.padEnd(22)} ${s.stars.padEnd(4)} ${s.verdict}`,
        })
      ),
      { kind: "out", text: "the best projects are the least-starred ones. pin accordingly." },
    ],
    coverage: coverageLines.map((text): Line => ({ kind: "out", text })),
    neofetch: neofetchArt.map((art, i): Line => ({
      kind: "out",
      text:
        i < neofetchSpecs.length
          ? `  ${art.padEnd(16)} ${neofetchSpecs[i][0].padEnd(11)} ${neofetchSpecs[i][1]}`
          : `  ${art}`,
    })),
    social: socials.map(
      (s): Line => ({ kind: "out", text: `  ${s.name.padEnd(10)} ${s.handle} ${s.live ? "" : "(todo)"}` })
    ),
    banner: [
      { kind: "out", text: "   ▲ ▲    IBRAHIM.SYS v6.4.2" },
      { kind: "out", text: "  ▲ ▲ ▲   real-time 3d · saas · edge ml" },
      { kind: "out", text: "   ▲ ▲    location: undisclosed" },
    ],
    hack: [
      { kind: "out", text: "initiating handshake with 127.0.0.1 …" },
      { kind: "out", text: "[*] scanning ports .............. 22, 443 open" },
      { kind: "out", text: "[*] cracking /dev/motivation .... found: unlimited" },
      { kind: "out", text: "[*] injecting caffeine .......... ok" },
      { kind: "out", text: "[██████████] 100%" },
      { kind: "out", text: "ACCESS GRANTED — everything here is already yours. MIT-licensed." },
    ],
    trace: [
      { kind: "out", text: "traceroute to visitor:" },
      { kind: "out", text: "  1  gateway.local ............... 0.4 ms" },
      { kind: "out", text: "  2  core1.backbone .............. 1.1 ms" },
      { kind: "out", text: "  3  ixp.exchange-01 ............. 2.8 ms" },
      { kind: "out", text: "  4  your.isp .................... ~12 ms" },
      { kind: "out", text: "  5  you.right.now ............... 0 ms ← hello, visitor." },
    ],
    matrix: [{ kind: "out", text: "the rain never stops. (`theme` makes it quiet.)" }],
    nmap: [
      { kind: "out", text: "Starting Nmap 7.94 ( good-faith scan — bounty scopes + own labs only )" },
      { kind: "out", text: "Nmap scan report for ibrahim.sys (127.0.0.1)" },
      { kind: "out", text: "Host is up (0.00042s latency)." },
      { kind: "out", text: "" },
      { kind: "out", text: "PORT      STATE  SERVICE" },
      { kind: "out", text: "22/tcp    open   react-18" },
      { kind: "out", text: "80/tcp    open   typescript" },
      { kind: "out", text: "443/tcp   open   three-js" },
      { kind: "out", text: "3000/tcp  open   vite-dev" },
      { kind: "out", text: "5432/tcp  open   supabase-pg" },
      { kind: "out", text: "8080/tcp  open   node-express" },
      { kind: "out", text: "8883/tcp  open   esp32-mqtt" },
      { kind: "out", text: "1337/tcp  open   pwn" },
      { kind: "out", text: "" },
      { kind: "out", text: "Nmap done: 1 host up. every service documented — run `verify`." },
    ],
    ps: [
      { kind: "out", text: "USER     PID  COMMAND" },
      ...featuredProjects.map(
        (p, i): Line => ({
          kind: "out",
          text: `ibrahim  ${String(i + 1).padStart(3)}   ${p.title.toLowerCase().padEnd(17)} ${
            p.status === "PRIV" ? "[private]" : p.status === "WIP" ? "[wip]" : "[running]"
          }`,
        })
      ),
      { kind: "out", text: "ibrahim   98   this-portfolio    [deployed]" },
      { kind: "out", text: "ibrahim   99   bug-bounty-lab   [always-on]" },
      { kind: "out", text: "guest    777   your-session     [reading]" },
    ],
    df: [
      { kind: "out", text: "df -h — where the lines live (counted, not estimated)" },
      ...pulpoLoc.split.map(
        (s): Line => ({
          kind: "out",
          text: `  /dev/${s.lang.toLowerCase().replace(/[^a-z]/g, "").slice(0, 9).padEnd(10)}${s.loc.padEnd(7)}lines ${String(s.pct).padStart(3)}%`,
        })
      ),
      { kind: "out", text: `  total: ${pulpoLoc.total} lines across firmware → 3D` },
      { kind: "out", text: `  source: ${pulpoLoc.source}` },
    ],
    arsenal: [
      { kind: "out", text: "security toolkit — what i actually run:" },
      { kind: "out", text: "  web      burp suite · owasp zap · nuclei · ffuf" },
      { kind: "out", text: "  re       ghidra · radare2 · x64dbg" },
      { kind: "out", text: "  malw     static triage → sandboxed dynamics → yara" },
      { kind: "out", text: "  classes  xss · idor · ssrf · sqli · broken auth" },
      { kind: "out", text: "  lab      hackthebox — machines + prolabs (see `social`)" },
      { kind: "out", text: "  practice bounty scopes + own labs — nothing outside scope." },
    ],
    file: [
      { kind: "out", text: "ibrahim.sys: ELF 64-bit LSB executable, x86-64, dynamically linked" },
      { kind: "out", text: "sha256: ~7.8k lines, hand-written — 0/64 engines flag it" },
      { kind: "out", text: "verdict: clean. full source published — run `verify`." },
    ],
    contact: [
      { kind: "out", text: "fastest channel: email — see contact section below" },
      { kind: "out", text: "or run `github` and open an issue on any repo" },
    ],
    uptime: [{ kind: "out", text: "3+ years shipping — since 2023, still studying, still shipping" }],
    date: [{ kind: "out", text: new Date().toString() }],
    sudo: [{ kind: "err", text: "permission denied: this shell runs as user ibrahim, not root." }],
    whoareyou: [{ kind: "out", text: "the shell, not the dev. run `whoami`." }],
  };
}

function Block({ id }: { id: BlockId }) {
  if (id === "whoami") {
    return (
      <div className="my-1 border-l border-phos/15 pl-4">
        <p className="font-display text-lg font-bold text-mint">IBRAHIM AHMED</p>
        <p className="text-fog italic">front-end engineer · creative technologist</p>
        <p className="mt-2 max-w-2xl text-mint/80">
          front-end &amp; full-stack — real-time 3D web, SaaS products, Flutter apps, and
          ML that runs on <span className="text-terra">$45 hardware</span>. bug bounty +
          reverse engineering on the side.
        </p>
      </div>
    );
  }
  if (id === "projects") {
    return (
      <div className="my-2 grid gap-3 border-l border-phos/15 pl-4 md:grid-cols-3">
        {featuredProjects.slice(0, 3).map((p) => (
          <a
            key={p.id}
            href={p.link ?? "#work"}
            {...(p.link ? { target: "_blank", rel: "noreferrer" } : {})}
            className="block border border-phos/20 bg-phos/5 p-3 transition-colors hover:border-phos/50"
          >
            <p className="text-[11px] text-phos">
              [{p.index}] {p.title}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-mint/75">{p.tagline}</p>
          </a>
        ))}
      </div>
    );
  }
  return (
    <div className="my-1 flex flex-wrap gap-x-5 gap-y-1 border-l border-phos/15 pl-4 text-fog">
      {stackChips.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </div>
  );
}

export default function Terminal({ inputRef }: { inputRef?: RefObject<HTMLInputElement> }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [snakeOpen, setSnakeOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const localInput = useRef<HTMLInputElement>(null);

  /* the one orchestrated moment: the shell tells the story on arrival.
     scriptTimerRef lets run() cancel it — a user command mid-boot takes over. */
  const scriptTimerRef = useRef<number | null>(null);
  const scriptDoneRef = useRef(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(SCRIPT);
      scriptDoneRef.current = true;
      return;
    }
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setLines(SCRIPT.slice(0, step));
      if (step >= SCRIPT.length) {
        window.clearInterval(timer);
        scriptTimerRef.current = null;
        scriptDoneRef.current = true;
      }
    }, 360);
    scriptTimerRef.current = timer;
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const prompt: Line = { kind: "in", text: `ibrahim@sys:~$ ${cmd}` };
    // taking the prompt mid-boot ends the story — the user drives now
    if (scriptTimerRef.current !== null) {
      window.clearInterval(scriptTimerRef.current);
      scriptTimerRef.current = null;
      scriptDoneRef.current = true;
    }
    if (!cmd) {
      setLines((l) => [...l, prompt]);
      return;
    }
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);

    if (cmd === "clear") {
      setLines([]);
      return;
    }
    if (cmd === "github") {
      window.open(GITHUB_URL, "_blank", "noreferrer");
      setLines((l) => [...l, prompt, { kind: "out", text: "opening github.com/Locked-Cloud …" }]);
      return;
    }
    const key = cmd.split(/\s+/)[0].toLowerCase();
    const rawArg = cmd.split(/\s+/).slice(1).join(" ");
    const arg = rawArg.toLowerCase();

    if (key === "goto") {
      const id = GOTO_TARGETS[arg];
      if (id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setLines((l) => [...l, prompt, { kind: "out", text: `→ /#${id}` }]);
      } else {
        setLines((l) => [
          ...l,
          prompt,
          { kind: "err", text: `goto: unknown target '${arg}' — try session · work · skills · log · github · blog · contact` },
        ]);
      }
      return;
    }
    if (key === "theme") {
      const tone = PHOSPHORS[arg];
      if (tone) {
        document.documentElement.style.setProperty("--color-phos", tone[0]);
        document.documentElement.style.setProperty("--color-phos-bright", tone[1]);
        setLines((l) => [
          ...l,
          prompt,
          { kind: "out", text: `phosphor set to ${arg} — ${TUBE_LORE[arg]}.` },
        ]);
      } else {
        const quiet = document.body.classList.toggle("quiet");
        setLines((l) => [
          ...l,
          prompt,
          {
            kind: "out",
            text: quiet
              ? "quiet mode — matrix rain off. run `theme` to bring the weather back."
              : "full weather restored.",
          },
        ]);
      }
      return;
    }
    if (key === "encode" || key === "decode" || key === "hex" || key === "rot13") {
      setLines((l) => [...l, prompt, ...codecLines(key, rawArg)]);
      return;
    }
    if (key === "sha256") {
      if (!rawArg) {
        setLines((l) => [...l, prompt, { kind: "err", text: "sha256: give me an argument" }]);
        return;
      }
      // real hash — the browser's own webcrypto
      crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(rawArg))
        .then((buf) => {
          const hex = Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
          setLines((l) => [...l, prompt, { kind: "out", text: `sha256: ${hex}` }]);
        });
      return;
    }
    if (key === "uuid") {
      setLines((l) => [...l, prompt, { kind: "out", text: `uuid: ${crypto.randomUUID()}` }]);
      return;
    }
    if (key === "man") {
      if (!arg) {
        setLines((l) => [...l, prompt, { kind: "err", text: "what manual page do you want? try `man verify`" }]);
      } else {
        const page = MAN[arg];
        setLines((l) => [
          ...l,
          prompt,
          ...(page
            ? page.map((text): Line => ({ kind: "out", text }))
            : [{ kind: "err" as const, text: `No manual entry for ${arg}` }]),
        ]);
      }
      return;
    }
    if (key === "history") {
      setLines((l) => [
        ...l,
        prompt,
        { kind: "out", text: `${history.length} commands this session:` },
        ...[...history]
          .reverse()
          .map((c, i): Line => ({ kind: "out", text: `  ${String(i + 1).padStart(3)}  ${c}` })),
      ]);
      return;
    }
    if (key === "!!") {
      const last = history.find((c) => c !== "!!");
      if (!last) {
        setLines((l) => [...l, prompt, { kind: "err", text: "!!: no previous command" }]);
      } else {
        setLines((l) => [...l, { kind: "in", text: `ibrahim@sys:~$ !! → ${last}` }]);
        run(last);
      }
      return;
    }
    if (key === "share") {
      const target = rawArg || history.find((c) => c !== "share" && c !== "!!");
      const tKey = target?.trim().toLowerCase().split(/\s+/)[0];
      if (!target || !tKey || !COMMAND_NAMES.includes(tKey)) {
        setLines((l) => [
          ...l,
          prompt,
          {
            kind: "err",
            text: target
              ? `share: \`${tKey}\` isn't auto-runnable — try \`share hack\``
              : "share: nothing to share — run a command first",
          },
        ]);
        return;
      }
      const url = `${location.origin}${location.pathname}?run=${encodeURIComponent(target.trim())}`;
      navigator.clipboard
        ?.writeText(url)
        .then(
          () => setLines((l) => [...l, prompt, { kind: "out", text: `copied: ${url}` }]),
          () => setLines((l) => [...l, prompt, { kind: "out", text: `clipboard blocked — ${url}` }])
        );
      return;
    }
    if (key === "snake") {
      setLines((l) => [...l, prompt]);
      setSnakeOpen(true);
      return;
    }

    const out = commands()[key];
    if (out) {
      setLines((l) => [...l, prompt, ...out]);
    } else if (key === "echo") {
      setLines((l) => [...l, prompt, { kind: "out", text: cmd.slice(5) }]);
    } else {
      setLines((l) => [
        ...l,
        prompt,
        { kind: "err", text: `command not found: ${key} — try \`help\`` },
      ]);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (snakeOpen) return; // the game owns the keyboard while it runs
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length) {
        const next = Math.min(histIdx + 1, history.length - 1);
        setHistIdx(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIdx - 1;
      setHistIdx(Math.max(next, -1));
      setValue(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab") {
      // shell etiquette: complete the command in progress
      e.preventDefault();
      const v = value.trimStart().toLowerCase();
      if (!v || v.includes(" ")) return;
      const hit = COMMAND_NAMES.find((c) => c.startsWith(v));
      if (hit) setValue(hit + " ");
    } else if (e.ctrlKey && e.key === "l") {
      e.preventDefault();
      setLines([]);
      setValue("");
    } else if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      if (value) {
        setLines((l) => [...l, { kind: "in", text: `ibrahim@sys:~$ ${value}^C` }]);
      }
      setValue("");
    }
  };

  /* shareable command links — /?run=hack auto-fires once the script lands */
  const autoRanRef = useRef(false);
  useEffect(() => {
    if (autoRanRef.current || !scriptDoneRef.current) return;
    autoRanRef.current = true;
    const cmd = new URLSearchParams(window.location.search).get("run");
    if (!cmd) return;
    const key = cmd.trim().toLowerCase().split(/\s+/)[0];
    if (!COMMAND_NAMES.includes(key)) return; // no arbitrary injection
    const t = window.setTimeout(() => run(cmd), 600);
    return () => window.clearTimeout(t);
  }, [lines, run]);

  /* konami code — the rain pours for four seconds */
  useEffect(() => {
    const seq = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
    ];
    let idx = 0;
    const onKey = (e: globalThis.KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = k === seq[idx] ? idx + 1 : k === seq[0] ? 1 : 0;
      if (idx === seq.length) {
        idx = 0;
        document.body.classList.add("godmode");
        setLines((l) => [
          ...l,
          { kind: "in", text: "ibrahim@sys:~$ ↑↑↓↓←→←→ba" },
          { kind: "out", text: "KONAMI ACCEPTED — god mode: the rain pours. 4s." },
        ]);
        window.setTimeout(() => document.body.classList.remove("godmode"), 4000);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="panel flex h-[560px] flex-col overflow-hidden rounded-lg lg:h-[620px]"
      onClick={() => (inputRef ?? localInput).current?.focus()}
    >
      {/* chrome */}
      <div className="flex items-center justify-between border-b border-phos/15 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5">
            <i className="h-3 w-3 rounded-full bg-danger/50" />
            <i className="h-3 w-3 rounded-full bg-gold/50" />
            <i className="h-3 w-3 rounded-full bg-phos/50" />
          </span>
          <span className="ml-3 text-[11px] uppercase tracking-[0.2em] text-fog">
            ibrahim@sys — 128×48
          </span>
        </div>
        <div className="flex items-center gap-2">
          <i className="pulse-dot h-1.5 w-1.5 rounded-full bg-phos" />
          <span className="text-[10px] uppercase tracking-widest text-phos">System Online</span>
        </div>
      </div>

      {/* output */}
      <div
        ref={scrollRef}
        className="terminal-scrollbar relative grow overflow-y-auto px-5 py-4 text-[13px] leading-relaxed sm:px-6"
        aria-live="polite"
      >
        {snakeOpen && (
          <SnakeGame
            onExit={(score) => {
              setSnakeOpen(false);
              setLines((l) => [...l, { kind: "out", text: `snake closed — final score ${score}` }]);
              (inputRef ?? localInput).current?.focus();
            }}
          />
        )}
        {lines.map((line, i) =>
          line.kind === "block" ? (
            <Block key={i} id={line.block} />
          ) : (
            <p
              key={i}
              className={
                line.kind === "in"
                  ? "text-phos-bright"
                  : line.kind === "err"
                    ? "text-danger"
                    : line.text.startsWith("[")
                      ? "text-fog/60 text-[12px]"
                      : "text-mint/75"
              }
            >
              {line.text}
            </p>
          )
        )}
      </div>

      {/* prompt */}
      <div className="flex items-center gap-2 border-t border-phos/15 px-5 py-3.5 sm:px-6">
        <span className="shrink-0 text-[13px] text-phos-bright">ibrahim@sys:~$</span>
        <input
          ref={inputRef ?? localInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-[13px] text-mint outline-none placeholder:text-fog"
          placeholder="type help"
          autoComplete="off"
          spellCheck={false}
          aria-label="terminal input"
        />
      </div>

      {/* touch chips — a prompt is useless on phones without them */}
      <div
        className="flex gap-2 overflow-x-auto border-t border-phos/15 px-4 py-2.5 md:hidden"
        role="toolbar"
        aria-label="quick commands"
      >
        {["help", "projects", "verify", "scorecard", "hack", "arsenal", "encode hello"].map((c) => (
          <button
            key={c}
            type="button"
            className="tag shrink-0 border-phos/35 text-phos"
            onClick={() => run(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* footer hints */}
      <div className="flex items-center justify-between border-t border-phos/15 bg-white/5 px-5 py-2.5 text-[10px] tracking-widest text-fog sm:px-6">
        <p>TIPS: TYPE &lsquo;HACK&rsquo;, &lsquo;VERIFY&rsquo;, OR &lsquo;TRACE&rsquo;</p>
        <p className="hidden sm:block">SESSION: GUEST · TTY1</p>
      </div>
    </div>
  );
}
