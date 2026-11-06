import { ArrowRight } from "lucide-react";

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

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      id="mobile-menu"
      className="anim-fade-in border-t border-gold/15 bg-deepnavy/95 backdrop-blur-xl lg:hidden"
    >
      <nav aria-label="Mobile" className="space-y-1 px-5 py-4">
        {LINKS.map((link) => {
          const active = link.match ? currentMatch() === link.match : link.active && currentMatch() === "home";
          return (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={`block rounded-lg px-3 py-3 text-[15px] tracking-wide transition-colors ${
                active
                  ? "bg-gold/10 text-gold"
                  : "text-cream/90 hover:bg-white/5 hover:text-gold"
              }`}
            >
              {link.label}
            </a>
          );
        })}
        <a
          href="#/staffpassword"
          onClick={onClose}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/60 px-5 py-3 text-sm font-semibold tracking-wide text-cream transition-all hover:bg-gold hover:text-deepnavy"
        >
          Staff Access
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </nav>
    </div>
  );
}
