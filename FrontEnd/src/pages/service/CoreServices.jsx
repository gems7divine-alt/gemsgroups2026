import { CircleCheck } from "lucide-react";
import {
  Trophy,
  Clapperboard,
  Cpu,
  HeartHandshake,
  Megaphone,
  Plane,
} from "lucide-react";
import Reveal from "../../components/Reveal";

const SERVICES = [
  {
    n: "1",
    icon: HeartHandshake,
    title: "Mai International Children's Foundation",
    text: "Empowering children through education, care and opportunities for a brighter tomorrow.",
    image: "/assets/mai.jpeg",
    imageAlt: "Mai International Children's Foundation",
    points: [
      "Education Support",
      "Healthcare Assistance",
      "Child Welfare Programs",
      "Community Development",
      "Global Charity Initiatives",
    ],
  },
  {
    n: "2",
    icon: Cpu,
    title: "Software Services & AI Automation",
    text: "Innovative software solutions and AI automation to solve real-world business problems and improve efficiency.",
    image: "/assets/software.jpg",
    imageAlt: "Software services and AI automation",
    points: [
      "Custom Software Development",
      "AI Automation & Agent Solutions",
      "Web & Mobile App Development",
      "Cloud & DevOps Solutions",
      "IT Consulting & Support",
    ],
  },
  {
    n: "3",
    icon: Plane,
    title: "Travel Services Global",
    text: "Curated global travel experiences for individuals and businesses with personalized support.",
    image: "/assets/travel.jpg",
    imageAlt: "Global travel services",
    points: [
      "International Tour Packages",
      "Corporate Travel Solutions",
      "Visa Assistance",
      "Hotel & Flight Bookings",
      "Customized Travel Planning",
    ],
  },
  {
    n: "4",
    icon: Megaphone,
    title: "Digital Marketing & Content Creation",
    text: "Strategic digital marketing, branding and high-quality content creation to grow your business.",
    image: "/assets/digital-marketing.jpg",
    imageAlt: "Digital marketing and content creation",
    points: [
      "Social Media Marketing",
      "Brand Strategy & Management",
      "Content Creation (Video, Image, Reels)",
      "SEO & Performance Marketing",
      "Influencer Collaboration",
    ],
  },
  {
    n: "5",
    icon: Clapperboard,
    title: "Film Production",
    text: "Creative storytelling through film, media and visual production.",
    image: "/assets/film.jpg",
    imageAlt: "Film production",
    points: [
      "Short Films & Feature Films",
      "Corporate Videos",
      "Documentaries",
      "Ad Films & Commercials",
      "Post-Production & Editing",
    ],
  },
  {
    n: "6",
    icon: Trophy,
    title: "Gems Racing",
    text: "High-octane motorsport, professional racing events and training for a faster, more thrilling future.",
    image: "/assets/racing.png",
    imageAlt: "Gems Racing motorsport event",
    points: [
      "Professional Racing Events & Championships",
      "Go-Karting & Racing Experiences",
      "Racing Training & Driver Academy",
      "Motorsport Event Management",
      "Sponsorship & Brand Partnerships",
    ],
  },
];

export default function CoreServices() {
  return (
    <section aria-label="Our core services" className="bg-deepnavy py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
            Our Core Services
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl md:text-5xl">
            Powering Multiple Industries
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-mutedwhite/80 sm:text-base">
            We bring together expertise, innovation and global networks to
            deliver impactful solutions across six key industries.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {SERVICES.map((service, i) => {
            const isRacing = service.image?.includes("racing");
            const isMai = service.image?.includes("mai");
            const isLogo = isRacing || isMai;
            const isContain = isLogo || service.image?.includes("film") || service.image?.includes("travel");
            return (
            <Reveal key={service.title} delay={(i % 2) * 120} className="h-full">
              <article className="group grid h-full overflow-hidden rounded-2xl border border-gold/15 bg-darkblue sm:grid-cols-2">
                <div className={`relative h-56 overflow-hidden sm:h-full sm:min-h-[340px] ${isContain ? "bg-white" : "bg-deepnavy"}`}>
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-center transition-transform duration-500 group-hover:scale-105 ${isLogo ? "object-contain p-4" : isContain ? "object-contain" : "object-cover"}`}
                  />
                </div>
                <div className="relative flex flex-col p-6 sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                      <service.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-serif text-lg font-bold leading-snug text-cream">
                      <span className="text-gold">{service.n}.</span> {service.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-mutedwhite/75">
                    {service.text}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-[13px] text-mutedwhite/80">
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
