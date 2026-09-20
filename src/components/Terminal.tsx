import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import {
  featuredProjects,
  moreProjects,
  skillGroups,
  journey,
  socials,
  GITHUB_URL,
} from "../data/content";

interface Line {
  kind: "in" | "out" | "err";
  text: string;
}

const BANNER: Line[] = [
  { kind: "out", text: "CAIRO.SYS shell v1.0 — ibrahim@cairo" },
  { kind: "out", text: "type `help` to list commands" },
];

function commands(): Record<string, string[]> {
  return {
    help: [
      "available commands:",
      "  whoami      — who is this",
      "  projects    — selected work",
      "  skills      — the toolbox",
      "  log         — journey, git-style",
      "  github      — open github profile",
      "  social      — direct channels",
      "  contact     — how to reach me",
      "  uptime      — years at the keyboard",
      "  clear       — wipe the screen",
    ],
    whoami: [
      "ibrahim ahmed — front-end engineer · cairo, eg",
      "focus: real-time 3D web · SaaS · edge ML",
      "motto: don't let other people write your script.",
    ],
    projects: [
      ...featuredProjects.map(
        (p) => `  ${p.title.padEnd(20)} ${p.year ?? ""}  [${p.status ?? "—"}]  ${p.tagline}`
      ),
      `  …+ ${moreProjects.length} more on github — run \`github\``,
    ],
    skills: skillGroups.map((g) => `${g.title.toLowerCase().padEnd(9)} ${g.skills.join(" · ")}`),
    log: journey.map((j) => `  ${j.hash}  ${j.year}  ${j.title}`),
    social: socials.map((s) => `  ${s.name.padEnd(10)} ${s.handle} ${s.live ? "" : "(todo)"}`),
    contact: [
      "fastest channel: email — see contact section below",
      "or run `github` and open an issue on any repo",
    ],
    uptime: ["3+ years shipping — since 2023, still studying, still shipping"],
    date: [new Date().toString()],
    sudo: ["permission denied: this shell runs as user ibrahim, not root."],
    whoareyou: ["the shell, not the dev. run `whoami`."],
  };
}

export default function Terminal({ inputRef }: { inputRef?: RefObject<HTMLInputElement> }) {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const localInput = useRef<HTMLInputElement>(null);

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
    const table = commands();
    const key = cmd.split(/\s+/)[0].toLowerCase();
    const out = table[key];
    if (out) {
      setLines((l) => [...l, prompt, ...out.map((text): Line => ({ kind: "out", text }))]);
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
    <div className="panel flex h-full flex-col" onClick={() => (inputRef ?? localInput).current?.focus()}>
      <div className="flex items-center gap-2 border-b border-phos/15 px-4 py-2.5 text-[11px] tracking-widest text-fog">
        <span className="flex gap-1.5">
          <i className="block h-2.5 w-2.5 rounded-full bg-danger/70" />
          <i className="block h-2.5 w-2.5 rounded-full bg-gold/70" />
          <i className="block h-2.5 w-2.5 rounded-full bg-phos/70" />
        </span>
        <span className="ml-2">ibrahim@cairo — zsh — 80×24</span>
      </div>

      <div
        ref={scrollRef}
        className="h-72 grow overflow-y-auto px-4 py-3 text-[12.5px] leading-relaxed lg:h-[330px]"
        aria-live="polite"
      >
        {lines.map((line, i) => (
          <p
            key={i}
            className={
              line.kind === "in"
                ? "text-phos-bright"
                : line.kind === "err"
                  ? "text-danger"
                  : "text-mint/75"
            }
          >
            {line.text}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-phos/15 px-4 py-3">
        <span className="shrink-0 text-[12.5px] text-phos">ibrahim@cairo:~$</span>
        <input
          ref={inputRef ?? localInput}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-[12.5px] text-mint outline-none placeholder:text-fog/50"
          placeholder="type help"
          autoComplete="off"
          spellCheck={false}
          aria-label="terminal input"
        />
      </div>
    </div>
  );
}
