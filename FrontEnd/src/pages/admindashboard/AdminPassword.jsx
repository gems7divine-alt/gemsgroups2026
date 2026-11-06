import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

const ADMIN_PASSWORD = "123456";

export default function AdminPassword() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_admin_auth") === "true") {
      window.location.hash = "#/admindashboard";
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("gems_admin_auth", "true");
      setError("");
      window.location.hash = "#/admindashboard";
    } else {
      setError("Incorrect admin password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="relative flex min-h-[92svh] items-center overflow-hidden bg-deepnavy px-5 pb-16 pt-28 sm:px-8 md:pt-32">
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
        <div className="relative z-10 mx-auto w-full max-w-md">
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-gold/25 bg-deepnavy shadow-[0_14px_40px_rgba(3,20,38,0.16)]">
              <div className="p-7 sm:p-9">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
                  Admin Access
                </p>
                <h1 className="mt-2 font-serif text-3xl font-bold text-cream">
                  Enter Admin Password
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-mutedwhite/70">
                  This area is restricted to administrators. Please enter the
                  admin password to open the admin dashboard.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                  <label
                    htmlFor="admin-password"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-cream/80"
                  >
                    Admin Password
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="admin-password"
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter admin password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-gold/30 bg-white/5 px-4 py-3 pr-12 text-sm text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-cream/60 transition-colors hover:text-gold"
                    >
                      {show ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {error && (
                    <p role="alert" className="mt-3 text-[13px] font-medium text-red-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(217,164,65,0.5)]"
                  >
                    Unlock Admin Dashboard
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </form>

                <a
                  href="#/dashboard"
                  className="mt-5 block text-center text-[13px] text-mutedwhite/60 transition-colors hover:text-gold"
                >
                  Back to Staff Dashboard
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
