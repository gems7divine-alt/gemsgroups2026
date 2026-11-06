import { ArrowRight, Eye, Gem, Target } from "lucide-react";
import Reveal from "./Reveal";

const PILLARS = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Create value and opportunities.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "A better and more connected world.",
  },
  {
    icon: Gem,
    title: "Our Values",
    text: "Innovation, Integrity and Impact.",
  },
];

export default function About() {
  return (
    <section id="about" aria-label="About GEMS Groups" className="bg-[#FBF7EE]">
      <div className="grid lg:grid-cols-2">
        {/* Left: building image */}
        <Reveal className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-[560px]">
          <img
            src="/assets/gems.png"
            alt="GEMS Groups corporate headquarters"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Reveal>

        {/* Right: content */}
        <div className="flex items-center px-6 py-12 sm:px-10 lg:px-14 lg:py-20">
          <Reveal delay={150} className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#A87B1F] sm:text-xs">
              About GEMS Groups
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-deepnavy sm:text-4xl lg:text-[2.75rem]">
              Architecting Tomorrow&rsquo;s Enterprise Standard
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-deepnavy/75 sm:text-[15px]">
              GEMS Groups is a diversified global company focused on innovation,
              creativity and social impact. We operate across technology, travel,
              digital media, film production, Gems Racing and community development.
              Our mission is to create sustainable value, empower lives and build
              a smarter, more connected world.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div key={pillar.title}>
                  <pillar.icon className="h-7 w-7 text-[#C99B2E]" aria-hidden="true" />
                  <h3 className="mt-2 text-sm font-bold text-deepnavy">{pillar.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-deepnavy/65">{pillar.text}</p>
                </div>
              ))}
            </div>

            <a
              href="#/about"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#D9A441] px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.03] hover:bg-[#c08f2e] hover:shadow-[0_8px_24px_rgba(217,164,65,0.45)]"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
