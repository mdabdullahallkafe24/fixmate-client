
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Refrigerator,
  WashingMachine,
  ArrowUpRight,
  ArrowRight,
  Wrench,
} from "lucide-react";

const categories = [
  {
    name: "Smartphone Repair",
    description: "Screen, battery, charging port and more.",
    icon: Smartphone,
    color: "bg-blue-50 text-blue-600",
    number: "01",
  },
  {
    name: "Laptop Repair",
    description: "Hardware, software and performance issues.",
    icon: Laptop,
    color: "bg-violet-50 text-violet-600",
    number: "02",
  },
  {
    name: "Tablet Repair",
    description: "Display, battery and device troubleshooting.",
    icon: Tablet,
    color: "bg-amber-50 text-amber-600",
    number: "03",
  },
  {
    name: "TV & Monitor",
    description: "Display, sound and connectivity problems.",
    icon: Monitor,
    color: "bg-rose-50 text-rose-600",
    number: "04",
  },
  {
    name: "Refrigerator",
    description: "Cooling, compressor and maintenance service.",
    icon: Refrigerator,
    color: "bg-cyan-50 text-cyan-600",
    number: "05",
  },
  {
    name: "Washing Machine",
    description: "Drum, drainage and electrical repairs.",
    icon: WashingMachine,
    color: "bg-emerald-50 text-emerald-600",
    number: "06",
  },
];

export default function ServiceCategories() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
    >
      <div className="container-main relative">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2">
            <Wrench size={15} className="text-blue-600" />
            <span className="text-xs font-bold tracking-wide text-blue-700">
              OUR REPAIR CATEGORIES
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            What Can We{" "}
            <span className="text-blue-600">Fix</span> For You?
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-500 sm:text-lg">
            From everyday gadgets to essential home appliances,
            find the right repair service for all your needs.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href="/services"
                className="group relative rounded-3xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 sm:p-7"
              >
                {/* Top Row */}
                <div className="flex items-start justify-between">

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-bold tracking-wider text-slate-300">
                    {category.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-7">
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {category.name}
                  </h3>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>
                </div>

                {/* Bottom Link */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-sm font-bold text-blue-600">
                    Explore Services
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-center gap-5 rounded-3xl bg-slate-900 px-6 py-9 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
          <div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              Can't find your device?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Explore all available repair services on FixMate.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-blue-700"
          >
            View All Services
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
