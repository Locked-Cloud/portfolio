import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
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
  COORDINATES,
  GITHUB_URL,
} from "../data/content";

type BlockId = "whoami" | "projects" | "stack";
type Line = { kind: "in" | "out" | "err"; text: string } | { kind: "block"; block: BlockId };

const SCRIPT: Line[] = [
  ...kernelLog.map((text): Line => ({ kind: "out", text })),
  { kind: "in", text: "ibrahim@cairo:~$ whoami" },
  { kind: "block", block: "whoami" },
  { kind: "in", text: "ibrahim@cairo:~$ cat projects/active.md" },
  { kind: "block", block: "projects" },
  { kind: "in", text: "ibrahim@cairo:~$ ls -a .stack" },
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
  "  github      — open github profile",
  "  social      — direct channels",
  "  contact     — how to reach me",
  "  uptime      — years at the keyboard",
  "  clear       — wipe the screen",
];

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
          building interfaces that feel like <span className="text-terra">Cairo</span>, not
          California — real-time 3D web, SaaS products, and ML that runs on $45 hardware.{" "}
          <span dir="rtl" lang="ar" className="font-arabic text-phos/90">
            نفس الروح، شكل جديد.
          </span>
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
            <p className="text-[11px] text-gold">
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const localInput = useRef<HTMLInputElement>(null);

  /* the one orchestrated moment: the shell tells the story on arrival */
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(SCRIPT);
      return;
    }
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setLines(SCRIPT.slice(0, step));
      if (step >= SCRIPT.length) window.clearInterval(timer);
    }, 360);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const prompt: Line = { kind: "in", text: `ibrahim@cairo:~$ ${cmd}` };
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
    }
  };

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
            ibrahim@cairo — 128×48
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
        className="terminal-scrollbar grow overflow-y-auto px-5 py-4 text-[13px] leading-relaxed sm:px-6"
        aria-live="polite"
      >
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
        <span className="shrink-0 text-[13px] text-phos-bright">ibrahim@cairo:~$</span>
        <input
          ref={inputRef ?? localInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-[13px] text-mint outline-none placeholder:text-fog/50"
          placeholder="type help"
          autoComplete="off"
          spellCheck={false}
          aria-label="terminal input"
        />
      </div>

      {/* footer hints */}
      <div className="flex items-center justify-between border-t border-phos/15 bg-white/5 px-5 py-2.5 text-[10px] tracking-widest text-fog/50 sm:px-6">
        <p>TIPS: TYPE &lsquo;VERIFY&rsquo;, &lsquo;SCORECARD&rsquo;, OR &lsquo;CLEAR&rsquo;</p>
        <p className="hidden sm:block">LOC: {COORDINATES}</p>
      </div>
    </div>
  );
}
