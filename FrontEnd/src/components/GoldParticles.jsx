import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

const DEPTH = 1000;

/**
 * Gold dust drifting toward the viewer through true 3D space.
 * `pointer` is an optional ref of { x, y } in -1..1 that shifts the view.
 */
export default function GoldParticles({ pointer, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;
    let last = 0;
    let visible = true;

    const spawn = (z) => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z,
      size: 0.6 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    });

    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = width < 768 ? 36 : 80;
      if (particles.length !== count) {
        particles = Array.from({ length: count }, () => spawn(Math.random() * DEPTH));
      }
    };
    fit();

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      ctx.clearRect(0, 0, width, height);
      const px = pointer?.current?.x ?? 0;
      const py = pointer?.current?.y ?? 0;
      const reach = Math.max(width, height) * 0.5;
      particles.forEach((p, i) => {
        p.z -= 42 * dt;
        if (p.z < 40) particles[i] = spawn(DEPTH);
        const perspective = 320 / Math.max(40, p.z);
        // Near particles shift further with the pointer, which reads as depth.
        const sx = width / 2 + (p.x * reach - px * 26) * perspective;
        const sy = height / 2 + (p.y * reach - py * 18) * perspective;
        const fadeIn = Math.min(1, (DEPTH - p.z) / 240);
        const fadeOut = Math.min(1, p.z / 140);
        const twinkle = 0.6 + Math.sin(now / 480 + p.phase) * 0.4;
        ctx.globalAlpha = fadeIn * fadeOut * twinkle * 0.75;
        ctx.fillStyle = "#f5d58a";
        ctx.beginPath();
        ctx.arc(sx, sy, Math.min(3, p.size * perspective), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    observer.observe(canvas);
    const resizer = new ResizeObserver(fit);
    resizer.observe(canvas);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizer.disconnect();
    };
  }, [pointer]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
