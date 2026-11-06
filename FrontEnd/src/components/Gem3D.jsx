import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motion";

const SIDES = 8;
const CAMERA = 4;

/** Builds a brilliant-cut gem: table on top, crown facets, pointed pavilion. */
function buildGem() {
  const ring = (radius, y, offset) =>
    Array.from({ length: SIDES }, (_, i) => {
      const a = ((i + offset) / SIDES) * Math.PI * 2;
      return [Math.cos(a) * radius, y, Math.sin(a) * radius];
    });
  const table = ring(0.56, 0.58, 0);
  const girdle = ring(1, 0.14, 0.5);
  const culet = [0, -1, 0];
  const faces = [table];
  for (let i = 0; i < SIDES; i++) {
    const next = (i + 1) % SIDES;
    faces.push([table[i], table[next], girdle[i]]);
    faces.push([table[next], girdle[next], girdle[i]]);
    faces.push([girdle[i], girdle[next], culet]);
  }
  return faces.map((points) => {
    const [a, b, c] = points;
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    let n = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    const length = Math.hypot(...n) || 1;
    n = n.map((value) => value / length);
    // The gem is convex, so "outward" is simply away from its centre.
    const centre = [0, 1, 2].map(
      (k) => points.reduce((sum, p) => sum + p[k], 0) / points.length
    );
    if (n[0] * centre[0] + n[1] * centre[1] + n[2] * centre[2] < 0) {
      n = n.map((value) => -value);
    }
    return { points, normal: n, centre };
  });
}

const FACES = buildGem();
const LIGHT = (() => {
  const l = [-0.45, 0.75, 0.6];
  const m = Math.hypot(...l);
  return l.map((value) => value / m);
})();

function rotate([x, y, z], cosY, sinY, cosX, sinX) {
  const rx = x * cosY + z * sinY;
  const rz = -x * sinY + z * cosY;
  return [rx, y * cosX - rz * sinX, y * sinX + rz * cosX];
}

/** Dark bronze, through brand gold, up to cream highlights. */
function gold(t) {
  const stops = [
    [84, 54, 12],
    [217, 164, 65],
    [255, 244, 214],
  ];
  const at = Math.min(1, Math.max(0, t)) * 2;
  const i = Math.min(1, Math.floor(at));
  const f = at - i;
  const c = stops[i].map((value, k) => Math.round(value + (stops[i + 1][k] - value) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function draw(ctx, size, time) {
  const yaw = time * 0.55;
  const pitch = 0.32 + Math.sin(time * 0.4) * 0.08;
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const cosX = Math.cos(pitch);
  const sinX = Math.sin(pitch);
  const scale = size * 0.42 * CAMERA * 0.8;
  const half = size / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.lineWidth = Math.max(0.5, size / 180);
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(255,244,214,0.42)";

  FACES.forEach((face, index) => {
    const n = rotate(face.normal, cosY, sinY, cosX, sinX);
    const c = rotate(face.centre, cosY, sinY, cosX, sinX);
    // Hide facets pointing away from the camera.
    if (n[0] * -c[0] + n[1] * -c[1] + n[2] * (CAMERA - c[2]) <= 0) return;

    const diffuse = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
    const sparkle = Math.sin(time * 1.6 + index * 2.4) * 0.07;
    ctx.fillStyle = gold(0.12 + diffuse * 0.82 + sparkle);
    ctx.beginPath();
    face.points.forEach((point, i) => {
      const [x, y, z] = rotate(point, cosY, sinY, cosX, sinX);
      const depth = scale / (CAMERA - z);
      const sx = half + x * depth;
      const sy = half - y * depth;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
}

/** A real-time rotating gold gem, drawn on a small canvas. */
export default function Gem3D({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let size = 0;
    let raf = 0;
    let visible = true;

    const fit = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * ratio;
      canvas.height = size * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    fit();

    if (prefersReducedMotion()) {
      draw(ctx, size, 0.6);
      return undefined;
    }

    const loop = (now) => {
      draw(ctx, size, now / 1000);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
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
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
