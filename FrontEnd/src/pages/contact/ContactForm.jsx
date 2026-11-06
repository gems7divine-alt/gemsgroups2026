import { useState } from "react";
import {
  Briefcase,
  CircleCheck,
  LayoutGrid,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  TriangleAlert,
  User,
} from "lucide-react";
import { ArrowRight } from "lucide-react";
import Reveal from "../../components/Reveal";
import { sendContactEmail } from "../emailservices/contactemail";

const SERVICE_OPTIONS = [
  "Software Services & AI Automation",
  "Travel Services Global",
  "Digital Marketing & Content Creation",
  "Film Production",
  "Gems Racing",
  "Mai International Children's Foundation",
  "General Enquiry",
];

function Field({ icon: Icon, children }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-4 transition-colors focus-within:border-gold/60">
      <Icon className="h-4 w-4 shrink-0 text-gold/80" aria-hidden="true" />
      {children}
    </label>
  );
}

const inputClass =
  "w-full bg-transparent py-3.5 text-sm text-cream placeholder:text-mutedwhite/45 focus:outline-none";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  message: "",
};

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      // Collect user details from the form and send them to mail via EmailJS
      await sendContactEmail(form);
      setSent(true);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Failed to send contact email:", err);
      setError(
        "Something went wrong while sending your message. Please try again or email us directly at info@gemsgroups.in.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-label="Get in touch" className="bg-[#FBF7EE] py-14 md:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-12">
        {/* Form card */}
        <Reveal className="h-full">
          <div className="h-full rounded-2xl bg-deepnavy p-6 sm:p-8">
            <h2 className="font-serif text-3xl font-bold text-cream sm:text-4xl">
              Get in <span className="text-gold">Touch</span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-mutedwhite/75">
              Have a project in mind or want to explore a partnership? Fill out
              the form and our team will get back to you shortly.
            </p>

            {sent ? (
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/10 p-5">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-cream">Thank you for reaching out!</p>
                  <p className="mt-1 text-sm text-mutedwhite/75">
                    Your message has been sent to our team. We will get back to you shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="mt-6 space-y-4"
                onSubmit={handleSubmit}
              >
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-500/10 p-4"
                  >
                    <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-300" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-red-200">{error}</p>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field icon={User}>
                    <input
                      required
                      placeholder="Your Name *"
                      aria-label="Your name"
                      name="name"
                      value={form.name}
                      onChange={updateField("name")}
                      className={inputClass}
                    />
                  </Field>
                  <Field icon={Mail}>
                    <input
                      required
                      type="email"
                      placeholder="Your Email *"
                      aria-label="Your email"
                      name="email"
                      value={form.email}
                      onChange={updateField("email")}
                      className={inputClass}
                    />
                  </Field>
                  <Field icon={Phone}>
                    <input
                      required
                      type="tel"
                      placeholder="Phone Number *"
                      aria-label="Phone number"
                      name="phone"
                      value={form.phone}
                      onChange={updateField("phone")}
                      className={inputClass}
                    />
                  </Field>
                  <Field icon={Briefcase}>
                    <input
                      placeholder="Company Name"
                      aria-label="Company name"
                      name="company"
                      value={form.company}
                      onChange={updateField("company")}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field icon={LayoutGrid}>
                  <select
                    aria-label="Select service"
                    value={form.service}
                    onChange={updateField("service")}
                    required
                    className={`${inputClass} appearance-none [&>option]:bg-deepnavy`}
                  >
                    <option value="" disabled>
                      Select Service
                    </option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field icon={MessageSquare}>
                  <textarea
                    required
                    rows={4}
                    placeholder="Your Message *"
                    aria-label="Your message"
                    name="message"
                    value={form.message}
                    onChange={updateField("message")}
                    className={`${inputClass} resize-y`}
                  />
                </Field>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-lightgold to-gold px-7 py-3.5 text-sm font-bold tracking-wide text-deepnavy transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_28px_rgba(217,164,65,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {sending ? "Sending..." : "Send Message"}
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </form>
            )}
          </div>
        </Reveal>

        {/* Info cards */}
        <div className="grid content-start gap-4 sm:grid-cols-2">
          <Reveal delay={100}>
            <div className="h-full rounded-2xl bg-white p-6 text-center shadow-[0_10px_30px_rgba(3,20,38,0.06)]">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-deepnavy">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-deepnavy">Phone</h3>
              <a href="tel:+919876543210" className="mt-1 block text-[13px] font-semibold text-deepnavy transition-colors hover:text-[#A87B1F]">
                +91 98765 43210
              </a>
              <p className="mt-2 text-xs leading-relaxed text-deepnavy/60">
                Mon – Sat
                <br />
                9:00 AM – 6:00 PM (IST)
              </p>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="h-full rounded-2xl bg-white p-6 text-center shadow-[0_10px_30px_rgba(3,20,38,0.06)]">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-deepnavy">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-deepnavy">Email</h3>
              <a href="mailto:info@gemsgroups.in" className="mt-1 block break-all text-[13px] font-semibold text-deepnavy transition-colors hover:text-[#A87B1F]">
                info@gemsgroups.in
              </a>
              <p className="mt-2 text-xs leading-relaxed text-deepnavy/60">
                We typically reply
                <br />
                within 24 hours
              </p>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="h-full rounded-2xl bg-white p-6 text-center shadow-[0_10px_30px_rgba(3,20,38,0.06)]">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-deepnavy">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                </svg>
              </span>
              <h3 className="mt-3 text-sm font-bold text-deepnavy">Our Office</h3>
              <p className="mt-1 text-[13px] font-semibold text-deepnavy">
                Chennai, Tamil Nadu
                <br />
                India
              </p>
              <p className="mt-2 text-xs leading-relaxed text-deepnavy/60">
                No. 12, Business Hub,
                <br />
                Chennai, Tamil Nadu 600001
              </p>
            </div>
          </Reveal>
          <Reveal delay={340}>
            <div className="h-full rounded-2xl bg-white p-6 text-center shadow-[0_10px_30px_rgba(3,20,38,0.06)]">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-deepnavy">
                <GlobeIcon />
              </span>
              <h3 className="mt-3 text-sm font-bold text-deepnavy">Follow Us</h3>
              <div className="mt-2 flex justify-center gap-2">
                <SocialButton label="LinkedIn">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </SocialButton>
                <SocialButton label="Instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </SocialButton>
                <SocialButton label="YouTube">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </SocialButton>
                <SocialButton label="Facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </SocialButton>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-deepnavy/60">
                Stay connected
                <br />
                for latest updates and opportunities.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

function SocialButton({ label, children }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-deepnavy text-cream transition-all duration-300 hover:bg-gold hover:text-deepnavy"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
