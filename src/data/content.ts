export interface Project {
  id: string;
  index: string;
  title: string;
  arabic?: string;
  tagline: string;
  description: string;
  tech: string[];
  link?: string;
  status?: "live" | "in-progress" | "private";
  metrics?: { label: string; value: string }[];
}

export const featuredProjects: Project[] = [
  {
    id: "pulpoVr",
    index: "01",
    title: "PULPOVR — Live Endodontic Guidance",
    arabic: "تدريب أسنان لحظي",
    tagline: "Real-time dental digital twin",
    description:
      "A 6-DOF IMU mounted on a dental handpiece streams telemetry at 40 Hz over WebSocket into an interactive Three.js molar — apex-locator safety HUD, trajectory panels, and student analytics. Built end to end: React 18 + TypeScript frontend, Express + WebSocket backend, ESP32 firmware in C++.",
    tech: ["React 18", "TypeScript", "Three.js / R3F", "WebSocket", "Express", "ESP32 / C++"],
    link: "https://github.com/Locked-Cloud/dental-project",
    status: "live",
    metrics: [
      { label: "Telemetry", value: "40 Hz" },
      { label: "Layers", value: "Firmware → 3D UI" },
      { label: "License", value: "MIT" },
    ],
  },
  {
    id: "smart-parking",
    index: "02",
    title: "Smart Parking Detection",
    arabic: "رؤية على الحافة",
    tagline: "Edge ML, the whole lifecycle",
    description:
      "An 8-step pipeline — capture, auto-label with a pretrained model, two-stage YOLO fine-tuning, NCNN export — deployed to a Raspberry Pi 4 running real-time occupancy detection at 12–20 FPS with temporal smoothing. Ships with a plug-and-play baseline model and a full deployment guide.",
    tech: ["Python", "YOLOv8", "NCNN", "OpenCV", "Raspberry Pi 4", "Multithreading"],
    link: "https://github.com/Locked-Cloud/Smart-Parking-System",
    status: "live",
    metrics: [
      { label: "Inference", value: "12–20 FPS" },
      { label: "Hardware", value: "RPi4 · 2 GB" },
      { label: "Pipeline", value: "8 steps" },
    ],
  },
  {
    id: "bazarna",
    index: "03",
    title: "Bazarna — بازارنا",
    arabic: "السوق المصري، مكشّر",
    tagline: "Egypt-first SaaS ecommerce",
    description:
      "Multi-tenant storefronts with the payments Egyptians actually use — COD, InstaPay, Fawry, smart wallets — Arabic-first RTL, a visual page builder, a haggling engine «فاوضني», and an AI merchant twin. React + Supabase (RLS, Edge Functions, pg_cron) on Cloudflare Pages, engineered for a $0 stack.",
    tech: ["React 18", "Tailwind v4", "Supabase", "RLS", "Cloudflare Pages", "RTL / i18n"],
    status: "in-progress",
    metrics: [
      { label: "Infra cost", value: "$0" },
      { label: "Tenancy", value: "Multi-tenant" },
      { label: "Languages", value: "AR-first, EN" },
    ],
  },
];

export const moreProjects: Project[] = [
  {
    id: "lms",
    index: "04",
    title: "LMS SaaS Platform",
    tagline: "9 months, 668 commits",
    description:
      "A course platform in production shape: React 19 + MUI 7 + Firebase, Express 5 backend. Measured performance work (bundle 1488→1425 kB, CSS 91→29 kB), per-tenant SEO with JSON-LD, and a security scan-diff tool with a 23-test suite.",
    tech: ["React 19", "Express 5", "Firebase", "SEO", "Security tooling"],
    status: "private",
  },
  {
    id: "free-state",
    index: "05",
    title: "Free State",
    tagline: "Production PWA",
    description:
      "A real-estate platform ~1,000 files strong: installable PWA with offline pages, service-worker caching, network-status UX, auth with OTP flows, and protected routes. Shipped on Netlify + Cloudflare Pages.",
    tech: ["React", "TypeScript", "PWA", "Service Worker", "Auth"],
    link: "https://github.com/Locked-Cloud/free-state",
    status: "live",
  },
  {
    id: "raiv",
    index: "06",
    title: "RAIV-GPGPU",
    tagline: "GPU fetch-stage simulator",
    description:
      "A C simulation of a GPGPU instruction-fetch stage — cache, scheduler, decoder, RAM models with logged cycle traces. Systems programming that keeps my feet on the ground while my head is in the browser.",
    tech: ["C", "Computer architecture", "Simulation"],
    link: "https://github.com/Locked-Cloud/RAIV-GPGPU",
    status: "live",
  },
  {
    id: "webscraper",
    index: "07",
    title: "Playwright Scrapers",
    tagline: "Data pipelines at scale",
    description:
      "Production-grade scraping: adaptive batching, retry with backoff, checkpointing across runs, proxy validation, and a GUI — built for e-commerce catalogs of thousands of products.",
    tech: ["Python", "Playwright", "Selenium", "Async IO"],
    link: "https://github.com/Locked-Cloud/WebScraper_PlayWright",
    status: "live",
  },
];

export interface SkillGroup {
  title: string;
  arabic: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Front-end",
    arabic: "الواجهات",
    skills: ["React 18 / 19", "TypeScript", "Vite", "Tailwind CSS v4", "Three.js / R3F", "MUI 7", "TanStack Query", "Zustand", "RTL & i18n"],
  },
  {
    title: "Back-end",
    arabic: "الخدمات",
    skills: ["Node.js / Express 5", "Supabase — Postgres · RLS · Edge Functions", "Firebase", "REST APIs", "JWT & OTP flows", "pg_cron jobs"],
  },
  {
    title: "Systems & Data",
    arabic: "الأنظمة",
    skills: ["C / C++ — ESP32 firmware", "GPGPU simulation", "Python — YOLO · NCNN · OpenCV", "Playwright pipelines", "MATLAB", "Assembly"],
  },
  {
    title: "Practices",
    arabic: "الأساليب",
    skills: ["Row-Level Security models", "Performance budgets — measured", "Conventional commits", "AI-assisted dev pipelines", "$0 / free-tier architecture"],
  },
];

export interface JourneyStop {
  year: string;
  title: string;
  note: string;
}

export const journey: JourneyStop[] = [
  {
    year: "2023",
    title: "Foundations",
    note: "C++, Java, data structures — the GitHub account opens with maze solvers and calculators.",
  },
  {
    year: "2024",
    title: "Python & vision",
    note: "Computer vision, Flutter, scrapers, and a first full-stack attendance system (Node + EJS).",
  },
  {
    year: "2025",
    title: "Shipping real apps",
    note: "A production PWA for real estate, security-hardened Express APIs, scrapers that survive long runs.",
  },
  {
    year: "2025–26",
    title: "The LMS years",
    note: "668 commits on one product: React 19, measured perf work, per-tenant SEO, security tooling with tests.",
  },
  {
    year: "2026",
    title: "Real-time & Cairo-flavored SaaS",
    note: "PULPOVR streams sensor data into 3D. Bazarna productizes the Egyptian souq. This portfolio ships.",
  },
];

export const heroStats: { value: string; label: string }[] = [
  { value: "29", label: "public repos" },
  { value: "700+", label: "commits on one product" },
  { value: "40 Hz", label: "live 3D telemetry" },
  { value: "$0", label: "infrastructure bill" },
];

export const GITHUB_URL = "https://github.com/Locked-Cloud";
