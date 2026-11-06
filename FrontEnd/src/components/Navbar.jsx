import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import MobileMenu from "./MobileMenu";

const LINKS = [
  { label: "Home", href: "#/", active: true, match: "home" },
  { label: "About Us", href: "#/about", active: false, match: "about" },
  { label: "Services", href: "#/services", active: false, match: "services" },
  { label: "Leadership", href: "#/leadership", active: false, match: "leadership" },
  { label: "Contact", href: "#/contact", active: false, match: "contact" },
];

function currentMatch() {
  if (typeof window === "undefined") return "home";
  const hash = window.location.hash;
  if (hash === "#/about") return "about";
  if (hash === "#/services") return "services";
  if (hash === "#/leadership") return "leadership";
  if (hash === "#/contact") return "contact";
  if (hash === "#/staffpassword" || hash === "#/staff") return "staffpassword";
  if (hash === "#/dashboard") return "dashboard";
  if (hash === "#/adminpassword") return "adminpassword";
  if (hash === "#/admindashboard") return "admindashboard";
  if (hash === "#/newemployeeadding") return "newemployeeadding";
  if (hash === "#/employeeaccess") return "employeeaccess";
  if (hash === "#/employeelogin") return "employeelogin";
  if (hash === "#/employeeattendance") return "employeeattendance";
  return "home";
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`anim-navbar fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-gold/10 bg-deepnavy/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20 lg:px-8">
        <a href="#/" className="flex shrink-0 items-center gap-2.5" aria-label="GEMS Groups — Home">
          <img
            src="/assets/gems_groups_logo.png"
            alt="GEMS Groups logo"
            className="h-11 w-auto object-contain mix-blend-screen md:h-14"
            width={160}
            height={107}
          />
          <span className="whitespace-nowrap font-serif text-base font-bold tracking-[0.18em] text-gold sm:text-lg md:text-xl">
            GEMS GROUPS
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => {
            const active = link.match ? currentMatch() === link.match : link.active && currentMatch() === "home";
            return (
              <a
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`nav-link text-[13px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "nav-link-active text-gold"
                    : "text-cream/85 hover:text-gold"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <a
            href="#/staffpassword"
            className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:scale-[1.03] hover:bg-gold hover:text-deepnavy hover:shadow-[0_0_24px_rgba(217,164,65,0.45)]"
          >
            Staff Access
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-cream lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
