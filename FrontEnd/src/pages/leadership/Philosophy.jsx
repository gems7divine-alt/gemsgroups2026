import { BarChart3, Globe, Target, Users } from "lucide-react";
import Reveal from "../../components/Reveal";

const VALUES = [
  { icon: Target, label: "Innovation Driven" },
  { icon: Users, label: "People First" },
  { icon: BarChart3, label: "Sustainable Growth" },
  { icon: Globe, label: "Global Impact" },
];

export default function Philosophy() {
  return (
    <section aria-label="Leadership philosophy" className="bg-[#FBF7EE] pb-16 md:pb-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-12">
        <Reveal>
          <div
            className="min-h-[280px] rounded-2xl bg-cover bg-center bg-no-repeat shadow-[0_18px_50px_rgba(3,20,38,0.16)] sm:min-h-[380px] lg:min-h-[460px]"
            style={{ backgroundImage: "url('/assets/office.png')" }}
            role="img"
            aria-label="GEMS Groups executive office"
          />
        </Reveal>

        <Reveal delay={150}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#A87B1F] sm:text-xs">
            Leadership Philosophy
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-deepnavy sm:text-4xl">
            People. Purpose. Progress.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-deepnavy/75 sm:text-[15px]">
            Our leadership believes in empowering people, leveraging technology
            and creating sustainable opportunities across industries and
            communities. Together, we are building a smarter, more connected
            and brighter tomorrow.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div key={value.label} className="text-center sm:text-left lg:text-center">
                <value.icon className="mx-auto h-8 w-8 text-[#C99B2E] sm:mx-0 lg:mx-auto" aria-hidden="true" />
                <p className="mt-2 text-[13px] font-bold leading-snug text-deepnavy">{value.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
