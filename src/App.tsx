import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import MatrixRain from "./components/MatrixRain";
import Stats from "./components/Stats";
import Proof from "./components/Proof";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Journey from "./components/Journey";
import GitHubLive from "./components/GitHubLive";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { observeReveals } from "./lib/reveal";
import { cachedFetchJson } from "./lib/gh";
import { ghFallback } from "./data/content";

export interface GhUser {
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
  followers: number | null;
  html_url: string;
}

export default function App() {
  useEffect(() => observeReveals(), []);

  const [user, setUser] = useState<GhUser>({
    name: ghFallback.name,
    bio: ghFallback.bio,
    avatar_url: ghFallback.avatar_url,
    public_repos: ghFallback.public_repos,
    followers: ghFallback.followers,
    html_url: "https://github.com/Locked-Cloud",
  });

  useEffect(() => {
    let cancelled = false;
    cachedFetchJson<{
      name: string | null;
      bio: string | null;
      avatar_url: string;
      public_repos: number;
      followers: number;
      html_url: string;
    }>("https://api.github.com/users/Locked-Cloud").then((d) => {
      if (!d || cancelled) return;
      setUser({
        name: d.name ?? "Ibrahim Ahmed",
        bio: d.bio ?? "",
        avatar_url: d.avatar_url,
        public_repos: d.public_repos,
        followers: d.followers,
        html_url: d.html_url,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg font-body text-mint">
      <MatrixRain />
      <div className="vignette" aria-hidden />
      <div className="scanlines" aria-hidden />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Stats repos={user.public_repos} />
          <Proof />
          <Projects />
          <Skills />
          <Journey />
          <GitHubLive user={user} />
          <Blog />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
