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
  metrics?: { label: string; value: string }[];
}

export const featuredProjects: Project[] = [
  {
    id: "pulpoVr",
    index: "01",
    title: "PULPOVR",
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

export const heroStats: { value: string; label: string; sub: string }[] = [
  { value: "29", label: "PUBLIC REPOS", sub: "public surface" },
  { value: "700+", label: "COMMITS / PRODUCT", sub: "one codebase, 9 months" },
  { value: "40 Hz", label: "LIVE TELEMETRY", sub: "sensor → 3D scene" },
  { value: "$0", label: "INFRA BILL", sub: "by design" },
];

/* ─── Terminal-era content ─────────────────────────────────────────────── */

export const bootLines: { text: string; tone?: "ok" | "warn" | "dim" }[] = [
  { text: "CAIRO.SYS BIOS v2.6 — © 2026 Ibrahim Ahmed", tone: "dim" },
  { text: "CPU ......... curiosity @ 4.2 GHz .............. OK", tone: "ok" },
  { text: "MEM ......... 700+ commits mapped .............. OK", tone: "ok" },
  { text: "GPU ......... Three.js rasterizer .............. OK", tone: "ok" },
  { text: "RTL ......... Arabic / English dual-script .... OK", tone: "ok" },
  { text: "NET ......... github.com/Locked-Cloud ....... LINKED", tone: "ok" },
  { text: "WARN ........ neon levels set to 0 — professional mode", tone: "warn" },
  { text: "Mounting /portfolio .......................... DONE", tone: "ok" },
];

export const typedRoles: string[] = [
  "react + typescript interfaces",
  "real-time 3D — three.js / R3F",
  "SaaS on a $0 stack",
  "edge ML on a raspberry pi",
  "arabic-first product design",
];

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
