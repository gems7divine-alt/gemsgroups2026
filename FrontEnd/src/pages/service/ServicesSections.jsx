import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardList,
  Globe,
  Headphones,
  Leaf,
  Lightbulb,
  MessageSquare,
  Rocket,
  Settings,
  Users,
} from "lucide-react";
import Reveal from "../../components/Reveal";

const STEPS = [
  { icon: MessageSquare, n: "01", title: "Understand", sub: "Your Needs" },
  { icon: ClipboardList, n: "02", title: "Strategize", sub: "& Plan" },
  { icon: Settings, n: "03", title: "Design", sub: "& Develop" },
  { icon: Rocket, n: "04", title: "Execute", sub: "& Deliver" },
  { icon: Headphones, n: "05", title: "Ongoing", sub: "Support" },
];

const REASONS = [
  { icon: Boxes, title: "Multi-Industry Expertise", text: "One partner for diverse business needs." },
  { icon: Globe, title: "Global Network", text: "Operating across multiple countries." },
  { icon: Lightbulb, title: "Innovation Driven", text: "Leveraging the latest technology and creative solutions." },
  { icon: Users, title: "People First", text: "Committed to creating value for businesses and communities." },
  { icon: BadgeCheck, title: "Quality & Reliability", text: "Delivering consistent and measurable results." },
  { icon: Leaf, title: "Sustainable Impact", text: "Focused on long-term growth and positive social change." },
];

export function WorkProcess() {
  return (
    <section aria-label="Our work process" className="border-t border-gold/10 bg-[#040F1D] py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
            Our Work Process
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-cream sm:text-4xl">
            From Idea to Impact
          </h2>
          <p className="mt-3 text-sm text-mutedwhite/70">
            A streamlined approach to deliver excellence across every project.
          </p>
        </Reveal>

        <div className="relative mt-12">
          <div
            className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent lg:block"
            aria-hidden="true"
          />
          <ol className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 100} as="li">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-deepnavy text-gold shadow-[0_0_24px_rgba(217,164,65,0.25)]">
                    <step.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-3 text-xs font-bold tracking-[0.2em] text-gold">{step.n}</span>
                  <span className="mt-1 text-sm font-semibold text-cream">{step.title}</span>
                  <span className="text-sm text-mutedwhite/70">{step.sub}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section aria-label="Why choose GEMS Groups" className="border-t border-gold/10 bg-deepnavy py-16 md:py-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:px-12">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold sm:text-xs">
            Why Choose GEMS Groups
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
            Your Trusted Partner Across Industries
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mutedwhite/75 sm:text-[15px]">
            We combine innovation, global experiences and a people-first
            approach to deliver solutions that make a difference.
          </p>
          <a
            href="#/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:shadow-[0_0_28px_rgba(217,164,65,0.5)]"
          >
            Get Started Today
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 2) * 100}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-gold/15 bg-darkblue p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                  <reason.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-gold">{reason.title}</span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-mutedwhite/70">
                    {reason.text}
                  </span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceCta() {
  return (
    <section aria-label="Ready to explore our services" className="relative overflow-hidden bg-deepnavy">
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
            Let&rsquo;s Build Together
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl">
            Ready to Explore
            <br />
            Our Services?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mutedwhite/80 sm:text-[15px]">
            Partner with GEMS Groups and unlock new opportunities across
            industries. Let&rsquo;s create a brighter, more connected tomorrow.
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
  );
}
