import { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { AnimatedWords } from "./Reveal";
import Gem3D from "./Gem3D";
import GoldParticles from "./GoldParticles";
import { prefersReducedMotion } from "./motion";

/** Feeds the hero's depth layers from the mouse and from scrolling. */
function useHeroDepth(sectionRef, pointer) {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const section = sectionRef.current;
    const target = { x: 0, y: 0 };
    let raf = 0;

    const frame = () => {
      const p = pointer.current;
      p.x += (target.x - p.x) * 0.07;
      p.y += (target.y - p.y) * 0.07;
      section.style.setProperty("--hero-x", p.x.toFixed(4));
      section.style.setProperty("--hero-y", p.y.toFixed(4));
      const settled = Math.abs(target.x - p.x) + Math.abs(target.y - p.y) < 0.001;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };
    const onPointerMove = (e) => {
      if (e.pointerType !== "mouse") return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      const progress = Math.min(1, window.scrollY / (section.offsetHeight || 1));
      section.style.setProperty("--hero-scroll", progress.toFixed(4));
    };

    section.addEventListener("pointermove", onPointerMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [sectionRef, pointer]);
}

export default function Hero() {
  const sectionRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  useHeroDepth(sectionRef, pointer);

  return (
    <section ref={sectionRef} id="home" aria-label="GEMS Groups introduction" className="relative flex min-h-[100svh] items-center overflow-hidden bg-deepnavy">
      {/* Responsive background: mobilescreen.png < 768px, systembackground.png >= 768px */}
      <div className="hero-depth-bg absolute -inset-[4%]" aria-hidden="true">
        <div className="hero-bg hero-zoom absolute inset-0" />
      </div>

      {/* Readability overlays — left-only on desktop so globe/city/vehicle stay visible */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-deepnavy/70 via-deepnavy/55 to-deepnavy/90 md:bg-gradient-to-r md:from-deepnavy/90 md:via-deepnavy/55 md:to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-deepnavy to-transparent"
        aria-hidden="true"
      />

      <GoldParticles pointer={pointer} className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-24 sm:px-8 md:pb-24 md:pt-36 lg:px-12">
        <div className="hero-depth-text max-w-xl md:max-w-2xl">
          <div
            className="anim-fade-up flex items-center gap-3 md:flex-col md:items-start"
            style={{ animationDelay: "0.1s" }}
          >
            <Gem3D className="gem-glow h-10 w-10 shrink-0 md:-ml-1 md:h-20 md:w-20" />
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-gold sm:text-base md:text-lg">
              GEMS&nbsp;&nbsp;GROUPS
            </p>
          </div>

          <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.05] text-cream sm:text-5xl md:text-6xl lg:text-7xl">
            <AnimatedWords text="SIX INDUSTRIES." baseDelay={250} />
            <br />
            <span className="text-gold">
              <AnimatedWords text="ONE VISION." baseDelay={550} />
            </span>
          </h1>

          <p
            className="anim-fade-up mt-4 font-serif text-lg text-lightgold sm:text-xl md:text-2xl"
            style={{ animationDelay: "0.4s" }}
          >
            Transforming Businesses.
            <br className="sm:hidden" /> Empowering Lives.
          </p>

          <p
            className="anim-fade-up mt-5 max-w-xl text-sm leading-relaxed text-mutedwhite/85 sm:text-base"
            style={{ animationDelay: "0.55s" }}
          >
            GEMS Groups is a diversified global company driven by innovation,
            creativity and social impact. We build solutions, create
            opportunities and make a positive difference across industries and
            communities.
          </p>

          <div
            className="anim-fade-up mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.7s" }}
          >
            <a
              href="#/services"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-semibold tracking-wide text-deepnavy transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:shadow-[0_0_28px_rgba(217,164,65,0.5)] sm:w-auto"
            >
              Explore Our Services
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#about"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-gold/60 bg-transparent px-7 py-3.5 text-sm font-semibold tracking-wide text-cream transition-all duration-300 hover:scale-[1.03] hover:border-gold hover:shadow-[0_0_24px_rgba(217,164,65,0.35)] sm:w-auto"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
                <Play className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
              </span>
              Watch Our Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
