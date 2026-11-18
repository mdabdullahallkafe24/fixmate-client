
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Star,
  Wrench,
  Smartphone,
  Laptop,
  Refrigerator,
  Clock3,
  BadgeCheck,
} from "lucide-react";

const repairCategories = [
  {
    icon: Smartphone,
    name: "Smartphone",
    detail: "Screen & battery repair",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Laptop,
    name: "Laptop",
    detail: "Hardware & software",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Refrigerator,
    name: "Home Appliances",
    detail: "Repair & maintenance",
    color: "bg-teal-50 text-teal-600",
  },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-100/40 blur-3xl" />

      <div className="container-main relative grid items-center gap-14 py-16 lg:min-h-[700px] lg:grid-cols-2 lg:gap-16 lg:py-24">

        {/* Left Content */}
        <div className="relative z-10">
          {/* Small Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />

            <span className="text-xs font-bold tracking-wide text-blue-700 sm:text-sm">
              YOUR TRUSTED REPAIR PARTNER
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl lg:text-[62px]">
            Broken Device?
            <br />

            <span className="text-blue-600">
              We Fix It.
            </span>

            <br />

            You Relax.
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
            From smartphones to home appliances, connect with trusted
            technicians and get your devices back to life. Quality repairs,
            transparent pricing, and service you can trust.
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
            >
              Explore Services

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              How It Works
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap gap-x-7 gap-y-4 border-t border-slate-100 pt-7">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <ShieldCheck size={19} className="text-emerald-500" />
              Trusted Technicians
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <BadgeCheck size={19} className="text-blue-600" />
              Quality Service
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <Clock3 size={19} className="text-violet-500" />
              Easy Booking
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="relative mx-auto w-full max-w-[530px]">

          {/* Main Service Card */}
          <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-slate-50 p-5 shadow-2xl shadow-slate-200/70 sm:p-7">

            {/* Card Decoration */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-100/70 blur-2xl" />

            <div className="relative">

              {/* Card Header */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    FixMate Services
                  </p>

                  <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    What needs fixing?
                  </h2>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                  <Wrench size={23} />
                </div>
              </div>

              {/* Service Categories */}
              <div className="mt-7 space-y-3">
                {repairCategories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <div
                      key={category.name}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${category.color}`}
                      >
                        <Icon size={23} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-800">
                          {category.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {category.detail}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={19}
                        className="shrink-0 text-slate-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue-600"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA Card */}
              <div className="mt-5 rounded-2xl bg-blue-600 p-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-blue-100">
                      Need a helping hand?
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      We are here for you.
                    </p>
                  </div>

                  <Wrench
                    size={34}
                    className="shrink-0 text-blue-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Trust Cards - Below Main Card */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Verified Experts */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Verified Experts
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Reliable technicians
                </p>
              </div>
            </div>

            {/* Quality Service */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Star size={21} fill="currentColor" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Quality Service
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Quality-focused repairs
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
