
import Link from "next/link";
import {
  ShieldCheck,
  BadgeCheck,
  Wallet,
  BellRing,
  CreditCard,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified Technicians",
    description:
      "Connect with trusted technicians who are reviewed and approved by our platform.",
    color: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description:
      "Know your final repair cost before making payment. No unexpected charges.",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: BellRing,
    title: "Booking Updates",
    description:
      "Stay informed about your repair request with clear booking status updates.",
    color: "bg-violet-500/10 text-violet-400",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Pay securely online after your technician completes the repair service.",
    color: "bg-amber-500/10 text-amber-400",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="container-main relative">

        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2">
            <Sparkles size={15} className="text-blue-400" />

            <span className="text-xs font-bold tracking-wide text-blue-300">
              THE FIXMATE ADVANTAGE
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Why Choose{" "}
            <span className="text-blue-400">FixMate?</span>
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
            We make device repair simple, reliable, and stress-free.
            Everything you need for a better repair experience,
            all in one place.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/[0.07]"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h3 className="mt-7 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>

                <div className="mt-7 h-1 w-10 rounded-full bg-blue-500/40 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-400" />
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 p-7 sm:flex-row sm:items-center sm:p-9">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
              <ShieldCheck size={26} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Repair with Confidence
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Track your booking, stay updated, and pay after
                your service is successfully completed.
              </p>
            </div>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
