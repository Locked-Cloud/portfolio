import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";

/**
 * LIVE TELEMETRY — the PULPOVR digital twin as an instrument, not a toy:
 * a scan sweep resolves the wireframe and locates three canals; a HUD
 * streams yaw / pitch / ω / fps / frame-count straight from the render
 * loop (DOM refs, no re-renders). Drag to orbit — the numbers spike with
 * your hand, which is the whole proof. Reduced motion skips the sweep.
 */
export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [scanPct, setScanPct] = useState(0);
  const [scanState, setScanState] = useState<"scanning" | "complete" | "hidden">("scanning");
  const [showHint, setShowHint] = useState(true);

  /* HUD — text nodes the render loop writes to directly */
  const hudFrame = useRef<HTMLSpanElement>(null);
  const hudFps = useRef<HTMLSpanElement>(null);
  const hudYaw = useRef<HTMLSpanElement>(null);
  const hudOmega = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const mount = mountRef.current;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = "none";
      renderer.domElement.style.cursor = "grab";

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x050806, 4, 11);

      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0.4, 6.2);
      camera.lookAt(0, -0.2, 0);

      const phos = 0x3dff88;
      const gold = 0xd9a441;

      // ── the molar ──
      const group = new THREE.Group();
      const wire = (geo: THREE_NS.BufferGeometry, color: number, opacity: number) => {
        const edges = new THREE.WireframeGeometry(geo);
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
        return new THREE.LineSegments(edges, mat);
      };

      /* wires that the scan sweep materializes: [object, base opacity, center Y] */
      const ramp: { mat: THREE_NS.LineBasicMaterial; base: number; y: number }[] = [];

      const crown = wire(new THREE.IcosahedronGeometry(1.35, 2), phos, 0.34);
      crown.scale.set(1.15, 0.85, 1.15);
      crown.position.y = 0.55;
      group.add(crown);
      ramp.push({ mat: crown.material as THREE_NS.LineBasicMaterial, base: 0.34, y: 0.55 });

      const rootGeo = new THREE.ConeGeometry(0.42, 1.9, 8, 3);
      const roots: [number, number, number, number][] = [
        [-0.5, -0.75, 0.15, 0.16],
        [0.5, -0.75, -0.15, -0.16],
        [0.05, -0.7, 0.62, 0],
      ];
      for (const [x, y, z, rz] of roots) {
        const r = wire(rootGeo, phos, 0.3);
        r.position.set(x, y, z);
        r.rotation.z = rz;
        if (z > 0.4) r.rotation.x = -0.22;
        group.add(r);
        ramp.push({ mat: r.material as THREE_NS.LineBasicMaterial, base: 0.3, y });
      }

      // ── three canals — the endodontic file's routes, in gold ──
      const canalMats: THREE_NS.LineBasicMaterial[] = [];
      const apexes: THREE_NS.Vector3[] = [];
      const canalPaths: THREE_NS.Vector3[][] = [
        [
          new THREE.Vector3(0, 1.55, 0.15),
          new THREE.Vector3(0.05, 0.6, 0.1),
          new THREE.Vector3(0, -0.2, 0.12),
          new THREE.Vector3(-0.42, -1.0, 0.18),
          new THREE.Vector3(-0.52, -1.62, 0.2),
        ],
        [
          new THREE.Vector3(0.1, 1.5, -0.05),
          new THREE.Vector3(0.1, 0.6, -0.1),
          new THREE.Vector3(0.05, -0.2, -0.12),
          new THREE.Vector3(0.42, -1.0, -0.15),
          new THREE.Vector3(0.52, -1.6, -0.18),
        ],
        [
          new THREE.Vector3(-0.05, 1.45, 0.25),
          new THREE.Vector3(0, 0.6, 0.3),
          new THREE.Vector3(0.02, -0.2, 0.45),
          new THREE.Vector3(0.03, -0.95, 0.65),
          new THREE.Vector3(0.05, -1.55, 0.68),
        ],
      ];
      for (const pts of canalPaths) {
        const curve = new THREE.CatmullRomCurve3(pts);
        const mat = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 1 });
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), mat));
        canalMats.push(mat);
        apexes.push(curve.getPoint(1));
      }
      const apexMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 1 });
      for (const tip of apexes) {
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), apexMat);
        dot.position.copy(tip);
        group.add(dot);
      }
      const apexPulse = apexes.map((_, i) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xb0ffcf, transparent: true, opacity: 0.9 }));
        m.position.copy(apexes[i]);
        group.add(m);
        return m;
      });

      // sparse gold points on the crown — lantern sparks
      const crownPts = new THREE.Points(
        crown.geometry,
        new THREE.PointsMaterial({ color: gold, size: 0.045, transparent: true, opacity: 0.85 })
      );
      crownPts.position.copy(crown.position);
      crownPts.scale.copy(crown.scale);
      group.add(crownPts);

      group.rotation.x = 0.18;
      scene.add(group);

      // ── the scan ring — sweeps once, materializing the model ──
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.0, 0.014, 8, 72),
        new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.85 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.visible = !reduced;
      scene.add(ring);
      const SCAN_DUR = 2.6; // seconds
      let scanT = reduced ? SCAN_DUR : 0;

      scene.add(new THREE.AmbientLight(0xd6efe4, 0.5));
      const warm = new THREE.PointLight(gold, 26, 14);
      warm.position.set(2.6, 1.8, 2.4);
      scene.add(warm);
      const cool = new THREE.PointLight(phos, 18, 14);
      cool.position.set(-2.8, -1.2, 2.2);
      scene.add(cool);

      // ── sizing ──
      const resize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(mount);

      // ── drag to spin, with inertia ──
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      let velX = 0;
      let velY = 0;

      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        renderer.domElement.style.cursor = "grabbing";
        renderer.domElement.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        velY = (e.clientX - lastX) * 0.0055;
        velX = (e.clientY - lastY) * 0.0035;
        lastX = e.clientX;
        lastY = e.clientY;
        group.rotation.y += velY;
        group.rotation.x += velX;
      };
      const onUp = (e: PointerEvent) => {
        dragging = false;
        renderer.domElement.style.cursor = "grab";
        if (renderer.domElement.hasPointerCapture(e.pointerId)) {
          renderer.domElement.releasePointerCapture(e.pointerId);
        }
      };
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerup", onUp);
      renderer.domElement.addEventListener("pointercancel", onUp);

      // ── render loop: sweep + inertia + HUD ──
      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        threshold: 0.05,
      });
      io.observe(mount);

      let frame = 0;
      let fps = 60;
      let omega = 0;
      let prevYaw = group.rotation.y;
      let lastPct = -1;

      const clock = new THREE.Clock();
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

      const paintScan = (t01: number) => {
        const ringY = -2.3 + t01 * 4.4;
        ring.position.y = ringY;
        // wires materialize as the ring passes their zone
        for (const w of ramp) {
          w.mat.opacity = w.base * Math.max(clamp01((ringY - (w.y - 0.9)) / 0.9), 0.05);
        }
        // canals + apex resolve in the final stretch
        const late = clamp01((t01 - 0.55) / 0.4);
        for (const m of canalMats) m.opacity = late;
        (crownPts.material as THREE_NS.PointsMaterial).opacity = 0.85 * late;
        apexMat.opacity = late;
      };

      const updHud = () => {
        if (hudFrame.current) hudFrame.current.textContent = String(frame).padStart(6, "0");
        if (hudFps.current) hudFps.current.textContent = `${fps.toFixed(0)} fps`;
        if (hudYaw.current) {
          const yaw = THREE.MathUtils.radToDeg(group.rotation.y).toFixed(1);
          const pitch = THREE.MathUtils.radToDeg(group.rotation.x).toFixed(1);
          hudYaw.current.textContent = `yaw ${yaw}° · pitch ${pitch}°`;
        }
        if (hudOmega.current) hudOmega.current.textContent = `ω ${Math.abs(omega).toFixed(2)} rad/s`;
      };

      const renderFrame = () => {
        raf = requestAnimationFrame(renderFrame);
        if (!visible || document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.1);
        const t = clock.elapsedTime;
        frame += 1;
        fps = fps * 0.92 + (1 / Math.max(dt, 1e-4)) * 0.08;

        if (scanT < SCAN_DUR) {
          scanT += dt;
          paintScan(clamp01(scanT / SCAN_DUR));
          const pct = Math.round(clamp01(scanT / SCAN_DUR) * 100);
          if (pct !== lastPct) {
            lastPct = pct;
            setScanPct(pct);
          }
          if (scanT >= SCAN_DUR) {
            ring.visible = false;
            for (const w of ramp) w.mat.opacity = w.base;
            for (const m of canalMats) m.opacity = 1;
            (crownPts.material as THREE_NS.PointsMaterial).opacity = 0.85;
            apexMat.opacity = 1;
            setScanState("complete");
            window.setTimeout(() => !disposed && setScanState("hidden"), 2200);
          }
        }

        if (!dragging) {
          group.rotation.y += 0.0022 + velY;
          group.rotation.x += velX;
          velY *= 0.94;
          velX *= 0.9;
          group.rotation.x = Math.max(-0.6, Math.min(0.8, group.rotation.x));
        }
        omega = (group.rotation.y - prevYaw) / Math.max(dt, 1e-4);
        prevYaw = group.rotation.y;

        // apex pulses breathe
        for (let i = 0; i < apexPulse.length; i++) {
          apexPulse[i].scale.setScalar(1 + Math.sin(t * 3.2 + i * 2.1) * 0.5);
        }

        if (frame % 6 === 0) updHud();
        renderer.render(scene, camera);
      };

      if (reduced) {
        for (const w of ramp) w.mat.opacity = w.base;
        setScanState("complete");
        window.setTimeout(() => !disposed && setScanState("hidden"), 1200);
        renderer.render(scene, camera);
        frame = 1;
        updHud();
        // still allow manual dragging without the loop
        renderer.domElement.addEventListener("pointermove", onMove);
        renderer.domElement.addEventListener("pointerup", () => renderer.render(scene, camera));
      } else {
        raf = requestAnimationFrame(renderFrame);
      }

      setReady(true);
      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerup", onUp);
        renderer.domElement.removeEventListener("pointercancel", onUp);
        renderer.dispose();
        scene.traverse((obj) => {
          const mesh = obj as THREE_NS.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mat = mesh.material as THREE_NS.Material | THREE_NS.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat?.dispose();
        });
        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  /* the affordance retires once it has taught you (or after a while) */
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setShowHint(false), 6000);
    return () => window.clearTimeout(t);
  }, [ready]);

  const blocks = Math.round(scanPct / 10);

  return (
    <div
      className="relative"
      onPointerDownCapture={() => setShowHint(false)}
    >
      <div
        ref={mountRef}
        className="h-[420px] w-full sm:h-[460px]"
        aria-label="Interactive 3D wireframe molar with three gold canals and live telemetry — drag to spin"
        role="img"
      />

      {/* viewfinder chrome */}
      <i aria-hidden className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-phos/50" />
      <i aria-hidden className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-phos/50" />
      <i aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-phos/50" />
      <i aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-phos/50" />

      {/* telemetry HUD — written straight from the render loop */}
      <div aria-hidden className="pointer-events-none absolute left-6 top-5 text-[10px] leading-relaxed tracking-[0.18em] text-fog">
        <p className="text-phos">PULPOVR DIGITAL TWIN</p>
        <p>
          frame <span ref={hudFrame}>000000</span>
        </p>
      </div>
      <div aria-hidden className="pointer-events-none absolute right-6 top-5 text-right text-[10px] leading-relaxed tracking-[0.18em] text-fog">
        <p>
          <span ref={hudFps} className="text-phos">
            — fps
          </span>
        </p>
        <p>
          canals 3 · apex <span className="text-gold">located</span>
        </p>
      </div>
      <div aria-hidden className="pointer-events-none absolute bottom-5 left-6 text-[10px] tracking-[0.18em] text-fog">
        <p>
          <span ref={hudYaw}>yaw —</span>
        </p>
        <p>
          <span ref={hudOmega}>ω — rad/s</span>
        </p>
      </div>

      {/* scan sweep status */}
      {scanState === "scanning" && (
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-14 text-center text-[11px] tracking-[0.22em] text-gold"
        >
          SCANNING [{"█".repeat(blocks)}{"░".repeat(10 - blocks)}] {scanPct}%
        </p>
      )}
      {scanState === "complete" && (
        <p
          aria-hidden
          className="glow pointer-events-none absolute inset-x-0 bottom-14 text-center text-[11px] tracking-[0.22em] text-phos-bright"
        >
          SCAN COMPLETE — 3 CANALS LOCATED
        </p>
      )}

      {/* drag affordance — fades on first touch */}
      {showHint && ready && (
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 text-center text-[10px] tracking-[0.35em] text-fog/80 transition-opacity duration-500"
        >
          DRAG TO ORBIT
        </p>
      )}

      {!ready && (
        <p className="absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.25em] text-fog">
          LOADING THREE.JS…
        </p>
      )}
    </div>
  );
}
