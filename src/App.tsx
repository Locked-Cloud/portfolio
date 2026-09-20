import { useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Journey from "./components/Journey";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { observeReveals } from "./lib/reveal";

export default function App() {
  useEffect(() => observeReveals(), []);

  return (
    <div className="min-h-screen bg-sand text-ink font-body">
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Projects />
        <Skills />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
