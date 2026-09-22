export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  link?: string;
  status?: "LIVE" | "WIP" | "PRIV";
  year?: string;
  image?: string;
  imageAlt?: string;
  /** thumbnails that read near-black at card size get a brightness lift */
  lift?: boolean;
  gallery?: { src: string; alt: string }[];
  metrics?: { label: string; value: string }[];
}

const PULPOVR_ASSETS = "https://raw.githubusercontent.com/Locked-Cloud/dental-project/HEAD/docs/assets";

export const featuredProjects: Project[] = [
  {
    id: "pulpoVr",
    index: "01",
    title: "PULPOVR",
    image: `${PULPOVR_ASSETS}/hero_banner.jpg`,
    imageAlt: "PULPOVR cockpit — 3D tooth digital twin with telemetry gauges",
    gallery: [
      { src: `${PULPOVR_ASSETS}/hero_banner.jpg`, alt: "PULPOVR cockpit — full interface" },
      { src: `${PULPOVR_ASSETS}/digital_twin_3d.jpg`, alt: "Digital twin — 3D tooth with canal path" },
      { src: `${PULPOVR_ASSETS}/hardware_wiring.jpg`, alt: "The ~$30 hardware — ESP32 + MPU-6050 IMU wired to the handpiece" },
      { src: `${PULPOVR_ASSETS}/analytics_dashboard.jpg`, alt: "Student analytics dashboard" },
      { src: `${PULPOVR_ASSETS}/tooth_anatomy.png`, alt: "Tooth anatomy reference — crown, canals, apex" },
    ],
    tagline: "Live endodontic guidance — real-time dental digital twin",
    description:
      "A 6-DOF IMU mounted on a dental handpiece streams telemetry at 40 Hz over WebSocket into an interactive Three.js molar — apex-locator safety HUD, trajectory panels, student analytics. Built end to end: React 18 + TypeScript frontend, Express + WebSocket backend, ESP32 firmware in C++.",
    tech: ["React 18", "TypeScript", "Three.js / R3F", "WebSocket", "Express", "ESP32 / C++"],
    link: "https://github.com/Locked-Cloud/dental-project",
    status: "LIVE",
    year: "2026",
    metrics: [
      { label: "telemetry", value: "40 Hz" },
      { label: "layers", value: "firmware → 3D" },
      { label: "license", value: "MIT" },
    ],
  },
  {
    id: "smart-parking",
    index: "02",
    title: "SMART-PARKING",
    image: "./projects/smart-parking.jpg",
    imageAlt: "Miniature parking lot with teal detection boxes — generated in-style visual",
    lift: true,
    tagline: "Edge ML — the whole lifecycle on a Raspberry Pi 4",
    description:
      "An 8-step pipeline — capture, auto-label, two-stage YOLO fine-tuning, NCNN export — deployed to a Raspberry Pi 4 running real-time occupancy detection at 12–20 FPS with temporal smoothing. Ships with a plug-and-play baseline model and a full deployment guide.",
    tech: ["Python", "YOLOv8", "NCNN", "OpenCV", "RPi 4", "Multithreading"],
    link: "https://github.com/Locked-Cloud/Smart-Parking-System",
    status: "LIVE",
    year: "2026",
    metrics: [
      { label: "inference", value: "12–20 FPS" },
      { label: "hardware", value: "RPi4 · 2 GB" },
      { label: "pipeline", value: "8 steps" },
    ],
  },
  {
    id: "bazarna",
    index: "03",
    title: "BAZARNA",
    image: "./projects/bazarna.jpg",
    imageAlt: "Wireframe bazaar alley with gold lanterns — generated in-style visual",
    tagline: "Egypt-first multi-tenant SaaS ecommerce",
    description:
      "Storefronts with the payments Egyptians actually use — COD, InstaPay, Fawry, smart wallets — Arabic-first RTL, a visual page builder, a haggling engine (fawadni), and an AI merchant twin. React + Supabase (RLS, Edge Functions, pg_cron) on Cloudflare Pages, engineered for a $0 stack.",
    tech: ["React 18", "Tailwind v4", "Supabase", "RLS", "Cloudflare", "RTL / i18n"],
    status: "WIP",
    year: "2026",
    metrics: [
      { label: "infra", value: "$0" },
      { label: "tenancy", value: "multi" },
      { label: "langs", value: "AR-first" },
    ],
  },
  {
    id: "lms",
    index: "04",
    title: "LMS-PLATFORM",
    image: "./projects/lms.jpg",
    imageAlt: "Dark terminal dashboard with progress bars and certificate seal — generated visual (code is private)",
    lift: true,
    tagline: "9 months · 668 commits · one product",
    description:
      "A course platform in production shape: React 19 + MUI 7 + Firebase, Express 5 backend. Measured performance work (bundle 1488→1425 kB, CSS 91→29 kB), per-tenant SEO with JSON-LD, and a security scan-diff tool with a 23-test suite.",
    tech: ["React 19", "Express 5", "Firebase", "SEO", "Security tooling"],
    status: "PRIV",
    year: "2025–26",
    metrics: [
      { label: "commits", value: "668" },
      { label: "e2e tests", value: "23" },
      { label: "span", value: "9 mo" },
    ],
  },
  {
    id: "plant-diseases",
    index: "05",
    title: "PLANT-DISEASES",
    image: "./projects/flutter.svg",
    imageAlt: "Wireframe phone scanning a leaf with a detection box — in-style visual (the app is real)",
    tagline: "Flutter · leaf-scan diagnosis app",
    description:
      "A Flutter app that diagnoses plant diseases from leaf photos — image recognition through a REST service, a curated disease database with symptoms and treatments, scan history, and translation. 1.7K lines of Dart targeting five platforms.",
    tech: ["Flutter", "Dart", "image_picker", "REST", "Provider state"],
    link: "https://github.com/Locked-Cloud/flutter-plant-diseases",
    status: "LIVE",
    year: "2024",
    metrics: [
      { label: "loc", value: "1.7K" },
      { label: "platforms", value: "5" },
      { label: "screens", value: "10+" },
    ],
  },
];

export const moreProjects: Project[] = [
  {
    id: "free-state",
    index: "06",
    title: "free-state",
    tagline: "production PWA",
    description: "Installable PWA: offline pages, service-worker caching, OTP auth, ~1,000 files.",
    tech: ["React", "TS", "PWA"],
    link: "https://github.com/Locked-Cloud/free-state",
    status: "LIVE",
  },
  {
    id: "raiv",
    index: "07",
    title: "RAIV-GPGPU",
    tagline: "GPU fetch-stage simulator",
    description: "C simulation of a GPGPU instruction-fetch stage — cache, scheduler, decoder, RAM traces.",
    tech: ["C", "Architecture"],
    link: "https://github.com/Locked-Cloud/RAIV-GPGPU",
    status: "LIVE",
  },
  {
    id: "webscraper",
    index: "08",
    title: "WebScraper_PlayWright",
    tagline: "data pipelines at scale",
    description: "Adaptive batching, retry backoff, checkpointing, proxy validation, GUI.",
    tech: ["Python", "Playwright"],
    link: "https://github.com/Locked-Cloud/WebScraper_PlayWright",
    status: "LIVE",
  },
  {
    id: "canny",
    index: "09",
    title: "Canny-Edge-Live",
    tagline: "real-time computer vision",
    description: "Live-camera edge detection with OpenCV — where the CV journey started.",
    tech: ["Python", "OpenCV"],
    link: "https://github.com/Locked-Cloud/Canny-Edge-Detection---Live-Camera-Application",
    status: "LIVE",
  },
];

export interface SkillGroup {
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "FRONTEND",
    skills: ["React 18 / 19", "TypeScript", "Vite", "Tailwind CSS v4", "Three.js / R3F", "MUI 7", "TanStack Query", "Zustand", "RTL & i18n"],
  },
  {
    title: "BACKEND",
    skills: ["Node.js / Express 5", "Supabase · Postgres · RLS", "Edge Functions", "Firebase", "JWT & OTP flows", "pg_cron jobs"],
  },
  {
    title: "SYSTEMS",
    skills: ["C / C++ — ESP32 firmware", "GPGPU simulation", "Python — YOLO · NCNN · OpenCV", "Playwright pipelines", "MATLAB", "Assembly"],
  },
  {
    title: "SECURITY",
    skills: ["Bug bounty — XSS · IDOR · SSRF · SQLi · broken auth", "Burp Suite · OWASP ZAP", "nuclei · ffuf", "Reverse engineering — Ghidra · radare2 · x64dbg", "Malware analysis — static triage · sandboxed dynamics · YARA", "Secure coding — RLS models · scan-diff tooling"],
  },
  {
    title: "MOBILE",
    skills: ["Flutter · Dart", "image_picker → REST diagnosis flows", "5 platform targets — android · ios · macos · linux · web", "Scan history & provider state"],
  },
  {
    title: "PRACTICES",
    skills: ["Row-Level Security models", "Performance budgets — measured", "Conventional commits", "AI-assisted dev pipelines", "$0 / free-tier architecture"],
  },
];

export interface JourneyStop {
  hash: string;
  year: string;
  title: string;
  note: string;
}

export const journey: JourneyStop[] = [
  {
    hash: "a1f03c2",
    year: "2023",
    title: "Foundations",
    note: "C++, Java, data structures — the account opens with maze solvers and calculators.",
  },
  {
    hash: "b7e91d4",
    year: "2024",
    title: "Python & vision",
    note: "Computer vision, Flutter, scrapers, and a first full-stack attendance system (Node + EJS).",
  },
  {
    hash: "c3a55e8",
    year: "2025",
    title: "Shipping real apps",
    note: "A production PWA for real estate, security-hardened Express APIs, scrapers that survive long runs.",
  },
  {
    hash: "d9b12f7",
    year: "2025–26",
    title: "The LMS years",
    note: "668 commits on one product: React 19, measured perf work, per-tenant SEO, security tooling with tests.",
  },
  {
    hash: "e5c88a3",
    year: "2026",
    title: "Real-time & SaaS",
    note: "PULPOVR streams sensor data into 3D. Bazarna productizes marketplace commerce. This portfolio ships.",
  },
];

/* ─── ~/graveyard — decisions with a kill date (idea-generation discipline).
   A living document: entries can come back. Revivals are on record too. ── */

export interface GraveItem {
  name: string;
  killed: string;
  reason: string;
  revived?: string;
}

export const graveyard: GraveItem[] = [
  {
    name: "teal restraint pass",
    killed: "2026-09-21",
    reason: "read as a designed page wearing a terminal costume — the client called it: full CRT instead",
  },
  {
    name: "arabic as design actor",
    killed: "2026-09-21",
    reason: "direction change — english-first terminal; the bilingual /cv keeps the other face",
  },
  {
    name: "neon-green CRT skin",
    killed: "2026-09",
    revived: "2026-09-21 — full green-phosphor direction",
    reason: "killed for reading as borrowed; revived when the brief became 'be a terminal'",
  },
  {
    name: "per-section staggered reveals",
    killed: "2026-09",
    reason: "scattered motion — the boot sequence is the only show now",
  },
  {
    name: "scanlines overlay",
    killed: "2026-09",
    revived: "2026-09-21 — CRT commit means CRT",
    reason: "killed as one accessory too many; revived with the whole outfit",
  },
  {
    name: "github-readme-stats cards",
    killed: "2026-09",
    reason: "third-party 503s on a good day — first-party charts only",
  },
  {
    name: "cloudflare-pages deploy",
    killed: "2026-09",
    reason: "GitHub Pages won at $0 — one command swaps back",
  },
];

/* ─── PULPOVR effort allocation — counted, not estimated ────────────────────
   Source: wc -l over the repo clone at HEAD, 2026-09-21.
   TS/TSX 6,419 · JS/config 886 · firmware (.ino 447 + config.h 48) 495 → ~7.8K */

export const pulpoLoc = {
  total: "~7.8K",
  source: "counted from HEAD, 2026-09",
  split: [
    { lang: "TypeScript / TSX", loc: "6.4K", pct: 82 },
    { lang: "JS / config", loc: "0.9K", pct: 11 },
    { lang: "C++ firmware", loc: "0.5K", pct: 7 },
  ],
};

/* ─── V2 hero: stats carry their provenance (idea-generation discipline) ── */

export interface StatClaim {
  value: string;
  label: string;
  sub: string;
  chip: "record" | "measured" | "by-design";
  source: string;
}

export const statClaims: StatClaim[] = [
  {
    value: "29",
    label: "PUBLIC REPOS",
    sub: "public surface",
    chip: "record",
    source: "github.com/Locked-Cloud — public record",
  },
  {
    value: "700+",
    label: "COMMITS / PRODUCT",
    sub: "one codebase, 9 months",
    chip: "record",
    source: "git log — LMS platform, 2025-12 → 2026-09 (private)",
  },
  {
    value: "40 Hz",
    label: "LIVE TELEMETRY",
    sub: "sensor → 3D scene",
    chip: "measured",
    source: "PULPOVR — MPU-6050 stream over WebSocket",
  },
  {
    value: "$0",
    label: "INFRA BILL",
    sub: "by design",
    chip: "by-design",
    source: "Cloudflare Pages + Supabase free tiers",
  },
];

/* ─── Terminal narrative + command data ─────────────────────────────────── */

export const kernelLog: string[] = [
  "[    0.000000] IBRAHIM.SYS kernel 6.4.2",
  "[    0.042188] initializing interface layers…",
  "[    0.104291] CPU: realtime-3d optimization enabled",
  "[    0.293810] AUTH: user 'guest' granted read access",
];

export const stackChips: string[] = [
  ".react-18", ".typescript", ".vite", ".tailwind-v4", ".three-js", ".supabase",
  ".node-express", ".python", ".esp32-c", ".playwright", ".flutter", ".ghidra", ".yara",
];

export const scorecard: { repo: string; stars: string; verdict: string }[] = [
  { repo: "dental-project", stars: "★1", verdict: "7.5K LOC + firmware + best docs — CHOSEN" },
  { repo: "Smart-Parking-System", stars: "★2", verdict: "edge-ML lifecycle + RPi4 deploy — CHOSEN" },
  { repo: "MatLab-Code", stars: "★4", verdict: "514 LOC of course scripts — passed" },
  { repo: "Maze_Solver", stars: "★4", verdict: "single-file solver — passed" },
];

export const neofetchArt: string[] = [
  "        ▲",
  "       ▲ ▲",
  "      ▲ ▲ ▲",
  "     ▲ ▲ ▲ ▲",
  "    ▲ ▲ ▲ ▲ ▲",
];

export const neofetchSpecs: [string, string][] = [
  ["kernel", "ibrahim.sys 6.4.2"],
  ["host", "front-end engineer"],
  ["uptime", "3+ years shipping"],
  ["shell", "react 18 + vite"],
  ["resolution", "40 Hz realtime"],
  ["wm", "dom-native"],
  ["langs", "EN · AR docs"],
  ["location", "undisclosed"],
];

export const coverageLines: string[] = [
  "covered here:",
  "  29 public repos — live via GitHub REST (or cached snapshot)",
  "  featured projects — selected by engineering merit, not stars",
  "not covered here:",
  "  LMS platform — 668 commits, private. ask me about it.",
  "  AC_Ecommerce — security-hardened API, not yet pushed",
  "  the test suites — they live in private repos",
  "policy: no number without a source — run `verify`",
];

export const COORDINATES = "30.0444° N, 31.2357° E"; // CV-only fact; main site says "undisclosed"

export interface Social {
  name: string;
  handle: string;
  url: string;
  live: boolean;
}

export const socials: Social[] = [
  { name: "GitHub", handle: "@Locked-Cloud", url: "https://github.com/Locked-Cloud", live: true },
  { name: "LinkedIn", handle: "/in/lockedcloud", url: "https://www.linkedin.com/in/lockedcloud/", live: true },
  { name: "Hack The Box", handle: "users/1908251", url: "https://app.hackthebox.com/users/1908251", live: true },
  { name: "Email", handle: "locked.cloud1day@gmail.com", url: "mailto:locked.cloud1day@gmail.com", live: true },
];

/** what the open-to-work signal actually covers */
export const availability = "remote · cairo on-site · relocation · freelance";

/** Snapshot fallback if the GitHub API is rate-limited — data from the 2026-09 study. */
export const ghFallback = {
  name: "Ibrahim Ahmed",
  bio: "Don't let other people write your script.",
  avatar_url: "https://avatars.githubusercontent.com/u/142117977?v=4",
  public_repos: 29,
  followers: null as number | null,
  repos: [
    { name: "dental-project", description: "PULPOVR: real-time dental digital twin, 6-DOF IMU telemetry", stargazers_count: 1, language: "TypeScript", html_url: "https://github.com/Locked-Cloud/dental-project", fork: false },
    { name: "Smart-Parking-System", description: "YOLO → NCNN edge ML on Raspberry Pi 4", stargazers_count: 2, language: "Python", html_url: "https://github.com/Locked-Cloud/Smart-Parking-System", fork: false },
    { name: "free-state", description: "Real-estate PWA with offline support", stargazers_count: 1, language: "TypeScript", html_url: "https://github.com/Locked-Cloud/free-state", fork: false },
    { name: "WebScraper_PlayWright", description: "Adaptive e-commerce scraping pipelines", stargazers_count: 3, language: "Python", html_url: "https://github.com/Locked-Cloud/WebScraper_PlayWright", fork: false },
    { name: "flutter-plant-diseases", description: "Plant-disease classification app", stargazers_count: 4, language: "Dart", html_url: "https://github.com/Locked-Cloud/flutter-plant-diseases", fork: false },
    { name: "MatLab-Code", description: "Communications: AM/FM/PM modulation scripts", stargazers_count: 4, language: "MATLAB", html_url: "https://github.com/Locked-Cloud/MatLab-Code", fork: false },
  ],
};

export const GITHUB_URL = "https://github.com/Locked-Cloud";
export const EMAIL = "locked.cloud1day@gmail.com";

/** what's actually being built right now — shown in the tmux bar */
export const currentFocus = "bounty lab";

/* ─── Blog / devlog ────────────────────────────────────────────────────── */

export interface Post {
  slug: string;
  title: string;
  date: string;
  minutes: number;
  excerpt: string;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: "malware-analysis-lab",
    title: "Malware analysis: static first, sandbox always",
    date: "2026-09-22",
    minutes: 4,
    excerpt:
      "The defensive kind — reading samples instead of writing them. Triage discipline, isolated labs, YARA rules, and why this made me a safer developer.",
    body: [
      "Malware analysis, the way I practice it, is a defensive discipline: you take a sample that already exists and you answer three questions — what does it do, how did it get in, and how do we detect it next time. Nobody in this workflow writes malware. You read it, the way a doctor reads an X-ray.",
      "Static first, because most samples tell their story before they ever run. Hash the file and check its reputation — if it's known, you're done. Then the cheap observations: readable strings, imported functions, section entropy. A binary that imports process-injection APIs and shows one high-entropy section and no readable strings has told you it's packed before you've executed anything. Tools: a good hex editor, PE-bear for structure, DIE for packers, Ghidra when it's time to actually read code.",
      "Dynamic only inside a sandbox, always. An isolated VM with snapshots, no route to anything I care about, and fake services where the sample expects a network. Then you let it run and watch what it actually does — files written, persistence installed, endpoints contacted — with x64dbg on breakpoints and a capture on the wire. The rule is boring and absolute: the sample never touches a host that matters, and never reaches a real network.",
      "Observations become detection: that's YARA. A rule that names the packing signature, the import set, the strings that made the sample identifiable — so the next scanner pass catches its relatives. Writing a YARA rule is the moment analysis stops being private curiosity and becomes a contribution to defense.",
      "Why does a front-end and full-stack developer do this? Because the attacks that reach my layer come through supply chains — one hostile npm package is a sample, and `npm install` is its execution vector. The same reflex — hash, diff, inspect imports, isolate — is what the scan-diff tooling on this site runs against dependencies. Reading malware made me a safer builder, which is the only kind of malware analyst a product team should want.",
    ],
  },
  {
    slug: "bug-bounty-lab",
    title: "My bug bounty lab: Burp → nuclei → Ghidra",
    date: "2026-09-22",
    minutes: 3,
    excerpt:
      "No war stories yet — just the lab I run daily, the scope discipline that keeps it legal, and why a front-end dev hunts bugs at all.",
    body: [
      "This post has no findings in it, on purpose. What it has is the lab: the tools I run daily and the rules I follow, so that when the war stories come, they'll be earned.",
      "The kit: Burp Suite is the daily driver — repeater and intruder for manual work, because the interesting bugs never fall to automated scans. OWASP ZAP covers the quick pass, nuclei runs template checks at scale, ffuf does content discovery. When a target has a binary component, Ghidra and radare2 come out; x64dbg for the Windows side. Type `arsenal` in the terminal above — the policy line prints with the tools.",
      "Scope discipline is the whole game. I hunt on programs with published scopes and on my own lab targets, nothing else. Read the policy before the first request, stay inside the defined scope, report instead of exploit. That line in `arsenal` — bounty scopes + own labs, nothing outside — is not flavor text; it's the operating rule.",
      "Practice happens on Hack The Box machines and deliberately vulnerable targets before any real program gets touched — the classes that matter are XSS, IDOR, SSRF, SQLi, and broken auth. My HTB profile is linked in the contact section; the graphs there are the honest scoreboard.",
      "Why does a front-end engineer do this? Because every class above lives in the layer I build every day. Hunting IDOR teaches you exactly how an API leaks objects to a curious client; hunting XSS teaches you what your framework escapes and what it doesn't. The loop is short: finding bugs makes me write fewer of them — the LMS security scan-diff tooling on this site came out of exactly that reflex.",
    ],
  },
  {
    slug: "how-this-homepage-was-chosen",
    title: "Four heroes, one verdict",
    date: "2026-09-21",
    minutes: 3,
    excerpt:
      "The homepage you're on wasn't the first idea — it was the survivor of a written brief, four generated directions, and a kill-list. The selection process, in the open.",
    body: [
      "Before a single line of this site's real code existed, I generated four homepage directions against a written brief and judged them side by side. Not four mood boards — four working drafts, on one live canvas, each answering the same question differently: what is the hero of this page?",
      "The brief had tests, not vibes: exactly one orchestrated motion moment; one accent, used sparingly; less scattered effect; and the shell must actually answer — a terminal you can type into, not a picture of one. Any direction that failed a test was out, no matter how good it looked.",
      "The verdict was the direction that committed hardest: the shell is the hero. The terminal isn't chrome decorating a conventional hero section — it boots, tells you who I am as command output, and hands you the prompt. A quiet human row underneath keeps a person visible next to the machine. The losing directions weren't wasted: their good parts were harvested, and everything that didn't earn its place went to the graveyard — the per-section staggered reveals, the readme-stats cards. Each has a kill date and a reason, and the list is on the page, under the journey.",
      "Postscript, because the graveyard is a living document: the winning direction itself was killed weeks later. The restrained teal pass read as a designed page wearing a terminal costume — so the site went full green-phosphor CRT: scanlines, a BIOS boot, a tmux status bar. The tests survived the rewrite; only the direction didn't. That's the point of writing tests instead of falling in love.",
      "That's the transferable part, and it's why I'm writing this: write the tests before you fall in love. A brief you can fail is the only brief worth having — for a homepage, a component API, or a product.",
    ],
  },
  {
    slug: "terminal-portfolio",
    title: "Why my portfolio is a terminal",
    date: "2026-09-21",
    minutes: 3,
    excerpt:
      "A shell that answers, stats with provenance chips, and a CRT that commits — the design decisions behind IBRAHIM.SYS.",
    body: [
      "Most portfolios are a grid of cards. Mine boots a kernel log, tells you who I am as command output, and hands you the prompt. That choice came from a collision: a hacker-terminal reference (matrix rain, scanlines, a shell you can type into) met my own design language — the warm, Arabic-first identity I built for Bazarna, an Egypt-first SaaS.",
      "The first pass treated neon green as a costume and professionalized it — phosphor teal, warm-dark ink, Arabic glyphs falling through the matrix rain. Tasteful, and wrong: it read as a designed page wearing a terminal costume, not a terminal. So the rebuild committed: green phosphor on near-black, scanlines, a BIOS boot screen, a tmux status bar pinned to the bottom of your viewport, everything in one mono typeface. When the brief says terminal, be a terminal.",
      "The part I care most about is invisible until you type `verify`: every number on the page carries its source — [record], [measured], [by-design]. 29 repos is a public record. 40 Hz telemetry is a measurement from PULPOVR, my dental digital-twin project. $0 infra is an architecture decision, and I can show you the plan. `scorecard` prints the selection method: my two best projects have 1 and 2 stars; the 4-star repos are course scripts. Merit, not stars.",
      "A portfolio is a claim. This one tries to make its claims executable.",
    ],
  },
  {
    slug: "dental-twin-hardware",
    title: "A dental digital twin on ~$30 of hardware",
    date: "2026-09-14",
    minutes: 4,
    excerpt:
      "PULPOVR: an ESP32 and a 6-DOF IMU taped to a dental handpiece, streaming at 40 Hz into a Three.js molar. What I learned building end to end.",
    body: [
      "Root canals are done blind. The dentist feels for the canal apex through the instrument — skill built on thousands of procedures. PULPOVR asks: what if a student could see it instead?",
      "The hardware is deliberately cheap: an ESP32 and an MPU-6050 six-degree-of-freedom IMU mounted on a contra-angle handpiece — about thirty dollars. The ESP32 reads the sensor and streams telemetry over WebSocket at 40 Hz. A Node/Express relay keeps the sessions, and the browser end is React 18 with Three.js / React-Three-Fiber rendering an interactive molar: canal paths, an apex-locator safety HUD, trajectory panels, and session analytics for instructors.",
      "Writing it end to end taught me where the real problems live. Forty Hz sounds trivial until you own the whole pipe: firmware timing, WebSocket backpressure, and a 3D scene that must not stutter while it ingests. The virtual-device simulator I built alongside the firmware — so I could develop the frontend without a handpiece on my desk — ended up being the feature that made the demo possible anywhere.",
      "It's MIT-licensed and documented, wiring diagrams included. The clinical claims belong to dentists; the engineering is mine and it's on GitHub.",
    ],
  },
  {
    slug: "zero-dollar-shipping",
    title: "Shipping products on a $0 bill",
    date: "2026-09-07",
    minutes: 4,
    excerpt:
      "Cloudflare Pages, Supabase free tier, pg_cron keep-alives, and manual-first Egyptian payments — how the $0 architecture actually holds.",
    body: [
      "Every platform I've shipped — a real-estate PWA, an LMS, and Bazarna, an Egypt-first ecommerce SaaS — runs on infrastructure that costs nothing. That's not a hobby constraint; it's an architecture discipline that forces honest decisions.",
      "The stack: Cloudflare Pages for hosting (unlimited bandwidth on the free tier, commercial use allowed), Supabase for Postgres with Row-Level Security doing authorization — no API server for CRUD — Edge Functions only where secrets live, and pg_cron for scheduled jobs. The traps are known: Supabase pauses projects after seven idle days, so a keep-alive ping runs on a schedule; auth emails are rate-limited, so transactional email goes through a free SMTP relay; and a weekly encrypted pg_dump lands in a private repo as disaster insurance.",
      "The Egyptian twist is payments. Cash on delivery, InstaPay transfers, and smart-wallet transfers need no gateway at all — just a verification queue in the merchant console. A real gateway (Paymob) enters per-store with their own credentials when a store is ready, one iframe and one HMAC-verified webhook.",
      "$0 doesn't mean toy. It means every component must justify itself before it costs money. When one of these products outgrows the free tier, I'll know exactly which line item earned it.",
    ],
  },
];

