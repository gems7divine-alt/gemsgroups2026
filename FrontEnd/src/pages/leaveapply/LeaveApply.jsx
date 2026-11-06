import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CircleCheck,
  Mail,
  MessageSquare,
  TriangleAlert,
  User,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import { sendLeaveApplyEmail } from "../emailservices/leaveapplyemail";

const inputClass =
  "w-full bg-transparent py-3.5 text-sm text-cream placeholder:text-mutedwhite/45 focus:outline-none";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/70";

const initialForm = { name: "", email: "", message: "" };

export default function LeaveApply() {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Same access guard as the employee login page
    if (sessionStorage.getItem("gems_staff_auth") !== "true") {
      window.location.hash = "#/staffpassword";
      return;
    }
    if (sessionStorage.getItem("gems_employee_auth") !== "true") {
      window.location.hash = "#/employeeaccess";
      return;
    }
    // Prefill employee name from the login session
    const prefillName = sessionStorage.getItem("gems_employee_name") || "";
    if (prefillName) {
      setForm((prev) => ({ ...prev, name: prefillName }));
    }
    window.scrollTo(0, 0);
  }, []);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Send the leave details to mail via EmailJS (template_5jxadd2)
      await sendLeaveApplyEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
    } catch {
      setError(
        "Something went wrong while sending your leave application. Please try again.",
      );
      return;
    }
    try {
      const raw = localStorage.getItem("gems_leave_applications");
      const parsed = raw ? JSON.parse(raw) : [];
      const applications = Array.isArray(parsed) ? parsed : [];
      applications.push({
        id: `leave-${Date.now()}`,
        employeeId: sessionStorage.getItem("gems_employee_id") || "",
        employeeName: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        status: "Pending",
        appliedAt: new Date().toISOString(),
      });
      localStorage.setItem("gems_leave_applications", JSON.stringify(applications));
      setSent(true);
    } catch {
      // Email already delivered — record locally failed but application stands
      setSent(true);
    }
  };

  const handleReset = () => {
    setSent(false);
    setForm(initialForm);
  };

  const prefillName = sessionStorage.getItem("gems_employee_name") || "";

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
        <div className="relative z-10 mx-auto w-full max-w-2xl">
          <Reveal>
            <div className="rounded-2xl border border-gold/25 bg-deepnavy p-7 shadow-[0_14px_40px_rgba(3,20,38,0.16)] sm:p-9">
              {sent ? (
                <div className="text-center">
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                    <CircleCheck className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h1 className="mt-4 font-serif text-3xl font-bold text-cream">
                    Leave Applied
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-mutedwhite/75">
                    Your leave application has been submitted successfully. The
                    admin will review it and get back to you shortly.
                  </p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <a
                      href="#/employeelogin"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02]"
                    >
                      <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                      Back to Employee Login
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/60 px-7 py-3 text-sm font-semibold text-cream transition-all duration-300 hover:bg-gold hover:text-deepnavy"
                    >
                      Apply Another Leave
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">
                    Employee Leave
                  </p>
                  <h1 className="mt-2 font-serif text-3xl font-bold text-cream">
                    Apply Leave
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-mutedwhite/70">
                    {prefillName
                      ? `${prefillName}, fill the details below and submit your leave application.`
                      : "Fill the details below and submit your leave application."}
                  </p>

                  {error && (
                    <div
                      role="alert"
                      className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-500/10 p-4"
                    >
                      <TriangleAlert
                        className="mt-0.5 h-5 w-5 shrink-0 text-red-300"
                        aria-hidden="true"
                      />
                      <p className="text-sm leading-relaxed text-red-200">{error}</p>
                    </div>
                  )}

                  <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="leave-name" className={labelClass}>
                        User Name *
                      </label>
                      <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 transition-colors focus-within:border-gold/60">
                        <User className="h-4 w-4 shrink-0 text-gold/80" aria-hidden="true" />
                        <input
                          id="leave-name"
                          required
                          placeholder="Your Name *"
                          name="name"
                          value={form.name}
                          onChange={updateField("name")}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="leave-email" className={labelClass}>
                        Email *
                      </label>
                      <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 transition-colors focus-within:border-gold/60">
                        <Mail className="h-4 w-4 shrink-0 text-gold/80" aria-hidden="true" />
                        <input
                          id="leave-email"
                          required
                          type="email"
                          placeholder="Your Email *"
                          name="email"
                          value={form.email}
                          onChange={updateField("email")}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="leave-message" className={labelClass}>
                        Message *
                      </label>
                      <div className="mt-2 flex items-start gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 transition-colors focus-within:border-gold/60">
                        <MessageSquare
                          className="mt-3.5 h-4 w-4 shrink-0 text-gold/80"
                          aria-hidden="true"
                        />
                        <textarea
                          id="leave-message"
                          required
                          rows={4}
                          placeholder="Reason for leave / details *"
                          name="message"
                          value={form.message}
                          onChange={updateField("message")}
                          className={`${inputClass} resize-y`}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-deepnavy transition-all duration-300 hover:scale-[1.02]"
                    >
                      <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                      Apply Leave
                    </button>
                  </form>

                  <div className="mt-6 text-center text-[13px]">
                    <a
                      href="#/employeelogin"
                      className="text-mutedwhite/60 transition-colors hover:text-gold"
                    >
                      Back to Employee Login
                    </a>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}
