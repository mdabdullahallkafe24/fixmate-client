
import Link from "next/link";

import {
  Wrench,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Services", href: "/services" },
  { name: "How It Works", href: "/#how-it-works" },
];

const serviceLinks = [
  "Smartphone Repair",
  "Laptop Repair",
  "Tablet Repair",
  "TV & Monitor Repair",
  "Refrigerator Repair",
  "Washing Machine Repair",
];

const supportLinks = [
  { name: "Help Center", href: "/help" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="container-main relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-20">

          {/* Brand Section */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Wrench size={23} strokeWidth={2.4} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight">
                Fix<span className="text-blue-400">Mate</span>
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-slate-400">
              Your trusted partner for smart device and home appliance
              repair services. Find reliable technicians and get your
              devices back to life.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-300">
              <ShieldCheck size={15} />
              Trusted Repair Experience
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {link.name}

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-base font-bold">
              Our Services
            </h3>

            <ul className="mt-6 space-y-4">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-base font-bold">
              Get in Touch
            </h3>

            <div className="mt-6 space-y-5">

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    support@fixmate.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Contact information coming soon
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    Online Repair Service Platform
                  </p>
                </div>
              </div>

            </div>

            {/* Support Links */}
            <div className="mt-7 border-t border-white/10 pt-5">
              <h4 className="text-sm font-semibold">
                Support
              </h4>

              <ul className="mt-4 space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">

          <p className="text-xs text-slate-500">
            Copyright 2026 FixMate. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Built with care for a better repair experience.
          </p>

        </div>
      </div>
    </footer>
  );
}
