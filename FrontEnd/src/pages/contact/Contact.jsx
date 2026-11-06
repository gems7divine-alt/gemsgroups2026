import { Globe, Handshake, MessageSquare, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AnimatedWords } from "../../components/Reveal";
import ContactForm from "./ContactForm";
import Opportunities from "./Opportunities";

const BADGES = [
  { icon: MessageSquare, label: "Quick Response" },
  { icon: Handshake, label: "Business Collaboration" },
  { icon: Globe, label: "Global Network" },
  { icon: Users, label: "Dedicated Support" },
];

export default function Contact() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero: responsive contact background with text on top */}
        <section aria-label="Contact us" className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy">
          <div
            className="contact-hero-bg absolute inset-0 bg-no-repeat"
            role="img"
            aria-label="GEMS Groups reception lobby at night"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-deepnavy/95 via-deepnavy/60 to-deepnavy/15"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-deepnavy to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:pt-32 lg:px-12">
            <div className="max-w-2xl">
              <p className="anim-fade-up text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
                Contact Us
              </p>
              <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.08] text-cream sm:text-5xl lg:text-[3.4rem]">
                <AnimatedWords text="Let's Build a" baseDelay={200} />
                <br />
                <AnimatedWords text="Brighter Tomorrow" baseDelay={500} />
                <br />
                <span className="text-gold">
                  <AnimatedWords text="Together." baseDelay={800} />
                </span>
              </h1>
              <p
                className="anim-fade-up mt-5 max-w-xl text-sm leading-relaxed text-mutedwhite/85 sm:text-base"
                style={{ animationDelay: "0.7s" }}
              >
                We&rsquo;re here to listen, collaborate and create opportunities
                across industries. Reach out to us for partnerships, business
                inquiries or any questions.
              </p>
              <div
                className="anim-fade-up mt-8 flex flex-wrap gap-x-8 gap-y-4"
                style={{ animationDelay: "0.85s" }}
              >
                {BADGES.map((badge) => (
                  <span key={badge.label} className="inline-flex items-center gap-2.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-gold">
                      <badge.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="max-w-[110px] text-xs font-medium leading-snug text-cream">
                      {badge.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ContactForm />
        <Opportunities />
      </main>
      <Footer />
    </>
  );
}
