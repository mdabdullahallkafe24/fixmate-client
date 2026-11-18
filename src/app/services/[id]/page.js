
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Wrench,
} from "lucide-react";

// Allow this route to use blocking route rendering
export const instant = false;

const services = [
  {
    id: "1",
    name: "Smartphone Repair",
    category: "Smartphone",
    price: 500,
    duration: "1–2 hours",
    description:
      "Get professional repair solutions for your smartphone. Our technicians can help with screen damage, battery issues, charging problems, and other common smartphone faults.",
    features: [
      "Screen and display repair",
      "Battery replacement",
      "Charging port repair",
      "Software troubleshooting",
    ],
  },
  {
    id: "2",
    name: "Laptop Repair",
    category: "Laptop",
    price: 800,
    duration: "2–4 hours",
    description:
      "Keep your laptop running smoothly with expert diagnosis and repair. We provide solutions for hardware, performance, keyboard, and software-related issues.",
    features: [
      "Hardware diagnosis",
      "Keyboard repair",
      "Performance optimization",
      "Software troubleshooting",
    ],
  },
  {
    id: "3",
    name: "Tablet Repair",
    category: "Tablet",
    price: 600,
    duration: "1–3 hours",
    description:
      "Professional tablet repair services for damaged screens, battery problems, charging issues, and software-related faults.",
    features: [
      "Display repair",
      "Battery replacement",
      "Charging issue solutions",
      "Software support",
    ],
  },
  {
    id: "4",
    name: "TV & Monitor Repair",
    category: "TV & Monitor",
    price: 1000,
    duration: "2–5 hours",
    description:
      "Restore your TV or monitor with reliable troubleshooting and repair services for display, power, and connectivity problems.",
    features: [
      "Display troubleshooting",
      "Power issue repair",
      "Connectivity solutions",
      "General maintenance",
    ],
  },
  {
    id: "5",
    name: "Refrigerator Repair",
    category: "Home Appliances",
    price: 1200,
    duration: "2–4 hours",
    description:
      "Get dependable refrigerator repair services for cooling problems, unusual noises, and other common appliance issues.",
    features: [
      "Cooling problem diagnosis",
      "Temperature troubleshooting",
      "General maintenance",
      "Performance inspection",
    ],
  },
  {
    id: "6",
    name: "Washing Machine Repair",
    category: "Home Appliances",
    price: 900,
    duration: "2–4 hours",
    description:
      "Get your washing machine working properly again with professional troubleshooting and repair support.",
    features: [
      "Drainage issue repair",
      "Spin cycle troubleshooting",
      "Water supply issue diagnosis",
      "General maintenance",
    ],
  },
];

export function generateStaticParams() {
  return services.map((service) => ({
    id: service.id,
  }));
}

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;

  const service = services.find((item) => item.id === id);

  if (!service) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Service Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            The service you are looking for does not exist.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {service.name}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {service.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Clock3 size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Estimated Duration
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    {service.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Service Quality
                  </p>
                  <p className="mt-1 font-bold text-slate-900">
                    Professional Support
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">
                What&apos;s Included
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-green-600"
                    />

                    <span className="text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Wrench size={23} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Starting from
                </p>

                <p className="text-3xl font-bold text-slate-900">
                  ৳{service.price}
                </p>
              </div>
            </div>

            <div className="my-6 border-t border-slate-100" />

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                How is the final price determined?
              </p>

              <p className="mt-2 text-sm leading-7 text-blue-800">
                This is an estimated starting price. The technician
                will inspect your device and determine the final
                repair cost based on the actual problem.
              </p>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              The final repair cost may vary depending on the
              device condition, replacement parts, and required work.
            </p>

            <Link
              href="/sign-in"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Book This Service
              <ArrowRight size={18} />
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Sign in to request a repair service.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
