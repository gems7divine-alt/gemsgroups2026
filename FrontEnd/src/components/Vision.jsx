import { Play } from "lucide-react";
import Reveal from "./Reveal";

export default function Vision() {
  return (
    <section
      aria-label="Our vision"
      className="relative flex min-h-[500px] items-center overflow-hidden bg-deepnavy md:aspect-[1741/451] md:min-h-0"
    >
      {/* Top half of session.png: mountain sunrise */}
      <img
        src="/assets/session.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover [object-position:70%_0%] md:object-top"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-deepnavy/90 via-deepnavy/45 to-deepnavy/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-deepnavy/70 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
            Our Vision
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl md:text-5xl">
            Building a Better
            <br />
            Tomorrow Together
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-mutedwhite/85 sm:text-base">
            Through innovation, collaboration and compassion, we aim to create
            lasting impact across industries and societies.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <a
            href="#about"
            className="group inline-flex items-center gap-3 justify-self-start md:justify-self-end"
            aria-label="Watch Our Vision"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/70 bg-deepnavy/40 text-gold backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-gold group-hover:text-deepnavy group-hover:shadow-[0_0_28px_rgba(217,164,65,0.5)]">
              <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium tracking-wide text-cream group-hover:text-gold">
              Watch Our Vision
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
