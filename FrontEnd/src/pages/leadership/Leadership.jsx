import { ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal, { AnimatedWords } from "../../components/Reveal";
import TeamGrid from "./TeamGrid";
import Philosophy from "./Philosophy";

export default function Leadership() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero: responsive leadership background with text on top */}
        <section aria-label="Our leadership" className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy">
          <div
            className="leadership-hero-bg absolute inset-0 bg-no-repeat"
            role="img"
            aria-label="GEMS Groups leadership team around a glowing globe"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-deepnavy/95 via-deepnavy/55 to-deepnavy/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-deepnavy to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pt-32 lg:px-12">
            <div className="max-w-2xl">
              <p className="anim-fade-up text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
                Our Leadership
              </p>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
                <AnimatedWords text="Visionary People." baseDelay={200} />
                <br />
                <span className="text-gold">
                  <AnimatedWords text="Stronger Tomorrow." baseDelay={550} />
                </span>
              </h1>
              <p
                className="anim-fade-up mt-5 max-w-xl text-sm leading-relaxed text-mutedwhite/85 sm:text-base"
                style={{ animationDelay: "0.7s" }}
              >
                At GEMS Groups, our leadership team brings together diverse
                expertise, global experience and a shared vision to create
                value, drive innovation and make a positive impact across
                industries and communities.
              </p>
              <div className="anim-fade-up mt-8" style={{ animationDelay: "0.85s" }}>
                <a
                  href="#team"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 px-7 py-3 text-sm font-semibold tracking-wide text-cream transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:text-deepnavy hover:shadow-[0_0_28px_rgba(217,164,65,0.5)]"
                >
                  Meet Our Team
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <div id="team">
          <TeamGrid />
        </div>
        <Philosophy />

        {/* CTA */}
        <section aria-label="Join our journey" className="relative overflow-hidden bg-deepnavy">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/assets/vision.png')" }}
            role="img"
            aria-label="Person standing on a mountain peak at sunrise"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-deepnavy/90 via-deepnavy/50 to-deepnavy/20"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-6 px-5 py-16 sm:px-8 md:grid-cols-[1fr_auto] md:py-20 lg:px-12">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold sm:text-xs">
                Join Our Journey
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
                Let&rsquo;s Build a Brighter
                <br />
                Tomorrow Together.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-mutedwhite/80 sm:text-[15px]">
                Partner with our leadership team and be part of a global journey
                of innovation, growth and positive impact.
              </p>
            </Reveal>
            <Reveal delay={150} className="justify-self-start md:justify-self-end">
              <a
                href="#/contact"
                className="inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:shadow-[0_0_28px_rgba(217,164,65,0.5)]"
              >
                Get in Touch
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
