import { BarChart3, Briefcase, Globe, Rocket, Star, Users } from "lucide-react";
import Reveal from "../../components/Reveal";

const MILESTONES = [
  { icon: Rocket, year: "2020", text: "Founded GEMS Groups with a vision" },
  { icon: Users, year: "2021", text: "Expanded our services and team" },
  { icon: BarChart3, year: "2022", text: "Global client base reached 100+" },
  { icon: Briefcase, year: "2023", text: "Launched multiple business verticals" },
  { icon: Globe, year: "2024", text: "Strengthened global partnerships" },
  { icon: Star, year: "2025", text: "Growing towards a brighter tomorrow" },
];

export default function Journey() {
  return (
    <section aria-label="Our journey and key milestones" className="bg-[#FBF7EE]">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#A87B1F] sm:text-xs">
            Our Journey
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-deepnavy sm:text-4xl">
            Key Milestones
          </h2>
        </Reveal>

        <div className="relative mt-12">
          {/* Horizontal connector (desktop) */}
          <div
            className="absolute left-[8%] right-[8%] top-7 hidden h-px bg-gold/40 lg:block"
            aria-hidden="true"
          />
          {/* Vertical connector (mobile/tablet) */}
          <div
            className="absolute bottom-4 left-7 top-4 w-px bg-gold/40 lg:hidden"
            aria-hidden="true"
          />

          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
            {MILESTONES.map((milestone, i) => (
              <Reveal key={milestone.year} delay={i * 100} as="li">
                <div className="flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                  <span className="relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold/60 bg-[#FBF7EE] text-[#A87B1F] shadow-[0_6px_20px_rgba(217,164,65,0.25)]">
                    <milestone.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="lg:mt-4">
                    <span className="block text-sm font-bold tracking-wide text-deepnavy">
                      {milestone.year}
                    </span>
                    <span className="mt-1 block max-w-[220px] text-xs leading-relaxed text-deepnavy/65 lg:mx-auto">
                      {milestone.text}
                    </span>
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
