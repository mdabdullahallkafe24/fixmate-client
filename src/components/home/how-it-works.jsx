
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  Wrench,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Service",
    description:
      "Find the repair service you need. Browse categories and choose the right service for your device.",
    icon: Search,
    color: "bg-blue-50 text-blue-600",
  },
  {
    number: "02",
    title: "Book a Repair",
    description:
      "Submit your service request with your device details and wait for a technician to accept it.",
    icon: CalendarCheck,
    color: "bg-violet-50 text-violet-600",
  },
  {
    number: "03",
    title: "Get It Repaired",
    description:
      "Your assigned technician works on your device and updates the repair progress until completion.",
    icon: Wrench,
    color: "bg-amber-50 text-amber-600",
  },
  {
    number: "04",
    title: "Pay After Completion",
    description:
      "Once your repair is completed, review the final amount and securely complete your payment.",
    icon: CreditCard,
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-white py-20 sm:py-24"
    >
      <div className="container-main">

        {/* Section Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
            <CheckCircle2 size={15} className="text-blue-600" />

            <span className="text-xs font-bold tracking-wide text-blue-700">
              SIMPLE PROCESS
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            How <span className="text-blue-600">FixMate</span> Works
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-500 sm:text-lg">
            Getting your device repaired has never been easier.
            Follow four simple steps and let our platform guide you.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">

          {/* Connecting Line - Desktop */}
          <div className="absolute left-[12%] right-[12%] top-[46px] hidden border-t-2 border-dashed border-blue-100 lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                {/* Icon */}
                <div className="relative z-10 flex items-center justify-between">

                  <div
                    className={`flex h-[62px] w-[62px] items-center justify-center rounded-2xl ${step.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={28} strokeWidth={1.8} />
                  </div>

                  <span className="text-3xl font-extrabold text-slate-100 transition-colors group-hover:text-blue-100">
                    {step.number}
                  </span>
                </div>

                {/* Text */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="mt-7 h-1 w-12 rounded-full bg-blue-100 transition-all duration-300 group-hover:w-20 group-hover:bg-blue-600" />
              </div>
            );
          })}
        </div>

        {/* Bottom Information Banner */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl border border-blue-100 bg-blue-50/70 p-7 sm:flex-row sm:p-9">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Your Satisfaction Matters
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Track your repair progress and pay only after the
                technician completes your service.
              </p>
            </div>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
