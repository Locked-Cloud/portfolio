import { useEffect, useState } from "react";
import { featuredProjects, skillGroups, journey, availability, GITHUB_URL, EMAIL } from "../data/content";

/**
 * One-page printable CV, bilingual — EN and AR faces of the same document.
 * Paper-inverted identity, plain-CSS scoped under .cv-page (deterministic
 * for print). Ctrl+P → save as PDF works in either language.
 */

interface CvDict {
  hint: string;
  site: string;
  print: string;
  name: string;
  role: string;
  profileTitle: string;
  profile: string;
  workTitle: string;
  skillsTitle: string;
  timelineTitle: string;
  footer: string;
  groups: Record<string, string>;
  projectNotes: Record<string, string>;
  timeline: Record<string, string>;
}

const AR: CvDict = {
  name: "إبراهيم أحمد",
  role: "مهندس واجهات أمامية & full-stack · ويب ثلاثي الأبعاد لحظي · SaaS · تعلّم آلي على الحافة · أمن تطبيقات",
  hint: "هذه الصفحة تُطبع على ورقة A4 واحدة — Ctrl+P → حفظ كـ PDF",
  site: "← الموقع",
  print: "طباعة / PDF",
  profileTitle: "نبذة",
  profile:
    "مهندس واجهات أمامية وطالب علوم حاسب. أبني واجهات سريعة الاستجابة — ثلاثي الأبعاد اللحظي بـThree.js، ومنصات SaaS متعددة المستأجرين على بنية تحتية بتكلفة صفر، وتعلّم آلي يعمل على أجهزة حافة. أتحرك عبر الطبقات كلها: برمجات ESP32 المدمجة، وخدمات Node/Express وSupabase، وواجهات React 18/19 بـTypeScript.",
  workTitle: "أعمال مختارة",
  skillsTitle: "المهارات",
  timelineTitle: "المسيرة",
  groups: { FRONTEND: "الواجهات", BACKEND: "الخدمات", SYSTEMS: "الأنظمة", PRACTICES: "الأساليب" },
  projectNotes: {
    pulpoVr: "توأم رقمي لعملية علاج جذور: مستشعر IMU بست درجات حرية يبث 40 مرة/ث عبر WebSocket إلى سن ثلاثي الأبعاد تفاعلي — من البرمجة المدمجة حتى الواجهة.",
    "smart-parking": "دورة تعلّم آلي كاملة على الحافة: ضبط YOLO ثم تصدير NCNN وتشغيل لحظي على Raspberry Pi 4 بـ12–20 إطار/ث.",
    bazarna: "منصة تجارة إلكترونية مصرية: دفع عند الاستلام وInstaPay وفوري، عربية أولاً RTL، ومحرك مساومة «فاوضني» — على بنية بتكلفة صفر.",
    lms: "منصة تعليمية بمعايير الإنتاج: 668 commit في 9 أشهر، React 19 + Express 5، وأدوات قياس أداء وأمان مُختبرة.",
  },
  timeline: {
    Foundations: "الأساسيات — ++C وجافا وهياكل بيانات",
    "Python & vision": "بايثون والرؤية — تطبيقات رؤية حاسوبية وأدوات جمع بيانات",
    "Shipping real apps": "شحن تطبيقات حقيقية — PWA إنتاجي وواجهات API محصّنة",
    "The LMS years": "سنوات الـLMS — 668 commit على منتج واحد بأدوات أداء وأمان",
    "Real-time & SaaS": "اللحظي ومنصات SaaS — بث المستشعرات إلى ثلاثي الأبعاد، ومنصة تجارة إلكترونية",
  },
  footer: "كل رقم في هذه الصفحة له مصدر — نفّذ الأمر verify في طرفية الموقع · نفس الروح، شكل جديد",
};

const EN: CvDict = {
  hint: "this page prints on one A4 — Ctrl+P → save as PDF",
  site: "← site",
  print: "print / pdf",
  name: "IBRAHIM AHMED",
  role: "Front-end & Full-stack Engineer · real-time 3D web · SaaS · edge ML · security",
  profileTitle: "Profile",
  profile:
    "Front-end engineer and CS student. I build interfaces that answer back — real-time 3D (Three.js), multi-tenant SaaS on $0 infrastructure, and machine learning deployed on edge hardware. Comfortable across the whole stack: ESP32 firmware, Node/Express and Supabase backends, and React 18/19 frontends in TypeScript.",
  workTitle: "Selected work",
  skillsTitle: "Skills",
  timelineTitle: "Timeline",
  groups: {},
  projectNotes: {},
  timeline: {},
  footer: "sources for every number: run verify in the site terminal",
};

export default function CvPage() {
  const [ar, setAr] = useState(false);
  const t = ar ? AR : EN;

  useEffect(() => {
    document.title = `Ibrahim Ahmed — CV${ar ? " (AR)" : ""}`;
  }, [ar]);

  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      lang={ar ? "ar" : "en"}
      className={`cv-page mx-auto bg-white px-10 py-12 ${ar ? "font-arabic" : "font-body"} text-[12.5px] leading-relaxed`}
    >
      {/* screen-only toolbar */}
      <div className="cv-border2 mb-8 flex flex-wrap items-center justify-between gap-3 pb-4 print:hidden">
        <p className="cv-muted text-[11px] uppercase tracking-[0.2em]">{t.hint}</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => setAr(!ar)} className="cv-btn warn" aria-pressed={ar}>
            {ar ? "EN" : "عربي"}
          </button>
          <a href="/" className="cv-btn">
            {t.site}
          </a>
          <button type="button" className="cv-btn solid" onClick={() => window.print()}>
            {t.print}
          </button>
        </div>
      </div>

      <header className="cv-border2 mb-6 pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight">{t.name}</h1>
        <p className="cv-teal mt-1 text-[13px]">{t.role}</p>
        <p className="cv-muted mt-2 text-[11.5px]">
          {GITHUB_URL.replace("https://", "")} · {EMAIL}
        </p>
        <p className="cv-teal mt-1 text-[11px]">{ar ? `متاح: عن بُعد · حضوري · انتقال · عمل حر` : `open to: ${availability}`}</p>
      </header>

      <section className="mb-6">
        <h2 className="cv-h2 mb-2 font-display text-[13px] font-bold uppercase tracking-[0.2em]">
          {t.profileTitle}
        </h2>
        <p className="cv-profile">{t.profile}</p>
      </section>

      <section className="mb-6">
        <h2 className="cv-h2 mb-3 font-display text-[13px] font-bold uppercase tracking-[0.2em]">
          {t.workTitle}
        </h2>
        <div className="space-y-4">
          {featuredProjects.map((p) => (
            <article key={p.id} className="cv-row">
              <p className="cv-teal pt-0.5 text-[11px] font-semibold">{p.year}</p>
              <div>
                <h3 className="font-display text-[13.5px] font-bold">
                  {p.title}
                  {p.link && (
                    <span className="cv-teal ml-2 font-body text-[10.5px] font-normal">
                      {p.link.replace("https://github.com/Locked-Cloud/", "…/")}
                    </span>
                  )}
                </h3>
                <p className="cv-body mt-0.5 text-[12px]">
                  {ar ? (t.projectNotes[p.id] ?? p.description) : p.description}
                </p>
                <p className="cv-muted mt-1 text-[11px]">{p.tech.join(" · ")}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="cv-h2 mb-3 font-display text-[13px] font-bold uppercase tracking-[0.2em]">
          {t.skillsTitle}
        </h2>
        <dl className="space-y-1.5">
          {skillGroups.map((g) => (
            <div key={g.title} className="cv-row">
              <dt className="text-[11px] font-semibold uppercase tracking-wider">
                {ar ? (t.groups[g.title] ?? g.title) : g.title}
              </dt>
              <dd className="cv-body text-[12px]">{g.skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="cv-h2 mb-3 font-display text-[13px] font-bold uppercase tracking-[0.2em]">
          {t.timelineTitle}
        </h2>
        <ul className="space-y-1">
          {journey.map((j) => (
            <li key={j.hash} className="cv-row text-[12px]">
              <span className="cv-teal font-semibold">{j.year}</span>
              <span className="cv-body">
                <strong className="text-[#1a1512]">
                  {ar ? (t.timeline[j.title] ?? j.title) : j.title}
                </strong>
                {ar ? "" : ` — ${j.note}`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="cv-rule cv-muted mt-6 pt-3 text-[10.5px]">{t.footer}</footer>
    </div>
  );
}
