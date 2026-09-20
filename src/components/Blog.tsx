import { useState } from "react";
import { posts } from "../data/content";
import { SectionHead } from "./SectionHead";

export default function Blog() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="blog" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead index="05 — BLOG" title="DEVLOG" note="how, not just what" arabic="المدوّنة" />

      <div className="space-y-5">
        {posts.map((post) => {
          const expanded = open === post.slug;
          return (
            <article key={post.slug} id={`post-${post.slug}`} data-reveal className="panel p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : post.slug)}
                className="block w-full text-left"
                aria-expanded={expanded}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-mint hover:text-phos-bright sm:text-xl">
                    {post.title}
                  </h3>
                  <p className="text-[11px] tracking-widest text-fog">
                    {post.date} · {post.minutes} min
                  </p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mint/65">{post.excerpt}</p>
                <p className="mt-3 text-[12px] font-semibold text-phos">
                  {expanded ? "collapse ▲" : "read ▼"}
                </p>
              </button>
              {expanded && (
                <div className="mt-5 border-t border-phos/12 pt-5">
                  {post.body.map((para, i) => (
                    <p key={i} className="mb-4 max-w-[72ch] text-[13.5px] leading-[1.85] text-mint/80">
                      {para}
                    </p>
                  ))}
                  <p className="text-[11px] tracking-widest text-fog">
                    — ibrahim, {post.date} · run{" "}
                    <code className="text-phos">coverage</code> for what this page can't show
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
