import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { prefersReducedMotion } from "./motion";

const AUTOPLAY_MS = 3600;
const RESUME_AFTER_INPUT_MS = 7000;
const GAP = 22;

/** A rotating 3D ring of service cards: auto-plays, drags, swipes and has buttons. */
export default function ServiceCarousel3D({ items }) {
  const [reduced] = useState(prefersReducedMotion);
  const viewport = useRef(null);
  const ring = useRef(null);
  const cards = useRef([]);
  const controls = useRef(null);
  const step = 360 / items.length;

  useEffect(() => {
    if (reduced) return undefined;
    const ringEl = ring.current;
    const view = viewport.current;
    const root = view.parentElement;
    const state = {
      angle: 0,
      target: 0,
      raf: 0,
      last: 0,
      dragging: false,
      startX: 0,
      startAngle: 0,
      perPixel: 0.2,
      hovering: false,
      focused: false,
      inView: false,
      resumeAt: 0,
    };

    const paint = () => {
      ringEl.style.setProperty("--ring-angle", `${state.angle}deg`);
      cards.current.forEach((card, i) => {
        if (!card) return;
        const facing = Math.cos(((i * step + state.angle) * Math.PI) / 180);
        card.style.opacity = facing < -0.1 ? "0" : String(0.3 + Math.max(0, facing) * 0.7);
        card.style.visibility = facing < -0.1 ? "hidden" : "visible";
      });
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - state.last) / 1000 || 0.016);
      state.last = now;
      if (!state.dragging) {
        state.angle += (state.target - state.angle) * (1 - Math.exp(-dt * 5));
        if (Math.abs(state.target - state.angle) < 0.02) state.angle = state.target;
      }
      paint();
      state.raf =
        state.dragging || state.angle !== state.target ? requestAnimationFrame(frame) : 0;
    };

    const kick = () => {
      if (!state.raf) {
        state.last = performance.now();
        state.raf = requestAnimationFrame(frame);
      }
    };

    const measure = () => {
      const width = cards.current[0]?.offsetWidth || 300;
      const radius = (width + GAP) / 2 / Math.tan(Math.PI / items.length);
      ringEl.style.setProperty("--ring-radius", `${radius}px`);
      state.perPixel = step / (width + GAP);
    };
    measure();
    paint();

    const move = (direction) => {
      state.target = Math.round(state.target / step) * step - direction * step;
      kick();
    };
    controls.current = {
      go: (direction) => {
        state.resumeAt = performance.now() + RESUME_AFTER_INPUT_MS;
        move(direction);
      },
    };

    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      state.dragging = true;
      state.startX = e.clientX;
      state.startAngle = state.angle;
      view.setPointerCapture?.(e.pointerId);
      view.classList.add("is-dragging");
      kick();
    };
    const onMove = (e) => {
      if (state.dragging) {
        state.angle = state.startAngle + (e.clientX - state.startX) * state.perPixel;
      }
    };
    const onUp = () => {
      if (!state.dragging) return;
      state.dragging = false;
      state.target = Math.round(state.angle / step) * step;
      state.resumeAt = performance.now() + RESUME_AFTER_INPUT_MS;
      view.classList.remove("is-dragging");
      kick();
    };
    const onEnter = (e) => {
      if (e.pointerType === "mouse") state.hovering = true;
    };
    const onLeave = () => {
      state.hovering = false;
    };
    const onFocusIn = () => {
      state.focused = true;
    };
    const onFocusOut = () => {
      state.focused = false;
    };

    view.addEventListener("pointerdown", onDown);
    view.addEventListener("pointermove", onMove);
    view.addEventListener("pointerup", onUp);
    view.addEventListener("pointercancel", onUp);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);

    const resizer = new ResizeObserver(measure);
    resizer.observe(view);
    const observer = new IntersectionObserver(([entry]) => {
      state.inView = entry.isIntersecting;
    });
    observer.observe(view);

    const timer = setInterval(() => {
      const paused =
        state.dragging ||
        state.hovering ||
        state.focused ||
        !state.inView ||
        document.hidden ||
        performance.now() < state.resumeAt;
      if (!paused) move(1);
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(state.raf);
      resizer.disconnect();
      observer.disconnect();
      view.removeEventListener("pointerdown", onDown);
      view.removeEventListener("pointermove", onMove);
      view.removeEventListener("pointerup", onUp);
      view.removeEventListener("pointercancel", onUp);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, [reduced, items.length, step]);

  if (reduced) {
    return (
      <div className="mx-auto mt-10 grid w-full max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12">
        {items.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-10" role="group" aria-roledescription="carousel" aria-label="Our services">
      <div ref={viewport} data-carousel className="ring-viewport">
        <div ref={ring} className="ring-3d">
          {items.map((service, i) => (
            <div
              key={service.title}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="ring-card"
              style={{ "--ring-index": `${i * step}deg` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => controls.current?.go(-1)}
          aria-label="Previous service"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 hover:bg-gold hover:text-deepnavy"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => controls.current?.go(1)}
          aria-label="Next service"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 hover:bg-gold hover:text-deepnavy"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
