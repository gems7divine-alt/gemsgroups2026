import { Star } from "lucide-react";
import Reveal from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "GEMS Groups delivered exceptional solutions for our business. Their professionalism and innovation are unmatched.",
    name: "Arun Kumar",
    role: "CEO, Tech Solutions Pvt Ltd",
    initials: "AK",
  },
  {
    quote:
      "Our travel experience was seamless and memorable. Highly recommended for global travel services.",
    name: "Priya Menon",
    role: "Travel Client",
    initials: "PM",
  },
  {
    quote:
      "Creative, reliable and impactful. GEMS Groups helped us bring our vision to life through their digital marketing and content creation.",
    name: "Rahul Verma",
    role: "Business Owner",
    initials: "RV",
  },
];

function Stars() {
  return (
    <div className="mt-3 flex gap-1" role="img" aria-label="Rated 5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#D9A441] text-[#D9A441]" aria-hidden="true" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section aria-label="What our clients say" className="bg-[#FBF7EE] py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-[#A87B1F] sm:text-xs">
            What Our Clients Say
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-deepnavy sm:text-4xl md:text-[2.6rem]">
            Trusted by Businesses Around the World
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120} className="h-full">
            <figure
              className="h-full rounded-2xl border border-deepnavy/10 bg-white p-6 shadow-[0_10px_30px_rgba(3,20,38,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(3,20,38,0.12)] sm:p-7"
            >
              <div className="flex items-center gap-4">
                <span
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-deepnavy font-serif text-sm font-bold tracking-wide text-gold"
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <div>
                  <figcaption className="text-sm font-bold text-deepnavy">{t.name}</figcaption>
                  <p className="text-xs text-deepnavy/60">{t.role}</p>
                </div>
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-deepnavy/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <Stars />
            </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
