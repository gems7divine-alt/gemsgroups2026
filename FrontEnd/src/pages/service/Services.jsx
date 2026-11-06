import { ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AnimatedWords } from "../../components/Reveal";
import CoreServices from "./CoreServices";
import { ServiceCta, WhyChooseUs, WorkProcess } from "./ServicesSections";

export default function Services() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero: systembackground full-bleed with text on top */}
        <section aria-label="Our services" className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy">
          <div
            className="hero-bg hero-zoom absolute inset-0"
            role="img"
            aria-label="Global city with glowing globe, racing car, yacht and aircraft"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-deepnavy/90 via-deepnavy/55 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-deepnavy to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pt-32 lg:px-12">
            <div className="max-w-2xl">
              <p className="anim-fade-up text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
                Our Services
              </p>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
                <AnimatedWords text="Diverse Industries." baseDelay={200} />
                <br />
                <AnimatedWords text="Integrated Solutions." baseDelay={550} />
              </h1>
              <p
                className="anim-fade-up mt-5 max-w-xl text-sm leading-relaxed text-mutedwhite/85 sm:text-base"
                style={{ animationDelay: "0.7s" }}
              >
                At GEMS Groups, we deliver innovative solutions across multiple
                industries, combining technology, creativity and global reach to
                create real value for businesses and communities.
              </p>
              <div
                className="anim-fade-up mt-8"
                style={{ animationDelay: "0.85s" }}
              >
                <a
                  href="#/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-3 text-sm font-semibold tracking-wide text-deepnavy transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:shadow-[0_0_28px_rgba(217,164,65,0.5)]"
                >
                  Discuss Your Project
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <CoreServices />
        <WorkProcess />
        <WhyChooseUs />
        <ServiceCta />
      </main>
      <Footer />
    </>
  );
}
