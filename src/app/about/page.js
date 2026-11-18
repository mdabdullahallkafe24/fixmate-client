
import Link from "next/link";

import {
  Wrench,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Target,
  HeartHandshake,
  Award,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "We believe every customer deserves honest communication, clear pricing, and dependable repair services.",
  },
  {
    icon: Users,
    title: "Customer First",
    description:
      "Our platform is designed around customer convenience, making it easier to find and book reliable technicians.",
  },
  {
    icon: Award,
    title: "Quality Service",
    description:
      "We aim to connect customers with skilled professionals who care about quality and customer satisfaction.",
  },
];

const benefits = [
  "Find services for multiple device categories",
  "Connect with skilled repair technicians",
  "Book repair services conveniently",
  "Track your repair booking status",
  "Enjoy a transparent repair experience",
  "Pay after your repair is completed",
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white">

      {/* Hero Section */}
      <section className="relative bg-slate-950 py-20 text-white sm:py-24">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="container-main relative">
          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <Wrench size={16} />
              Get to Know FixMate
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Making Device Repair
              <span className="block text-blue-400">
                Simple & Reliable.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              FixMate is a smart repair service platform designed to
              connect customers with skilled technicians. We make
              finding, booking, and managing repair services easier.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Explore Our Services
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Back to Home
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 sm:py-24">
        <div className="container-main grid items-center gap-14 lg:grid-cols-2">

          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Who We Are
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              A Smarter Way to
              <span className="text-blue-600"> Repair Your Devices.</span>
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600">
              Finding a reliable technician should not be complicated.
              FixMate brings customers and repair professionals together
              through one convenient platform.
            </p>

            <p className="mt-4 text-base leading-8 text-slate-600">
              Whether it is a smartphone, laptop, television, or home
              appliance, our goal is to make the repair journey easier,
              more organized, and more transparent.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <HeartHandshake size={25} />
              </span>

              <div>
                <h3 className="font-bold text-slate-900">
                  Built Around Your Convenience
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Better connections. Easier repairs.
                </p>
              </div>
            </div>
          </div>

          {/* Visual Card */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-9">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <Wrench size={32} />
              </div>

              <h3 className="mt-7 text-2xl font-extrabold text-slate-900">
                One Platform.
                <span className="block text-blue-600">
                  Multiple Repair Solutions.
                </span>
              </h3>

              <p className="mt-4 leading-7 text-slate-500">
                From everyday device problems to essential home
                appliance repairs, FixMate helps bring the right
                service closer to you.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <Target className="text-blue-600" size={25} />
                  <h4 className="mt-3 font-bold text-slate-900">
                    Our Mission
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Simplify the repair booking experience.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <HeartHandshake className="text-blue-600" size={25} />
                  <h4 className="mt-3 font-bold text-slate-900">
                    Our Promise
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Focus on trust and convenience.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Values Section */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="container-main">

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              What Matters to Us
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              The Values Behind FixMate
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Everything we do is guided by our commitment to a
              better and more dependable repair experience.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon size={27} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Why FixMate */}
      <section className="py-20 sm:py-24">
        <div className="container-main grid items-center gap-12 lg:grid-cols-2">

          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Why FixMate
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need for a Better Repair Experience.
            </h2>

            <p className="mt-5 leading-8 text-slate-500">
              We want to make the complete repair journey convenient,
              from choosing a service to completing your booking.
            </p>

            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={21}
                    className="shrink-0 text-blue-600"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-blue-600 p-8 text-white sm:p-12">
            <ShieldCheck size={45} />

            <h3 className="mt-7 text-3xl font-extrabold leading-tight">
              Your Devices Deserve Better Care.
            </h3>

            <p className="mt-5 leading-8 text-blue-100">
              Discover a simpler way to find repair services and
              manage your repair bookings with FixMate.
            </p>

            <Link
              href="/services"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Find a Service
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
