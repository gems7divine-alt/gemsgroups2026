import { Eye, Gem, Target } from "lucide-react";
import Reveal from "../../components/Reveal";

const PILLARS = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Create sustainable value, empower lives and build opportunities through innovation, collaboration and compassion.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To be a globally respected organization creating a smarter, more connected world with purpose-driven businesses.",
  },
  {
    icon: Gem,
    title: "Our Values",
    text: "Innovation, Integrity, Excellence, Social Impact and People First.",
  },
];

export default function MissionValues() {
  return (
    <section aria-label="Our mission, vision and values" className="relative overflow-hidden bg-deepnavy">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/vision.png')" }}
        role="img"
        aria-label="Person standing on a mountain peak at sunrise"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-deepnavy/95 via-deepnavy/70 to-deepnavy/20"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <Reveal className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold sm:text-xs">
            Our Mission, Vision &amp; Values
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
            What Drives Us Forward
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-3 lg:gap-6">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 120}>
              <pillar.icon className="h-9 w-9 text-gold" aria-hidden="true" />
              <h3 className="mt-3 font-serif text-xl text-cream">{pillar.title}</h3>
              <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-mutedwhite/75">
                {pillar.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
