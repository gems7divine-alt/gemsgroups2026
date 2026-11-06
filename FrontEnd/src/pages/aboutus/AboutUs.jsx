import { ArrowRight, Play, Quote } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal, { AnimatedWords } from "../../components/Reveal";
import MissionValues from "./MissionValues";
import ImpactNumbers from "./ImpactNumbers";
import Businesses from "./Businesses";
import AboutPresence from "./AboutPresence";
import Journey from "./Journey";

export default function AboutUs() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero: aboutgems.png full background with text on top */}
        <section aria-label="About GEMS Groups" className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy">
          <div
            className="about-hero-bg absolute inset-0 bg-no-repeat"
            role="img"
            aria-label="GEMS Groups headquarters at dusk"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-deepnavy/95 via-deepnavy/60 to-deepnavy/10"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-deepnavy to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pt-32 lg:px-12">
            <div className="max-w-2xl">
                <p className="anim-fade-up text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
                  About Us
                </p>
                <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.08] text-gold sm:text-5xl lg:text-[3.4rem]">
                  <AnimatedWords text="A Global Company" baseDelay={200} />
                  <br />
                  <AnimatedWords text="Driven by a Greater" baseDelay={500} />
                  <br />
                  <AnimatedWords text="Purpose." baseDelay={850} />
                </h1>
                <p
                  className="anim-fade-up mt-5 max-w-xl text-sm leading-relaxed text-mutedwhite/85 sm:text-base"
                  style={{ animationDelay: "0.7s" }}
                >
                  GEMS Groups is a diversified global company focused on
                  innovation, creativity and social impact. We build solutions,
                  create opportunities and make a positive difference across
                  industries and communities.
                </p>
                <div
                  className="anim-fade-up mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
                  style={{ animationDelay: "0.85s" }}
                >
                  <a
                    href="#story"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-7 py-3 text-sm font-semibold tracking-wide text-deepnavy transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:shadow-[0_0_28px_rgba(217,164,65,0.5)] sm:w-auto"
                  >
                    Our Journey
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#story"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-gold/60 bg-transparent px-7 py-3 text-sm font-semibold tracking-wide text-cream transition-all duration-300 hover:scale-[1.03] hover:border-gold hover:shadow-[0_0_24px_rgba(217,164,65,0.35)] sm:w-auto"
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

        {/* Our Story: cream, text left + globe image right */}
        <section id="story" aria-label="Our story" className="bg-[#FBF7EE]">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[0.85fr_1.5fr] lg:gap-12 lg:px-12">
            <Reveal className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-[#A87B1F] sm:text-xs">
                Our Story
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-deepnavy sm:text-4xl lg:text-[2.75rem]">
                From a Vision to
                <br />a Global Impact
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-deepnavy/75 sm:text-[15px]">
                GEMS Groups was founded with a simple belief — that businesses
                can create real value when innovation, creativity and purpose
                come together. What started as a vision to solve real-world
                problems has grown into a diversified global company spanning
                multiple industries.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-deepnavy/75 sm:text-[15px]">
                Today, we work with businesses, communities and individuals
                across the world, building solutions that empower lives and
                shape a brighter, more connected tomorrow.
              </p>
              <p className="mt-7 font-script text-4xl text-deepnavy sm:text-5xl">
                David  Gems
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-deepnavy/60">
                Founder &amp; CEO, GEMS Groups
              </p>
            </Reveal>

            <Reveal delay={150} className="relative">
              <div
                className="aspect-[1800/874] w-full rounded-2xl bg-cover bg-center bg-no-repeat mix-blend-multiply"
                style={{ backgroundImage: "url('/assets/founder.png')" }}
                role="img"
                aria-label="GEMS Groups global impact across technology, travel and racing"
              />
              <figure className="relative z-10 mx-4 -mt-14 rounded-2xl border border-gold/25 bg-white/95 p-6 shadow-[0_18px_50px_rgba(3,20,38,0.14)] backdrop-blur-sm sm:mx-8 sm:-mt-20 sm:p-7">
                <Quote className="h-6 w-6 fill-gold text-gold" aria-hidden="true" />
                <blockquote className="mt-2 font-serif text-lg italic leading-relaxed text-deepnavy sm:text-xl">
                  We don&rsquo;t just build businesses, we create opportunities
                  for a better tomorrow.
                </blockquote>
                <figcaption className="mt-3 text-xs font-semibold tracking-wide text-deepnavy/60">
                  — David Gems, Founder &amp; CEO
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <MissionValues />
        <ImpactNumbers />
        <Businesses />
        <AboutPresence />
        <Journey />
      </main>
      <Footer />
    </>
  );
}
