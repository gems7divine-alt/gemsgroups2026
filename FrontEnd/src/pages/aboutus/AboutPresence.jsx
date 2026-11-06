import { Globe, MapPin, Users } from "lucide-react";
import Reveal from "../../components/Reveal";

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

export default function AboutPresence() {
  return (
    <section aria-label="Our global presence" className="relative overflow-hidden bg-deepnavy">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/Golden.png')" }}
        role="img"
        aria-label="Golden globe showing worldwide connections"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-deepnavy/90 via-deepnavy/40 to-deepnavy/60"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[1fr_380px] lg:px-12">
        <Reveal className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold sm:text-xs">
            Our Global Presence
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl lg:text-[2.6rem]">
            Connecting People. Creating Opportunities.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mutedwhite/85 sm:text-base">
            We operate across multiple countries, building partnerships and
            creating opportunities globally.
          </p>
        </Reveal>

        <Reveal delay={150}>
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
    </section>
  );
}
