import { useEffect, useState } from "react";
import { ghFallback } from "../data/content";
import type { GhUser } from "../App";
import { SectionHead } from "./SectionHead";

interface Repo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  fork: boolean;
}

function useRepos(): { repos: Repo[]; live: boolean } {
  const [repos, setRepos] = useState<Repo[]>(ghFallback.repos);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/users/Locked-Cloud/repos?per_page=100&sort=updated", {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Repo[]) => {
        const curated = data
          .filter((r) => !r.fork && r.name !== "Locked-Cloud")
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        if (curated.length) {
          setRepos(curated);
          setLive(true);
        }
      })
      .catch(() => undefined); // rate-limited → bundled snapshot stays
    return () => controller.abort();
  }, []);

  return { repos, live };
}

export default function GitHubLive({ user }: { user: GhUser }) {
  const { repos, live } = useRepos();

  return (
    <section id="github" className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead
        index="04 — GITHUB"
        title="GITHUB · LIVE"
        note={live ? "rest v3 · live" : "cached snapshot · api offline"}
        arabic="الحساب"
      />

      <div className="panel p-6 sm:p-8" data-reveal>
        <div className="flex flex-wrap items-center gap-5 border-b border-phos/12 pb-6">
          <img
            src={user.avatar_url}
            alt="GitHub avatar"
            width={64}
            height={64}
            className="h-16 w-16 border border-phos/30 object-cover"
            style={{ imageRendering: "auto" }}
          />
          <div>
            <h3 className="font-display text-lg font-bold text-mint">
              <a href={user.html_url} target="_blank" rel="noreferrer" className="hover:text-phos">
                {user.name} ↗
              </a>
            </h3>
            <p className="mt-0.5 text-[12.5px] text-fog">“{user.bio}”</p>
          </div>
          <div className="ml-auto flex gap-6 text-center">
            <div>
              <p className="font-display text-2xl font-bold text-phos">{user.public_repos}</p>
              <p className="text-[10px] tracking-widest text-fog">REPOS</p>
            </div>
            {user.followers !== null && (
              <div>
                <p className="font-display text-2xl font-bold text-phos">{user.followers}</p>
                <p className="text-[10px] tracking-widest text-fog">FOLLOWERS</p>
              </div>
            )}
          </div>
        </div>

        <ul className="divide-y divide-phos/8">
          {repos.map((r) => (
            <li key={r.name}>
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3.5"
              >
                <span className="text-[13.5px] font-semibold text-mint group-hover:text-phos">
                  {r.name}
                </span>
                {r.language && (
                  <span className="text-[11px] text-gold/80">{r.language}</span>
                )}
                <span className="ml-auto text-[11px] text-fog">★ {r.stargazers_count}</span>
                <p className="w-full text-[12px] text-mint/55">
                  {r.description ?? "—"}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
