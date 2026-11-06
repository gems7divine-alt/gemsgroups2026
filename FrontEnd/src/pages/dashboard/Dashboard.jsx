import { useEffect } from "react";
import { ArrowRight, LogOut, ShieldCheck, Users } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

const OPTIONS = [
  {
    id: "employee",
    icon: Users,
    title: "Employee Access",
    text: "Daily operations, tasks, schedules and internal resources for GEMS Groups team members.",
    cta: "Enter as Employee",
  },
  {
    id: "admin",
    icon: ShieldCheck,
    title: "Admin Access",
    text: "Manage staff, permissions, reports and system settings. Restricted to administrators.",
    cta: "Enter as Admin",
  },
];

export default function Dashboard() {
  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleOptionClick = (id) => {
    if (id === "admin") {
      window.location.hash = "#/adminpassword";
      return;
    }
    window.location.hash = "#/employeeaccess";
  };

  const handleLogout = () => {
    sessionStorage.removeItem("gems_staff_auth");
    window.location.hash = "#/";
  };

  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-32">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/office.png')" }}
          role="img"
          aria-label="GEMS Groups office background"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-deepnavy/95 via-deepnavy/85 to-deepnavy/60"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.45em] text-gold sm:text-xs">
              Staff Dashboard
            </p>
            <h1 className="mt-3 font-serif text-3xl font-bold text-cream sm:text-4xl md:text-[2.6rem]">
              Choose Access Type
            </h1>
            <p className="mt-3 text-sm text-mutedwhite/70 sm:text-[15px]">
              Select your portal to continue. Employee access is for daily work,
              admin access is for management and settings.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {OPTIONS.map((option, i) => (
              <Reveal key={option.id} delay={i * 120} className="h-full">
                <button
                  type="button"
                  onClick={() => handleOptionClick(option.id)}
                  className="group flex h-full w-full flex-col rounded-2xl border border-gold/25 bg-deepnavy p-7 text-left shadow-[0_14px_40px_rgba(3,20,38,0.16)] transition-all duration-300 hover:-translate-y-1 hover:border-gold sm:p-9"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold">
                    <option.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="mt-5 font-serif text-2xl font-bold text-cream">
                    {option.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-mutedwhite/70">
                    {option.text}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                    {option.cta}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-gold/60 px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-gold hover:text-deepnavy"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
