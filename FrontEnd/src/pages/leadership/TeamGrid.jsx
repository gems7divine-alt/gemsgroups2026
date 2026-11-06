import Reveal from "../../components/Reveal";

export default function TeamGrid() {
  return (
    <section aria-label="Executive leadership" className="bg-[#FBF7EE] py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-[#A87B1F] sm:text-xs">
            Our Leadership
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-deepnavy sm:text-4xl md:text-[2.6rem]">
            Executive Leadership
          </h2>
          <p className="mt-3 text-sm text-deepnavy/65 sm:text-[15px]">
            Guiding our journey with vision, expertise and commitment.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <article className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_14px_40px_rgba(3,20,38,0.16)] md:grid-cols-2">
            <div className="relative min-h-[320px] md:min-h-[480px]">
              <img
                src="/assets/ceo.png"
                alt="David Jabee, Founder and CEO of GEMS Groups"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
                Founder &amp; CEO
              </p>
              <h3 className="mt-2 font-serif text-3xl font-bold text-cream sm:text-4xl">
                David Jabee
              </h3>
              <span
                className="mt-4 h-px w-16 bg-gold/70"
                aria-hidden="true"
              />
              <p className="mt-5 text-sm leading-relaxed text-mutedwhite/85 sm:text-[15px]">
                David Jabee is the Founder and CEO of GEMS Groups, leading the
                group&rsquo;s global vision, strategy and growth across
                technology, travel, education, media and managed services.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-mutedwhite/70 sm:text-[15px]">
                He believes in innovation with purpose &mdash; building
                businesses that create value, empower people and make a positive
                impact across industries and communities. Under his leadership,
                GEMS Groups continues to expand globally through collaboration,
                integrity and customer-first execution.
              </p>
              <p className="mt-4 border-l-2 border-gold/60 pl-4 font-serif text-base italic leading-relaxed text-cream/90">
                &ldquo;Visionary leadership is about building a stronger
                tomorrow, together.&rdquo;
              </p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
