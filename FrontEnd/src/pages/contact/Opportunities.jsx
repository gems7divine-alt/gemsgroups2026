import { Briefcase, Handshake, MessageSquare, Users } from "lucide-react";
import Reveal from "../../components/Reveal";

const ITEMS = [
  {
    icon: Handshake,
    title: "Business Partnerships",
    text: "Collaborate with us across multiple industries.",
  },
  {
    icon: Briefcase,
    title: "Service Inquiries",
    text: "Get detailed information about our services.",
  },
  {
    icon: Users,
    title: "Career Opportunities",
    text: "Join our team and be part of a global journey.",
  },
  {
    icon: MessageSquare,
    title: "General Enquiries",
    text: "We're happy to answer any questions you may have.",
  },
];

export default function Opportunities() {
  return (
    <section aria-label="Connect for opportunities" className="bg-[#FBF7EE] pb-16 md:pb-24">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-8 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:px-12">
        <Reveal className="min-h-[260px] sm:min-h-[340px] lg:min-h-full">
          <div
            className="h-full min-h-[260px] rounded-2xl bg-cover bg-center bg-no-repeat shadow-[0_18px_50px_rgba(3,20,38,0.16)] sm:min-h-[340px]"
            style={{ backgroundImage: "url('/assets/flight.png')" }}
            role="img"
            aria-label="Airplane flying over a glowing global city"
          />
        </Reveal>

        <div>
          <Reveal className="text-center lg:text-left">
            <h2 className="font-serif text-3xl font-bold text-deepnavy sm:text-4xl">
              Connect for <span className="text-[#A87B1F]">Opportunities</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2">
            {ITEMS.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 120} className="text-center">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-deepnavy">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mx-auto mt-3 max-w-[200px] text-[15px] font-bold leading-snug text-deepnavy">
                  {item.title}
                </h3>
                <p className="mx-auto mt-1 max-w-[220px] text-[13px] leading-relaxed text-deepnavy/65">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
