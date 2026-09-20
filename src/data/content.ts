export interface Project {
  id: string;
  index: string;
  title: string;
  arabic?: string;
  tagline: string;
  description: string;
  tech: string[];
  link?: string;
  status?: "LIVE" | "WIP" | "PRIV";
  year?: string;
  image?: string;
  imageAlt?: string;
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
      { src: `${PULPOVR_ASSETS}/analytics_dashboard.jpg`, alt: "Student analytics dashboard" },
    ],
    arabic: "توأم رقمي لحظي",
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
    image: "/projects/smart-parking.jpg",
    imageAlt: "Miniature parking lot with teal detection boxes — generated in-style visual",
    arabic: "رؤية على الحافة",
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
    title: "BAZARNA — بازارنا",
    image: "/projects/bazarna.jpg",
    imageAlt: "Wireframe bazaar alley with gold lanterns — generated in-style visual",
    tagline: "Egypt-first multi-tenant SaaS ecommerce",
    description:
      "Storefronts with the payments Egyptians actually use — COD, InstaPay, Fawry, smart wallets — Arabic-first RTL, a visual page builder, a haggling engine «فاوضني», and an AI merchant twin. React + Supabase (RLS, Edge Functions, pg_cron) on Cloudflare Pages, engineered for a $0 stack.",
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
    image: "/projects/lms.jpg",
    imageAlt: "Dark terminal dashboard with progress bars and certificate seal — generated visual (code is private)",
    tagline: "9 months · 668 commits · one product",
    description:
      "A course platform in production shape: React 19 + MUI 7 + Firebase, Express 5 backend. Measured performance work (bundle 1488→1425 kB, CSS 91→29 kB), per-tenant SEO with JSON-LD, and a security scan-diff tool with a 23-test suite.",
    tech: ["React 19", "Express 5", "Firebase", "SEO", "Security tooling"],
    status: "PRIV",
    year: "2025–26",
  },
];

export const moreProjects: Project[] = [
  {
    id: "free-state",
    index: "05",
    title: "free-state",
    tagline: "production PWA",
    description: "Installable PWA: offline pages, service-worker caching, OTP auth, ~1,000 files.",
    tech: ["React", "TS", "PWA"],
    link: "https://github.com/Locked-Cloud/free-state",
    status: "LIVE",
  },
  {
    id: "raiv",
    index: "06",
    title: "RAIV-GPGPU",
    tagline: "GPU fetch-stage simulator",
    description: "C simulation of a GPGPU instruction-fetch stage — cache, scheduler, decoder, RAM traces.",
    tech: ["C", "Architecture"],
    link: "https://github.com/Locked-Cloud/RAIV-GPGPU",
    status: "LIVE",
  },
  {
    id: "webscraper",
    index: "07",
    title: "WebScraper_PlayWright",
    tagline: "data pipelines at scale",
    description: "Adaptive batching, retry backoff, checkpointing, proxy validation, GUI.",
    tech: ["Python", "Playwright"],
    link: "https://github.com/Locked-Cloud/WebScraper_PlayWright",
    status: "LIVE",
  },
  {
    id: "canny",
    index: "08",
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
  arabic: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "FRONTEND",
    arabic: "الواجهات",
    skills: ["React 18 / 19", "TypeScript", "Vite", "Tailwind CSS v4", "Three.js / R3F", "MUI 7", "TanStack Query", "Zustand", "RTL & i18n"],
  },
  {
    title: "BACKEND",
    arabic: "الخدمات",
    skills: ["Node.js / Express 5", "Supabase · Postgres · RLS", "Edge Functions", "Firebase", "JWT & OTP flows", "pg_cron jobs"],
  },
  {
    title: "SYSTEMS",
    arabic: "الأنظمة",
    skills: ["C / C++ — ESP32 firmware", "GPGPU simulation", "Python — YOLO · NCNN · OpenCV", "Playwright pipelines", "MATLAB", "Assembly"],
  },
  {
    title: "PRACTICES",
    arabic: "الأساليب",
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
    title: "Real-time & Cairo-flavored SaaS",
    note: "PULPOVR streams sensor data into 3D. Bazarna productizes the Egyptian souq. This portfolio ships.",
  },
];

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
  "[    0.000000] CAIRO.SYS kernel 6.4.2-ibrahim-ahmed",
  "[    0.042188] initializing cairo interface layers…",
  "[    0.104291] CPU: realtime-3d optimization enabled",
  "[    0.293810] AUTH: user 'guest' granted read access",
];

export const stackChips: string[] = [
  ".react-18", ".typescript", ".vite", ".tailwind-v4", ".three-js", ".supabase",
  ".node-express", ".python", ".esp32-c", ".playwright",
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
  ["kernel", "cairo.sys 6.4.2"],
  ["host", "front-end engineer"],
  ["uptime", "3+ years shipping"],
  ["shell", "react 18 + vite"],
  ["resolution", "40 Hz realtime"],
  ["wm", "three.js / R3F"],
  ["langs", "AR / EN (dual-script)"],
  ["location", "cairo, eg — 30.04°N 31.23°E"],
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

export const COORDINATES = "30.0444° N, 31.2357° E";

export interface Social {
  name: string;
  handle: string;
  url: string;
  live: boolean;
}

export const socials: Social[] = [
  { name: "GitHub", handle: "@Locked-Cloud", url: "https://github.com/Locked-Cloud", live: true },
  { name: "LinkedIn", handle: "/in/ibrahim-ahmed", url: "#", live: false }, // TODO: real URL
  { name: "Email", handle: "ibrahim@—", url: "mailto:you@example.com", live: true }, // TODO: real address
];

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
export const EMAIL_TODO = "you@example.com"; // TODO: replace with real address

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
    slug: "terminal-portfolio",
    title: "Why my portfolio is a terminal",
    date: "2026-09-21",
    minutes: 3,
    excerpt:
      "A shell that answers, stats with provenance chips, and Arabic in the matrix rain — the design decisions behind CAIRO.SYS.",
    body: [
      "Most portfolios are a grid of cards. Mine boots a kernel log, tells you who I am as command output, and hands you the prompt. That choice came from a collision: a hacker-terminal reference (matrix rain, scanlines, a shell you can type into) met my own design language — the warm, Arabic-first identity I built for Bazarna, an Egypt-first SaaS.",
      "Neon green on black is a costume. I swapped it for phosphor nile-teal on warm-dark ink, used gold exactly once (the availability chip), and let Arabic glyphs fall through the matrix rain next to the latin ones. The terminal says Cairo, not Hollywood.",
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

