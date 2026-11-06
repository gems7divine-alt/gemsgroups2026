import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

function BrandIcon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
      role="presentation"
    >
      {children}
    </svg>
  );
}

const LinkedinIcon = () => (
  <BrandIcon>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </BrandIcon>
);

const InstagramIcon = () => (
  <BrandIcon>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </BrandIcon>
);

const YoutubeIcon = () => (
  <BrandIcon>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </BrandIcon>
);

const FacebookIcon = () => (
  <BrandIcon>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </BrandIcon>
);

const QUICK_LINKS = [
  { label: "Home", href: "#/" },
  { label: "About Us", href: "#/about" },
  { label: "Services", href: "#/services" },
  { label: "Leadership", href: "#/leadership" },
  { label: "Contact", href: "#/contact" },
];

const SERVICE_LINKS = [
  "Software Services & AI Automation",
  "Travel Services Global",
  "Digital Marketing & Content Creation",
  "Film Production",
  "Gems Racing",
  "Mai International Children's Foundation",
];

const SOCIALS = [
  { Icon: LinkedinIcon, label: "LinkedIn", href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: YoutubeIcon, label: "YouTube", href: "#" },
  { Icon: FacebookIcon, label: "Facebook", href: "#" },
];

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden bg-[#040F1D] text-mutedwhite">
      <div className="mx-auto w-full max-w-7xl px-5 pb-8 pt-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.2fr_1fr]">
          {/* Brand */}
          <div>
            <a href="#/" className="flex items-center gap-2.5" aria-label="GEMS Groups — Home">
              <img
                src="/assets/gems_groups_logo.png"
                alt="GEMS Groups logo"
                className="h-12 w-auto object-contain mix-blend-screen"
                width={72}
                height={48}
                loading="lazy"
              />
              <span className="whitespace-nowrap font-serif text-lg font-bold tracking-[0.18em] text-gold">
                GEMS GROUPS
              </span>
            </a>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-mutedwhite/70">
              A diversified global company driven by innovation, creativity and
              social impact. We build solutions, create opportunities and make a
              positive difference.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-all duration-300 hover:bg-gold hover:text-deepnavy"
                >
                  <s.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer">
            <h3 className="font-serif text-base text-cream">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-mutedwhite/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Our Services */}
          <div>
            <h3 className="font-serif text-base text-cream">Our Services</h3>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <a
                    href="#/services"
                    className="text-[13px] text-mutedwhite/70 transition-colors hover:text-gold"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div id="contact">
            <h3 className="font-serif text-base text-cream">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-[13px] text-mutedwhite/75">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a href="tel:+919876543210" className="transition-colors hover:text-gold">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <a
                  href="mailto:info@gemsgroups.in"
                  className="transition-colors hover:text-gold"
                >
                  info@gemsgroups.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-mutedwhite/55">
            &copy; 2020 - 2025 GEMS Groups. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <nav aria-label="Legal" className="flex items-center gap-5 text-xs text-mutedwhite/55">
              <a href="#" className="transition-colors hover:text-gold">Privacy Policy</a>
              <a href="#" className="transition-colors hover:text-gold">Terms &amp; Conditions</a>
              <a href="#" className="transition-colors hover:text-gold">Sitemap</a>
            </nav>
            <button
              type="button"
              onClick={scrollTop}
              aria-label="Back to top"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 text-gold transition-all duration-300 hover:bg-gold hover:text-deepnavy"
            >
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
