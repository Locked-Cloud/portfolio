import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { SectionHead } from "./SectionHead";

const Scene3D = lazy(() => import("./Scene3D"));

/** Loads the 3D scene only when scrolled into view. */
export default function Proof() {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="proof" ref={ref} className="mx-auto mt-28 max-w-6xl scroll-mt-24 px-4">
      <SectionHead
        index="00 — PROOF"
        title="REAL-TIME 3D, LIVE"
        note="not a video — drag it"
        arabic="ثلاثي الأبعاد"
      />
      <div className="panel relative overflow-hidden rounded-lg p-2" data-reveal>
        <Suspense
          fallback={
            <div className="flex h-[420px] items-center justify-center text-[11px] tracking-[0.25em] text-fog">
              LOADING THREE.JS…
            </div>
          }
        >
          {show ? <Scene3D /> : (
            <div className="flex h-[420px] items-center justify-center text-[11px] tracking-[0.25em] text-fog">
              SCROLL CLOSER TO LOAD THE SCENE
            </div>
          )}
        </Suspense>
      </div>
      <p className="mt-4 text-center text-[12px] text-fog">
        a procedural wireframe molar with its canal path in gold — the same idea that drives{" "}
        <a
          href="#work"
          className="text-phos underline decoration-phos/40 underline-offset-4 hover:text-phos-bright"
        >
          PULPOVR
        </a>
        . three.js is dynamically imported the moment you scrolled here.
      </p>
    </section>
  );
}
