import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";

/**
 * REAL-TIME 3D, LIVE — a procedural wireframe molar with a gold canal path,
 * borrowed from PULPOVR's digital twin. three.js is dynamically imported the
 * first time this section scrolls into view, so it never weighs down the
 * initial load. Drag to spin; it also idles slowly. Reduced motion renders a
 * single static frame (still draggable).
 */
export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

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

      const crown = wire(new THREE.IcosahedronGeometry(1.35, 2), phos, 0.34);
      crown.scale.set(1.15, 0.85, 1.15);
      crown.position.y = 0.55;
      group.add(crown);

      const rootGeo = new THREE.ConeGeometry(0.42, 1.9, 8, 3);
      const rootA = wire(rootGeo, phos, 0.3);
      rootA.position.set(-0.5, -0.75, 0.15);
      rootA.rotation.z = 0.16;
      group.add(rootA);
      const rootB = wire(rootGeo, phos, 0.3);
      rootB.position.set(0.5, -0.75, -0.15);
      rootB.rotation.z = -0.16;
      group.add(rootB);
      const rootC = wire(rootGeo, phos, 0.22);
      rootC.position.set(0.05, -0.7, 0.62);
      rootC.rotation.x = -0.22;
      group.add(rootC);

      // ── the canal path — the endodontic file's route, in gold ──
      const canalCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 1.55, 0.15),
        new THREE.Vector3(0.05, 0.6, 0.1),
        new THREE.Vector3(0, -0.2, 0.12),
        new THREE.Vector3(-0.42, -1.0, 0.18),
        new THREE.Vector3(-0.52, -1.62, 0.2),
      ]);
      const canal = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(canalCurve.getPoints(48)),
        new THREE.LineBasicMaterial({ color: gold })
      );
      group.add(canal);

      const apex = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshBasicMaterial({ color: gold })
      );
      apex.position.copy(canalCurve.getPoint(1));
      group.add(apex);

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

      // ── render loop: idle drift + inertia, paused offscreen/hidden ──
      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
        threshold: 0.05,
      });
      io.observe(mount);

      const clock = new THREE.Clock();
      const renderFrame = () => {
        raf = requestAnimationFrame(renderFrame);
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime();
        if (!dragging) {
          group.rotation.y += 0.0022 + velY;
          group.rotation.x += velX;
          velY *= 0.94;
          velX *= 0.9;
          group.rotation.x = Math.max(-0.6, Math.min(0.8, group.rotation.x));
        }
        apex.scale.setScalar(1 + Math.sin(t * 3.2) * 0.25);
        renderer.render(scene, camera);
      };

      if (reduced) {
        renderer.render(scene, camera);
        // still allow manual dragging without the loop
        const onMoveStatic = onMove;
        renderer.domElement.addEventListener("pointermove", onMoveStatic);
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

  return (
    <div className="relative">
      <div ref={mountRef} className="h-[420px] w-full sm:h-[460px]" aria-label="Interactive 3D wireframe molar with a gold canal path — drag to spin" role="img" />
      {!ready && (
        <p className="absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.25em] text-fog">
          LOADING THREE.JS…
        </p>
      )}
    </div>
  );
}
