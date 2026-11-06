import { ArrowRight, Play } from "lucide-react";
import { AnimatedWords } from "./Reveal";

export default function Hero() {
  return (
    <section id="home" aria-label="GEMS Groups introduction" className="relative flex min-h-[100svh] items-center overflow-hidden bg-deepnavy">
      {/* Responsive background: mobilescreen.png < 768px, systembackground.png >= 768px */}
      <div className="hero-bg hero-zoom absolute inset-0" aria-hidden="true" />

      {/* Readability overlays — left-only on desktop so globe/city/vehicle stay visible */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-deepnavy/70 via-deepnavy/20 to-deepnavy/90 md:bg-gradient-to-r md:from-deepnavy/90 md:via-deepnavy/55 md:to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-deepnavy to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-28 sm:px-8 md:pb-24 md:pt-36 lg:px-12">
        <div className="max-w-xl md:max-w-2xl">
          <p
            className="anim-fade-up text-sm font-semibold uppercase tracking-[0.5em] text-gold sm:text-base md:text-lg"
            style={{ animationDelay: "0.1s" }}
          >
            GEMS&nbsp;&nbsp;GROUPS
          </p>

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
