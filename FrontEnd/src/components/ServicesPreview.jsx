import { Bot, Trophy, Clapperboard, HeartHandshake, Megaphone, Plane } from "lucide-react";
import ServiceCarousel3D from "./ServiceCarousel3D";
import Reveal from "./Reveal";

const SERVICES = [
  {
    icon: Bot,
    title: "Software Services & AI Automation",
    description: "Custom software, intelligent automation and scalable platforms that move business forward.",
    image: "/assets/software.jpg",
    imageAlt: "Software and AI automation workspace",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing & Content Creation",
    description: "Brand storytelling, campaigns and content that connect with global audiences.",
    image: "/assets/digital-marketing.jpg",
    imageAlt: "Digital marketing and content creation",
  },
  {
    icon: Plane,
    title: "Travel & Tourism",
    description: "Curated journeys and premium travel experiences across destinations worldwide.",
    image: "/assets/travel.jpg",
    imageAlt: "Travel and tourism destination",
  },
  {
    icon: Clapperboard,
    title: "Film Production",
    description: "Cinematic productions, creative direction and stories that inspire communities.",
    image: "/assets/film.jpg",
    imageAlt: "Film production set",
  },
  {
    icon: HeartHandshake,
    title: "Mai International Children\u2019s Foundation",
    description: "Education, care and brighter futures for children across communities worldwide.",
    image: "/assets/mai.jpeg",
    imageAlt: "Mai International Children\u2019s Foundation",
  },
  {
    icon: Trophy,
    title: "Gems Racing",
    description: "High-speed thrills, professional racing events and motorsport experiences built for champions.",
    image: "/assets/racing.png",
    imageAlt: "Gems Racing motorsport event",
  },
];

export default function ServicesPreview() {
  return (
    <section id="services" aria-label="Our services" className="relative overflow-x-clip bg-deepnavy py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
            Our Services
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream sm:text-4xl md:text-5xl">
            Diverse Industries. <span className="text-gold">Greater Impact.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-mutedwhite/80 sm:text-base">
            From technology to travel, creativity to community — we bring together
            multiple industries under one vision to create value, innovation and a
            better tomorrow.
          </p>
        </Reveal>
      </div>

      <ServiceCarousel3D items={SERVICES} />
    </section>
  );
}
