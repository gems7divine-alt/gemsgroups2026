import { Globe, MapPin, Users } from "lucide-react";
import Reveal from "./Reveal";

const POINTS = [
  {
    icon: Globe,
    title: "Global Network",
    text: "Operating across multiple countries",
  },
  {
    icon: Users,
    title: "Strategic Partnerships",
    text: "Collaborating for greater impact",
  },
  {
    icon: MapPin,
    title: "Local Communities",
    text: "Creating opportunities at the grassroots level",
  },
];

export default function GlobalPresence() {
  return (
    <section
      aria-label="Our global presence"
      className="relative overflow-hidden bg-deepnavy"
    >
      {/* Bottom half of session.png: glowing world map */}
      <div className="relative min-h-[640px] sm:min-h-[560px] md:aspect-[1741/452] md:min-h-0">
        <img
          src="/assets/session.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover [object-position:50%_100%] md:object-bottom"
        />
        <div
          className="absolute inset-0 bg-deepnavy/35"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-deepnavy to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:items-center lg:px-12">
          <Reveal className="md:pb-10">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs md:text-left">
              Our Global Presence
            </p>
            <h2 className="mt-3 text-center font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl md:text-left lg:text-[2.6rem]">
              Connecting People. Creating Opportunities.
            </h2>
          </Reveal>

          <Reveal delay={150} className="justify-self-stretch md:justify-self-end md:w-[380px]">
            <div className="rounded-2xl border border-gold/25 bg-deepnavy/70 p-6 backdrop-blur-md sm:p-7">
              <ul className="space-y-6">
                {POINTS.map((point) => (
                  <li key={point.title} className="flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/10 text-gold">
                      <point.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-serif text-lg text-cream">{point.title}</span>
                      <span className="mt-0.5 block text-sm text-mutedwhite/75">{point.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
