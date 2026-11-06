import { BarChart3, Gem, Globe, Users } from "lucide-react";
import Reveal from "../../components/Reveal";

const STATS = [
  { icon: Users, value: "100+", label: "Clients Worldwide" },
  { icon: Globe, value: "10+", label: "Countries Reached" },
  { icon: BarChart3, value: "6", label: "Business Verticals" },
  { icon: Gem, value: "A Stronger", label: "& Brighter Tomorrow" },
];

export default function ImpactNumbers() {
  return (
    <section aria-label="Our impact in numbers" className="bg-[#FBF7EE]">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        <Reveal className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#A87B1F] sm:text-xs">
            Our Impact in Numbers
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100}>
              <div className="rounded-2xl bg-white px-4 py-7 text-center shadow-[0_10px_30px_rgba(3,20,38,0.06)]">
                <stat.icon className="mx-auto h-7 w-7 text-[#C99B2E]" aria-hidden="true" />
                <p className="mt-3 font-serif text-2xl font-bold text-deepnavy sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-deepnavy/65 sm:text-[13px]">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
