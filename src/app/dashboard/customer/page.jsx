
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CreditCard,
  Search,
  Clock3,
  CheckCircle2,
  Wrench,
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const quickActions = [
  {
    title: "Browse Services",
    description: "Find a trusted technician for your device.",
    icon: Search,
    href: "/services",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "My Bookings",
    description: "Track your repair requests and their status.",
    icon: ClipboardList,
    href: "/dashboard/customer/bookings",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "My Payments",
    description: "View your repair payment history.",
    icon: CreditCard,
    href: "/dashboard/customer/payments",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/bookings/my-bookings`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load your bookings.");
        }

        if (!isMounted) return;

        setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Something went wrong. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  const totalPayments = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce((total, booking) => {
      const amount = Number(booking.finalAmount);
      return total + (Number.isFinite(amount) ? amount : 0);
    }, 0);

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length.toString(),
      icon: CalendarDays,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Requests",
      value: pendingBookings.toString(),
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Completed Repairs",
      value: completedBookings.toString(),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Payments",
      value: `৳${totalPayments.toLocaleString("en-BD")}`,
      icon: CreditCard,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <section className="mb-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-600">
                CUSTOMER DASHBOARD
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Welcome to FixMate!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your repair bookings, track service progress, and keep
                everything organized in one place.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Find a Service
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Welcome Banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-200">
              <ShieldCheck size={15} />
              Trusted Repair Platform
            </div>

            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              Your devices deserve
              <br />
              the best care.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
              From smartphones to home appliances, find skilled technicians
              and get your repair journey started with confidence.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-blue-50"
            >
              Explore Services
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[35px] border-blue-500/10" />
          <div className="pointer-events-none absolute -bottom-28 right-28 h-64 w-64 rounded-full border-[35px] border-purple-500/10" />

          <div className="pointer-events-none absolute bottom-8 right-10 hidden h-36 w-36 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-blue-300 backdrop-blur-sm lg:flex">
            <Wrench size={76} strokeWidth={1.2} />
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Your Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick look at your repair activity.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">
                      {item.label}
                    </p>

                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3 className="mt-4 text-3xl font-extrabold text-slate-900">
                    {loading ? "..." : error ? "—" : item.value}
                  </h3>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Everything you need, just one click away.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}
                    >
                      <Icon size={23} />
                    </div>

                    <ArrowRight
                      size={19}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </div>

                  <h3 className="mt-5 font-bold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Empty Bookings */}
        {!loading && !error && bookings.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Bookings Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't booked any repair services yet. Explore our available
              services and find the right technician for your needs.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Services
              <ArrowRight size={17} />
            </Link>
          </section>
        )}

        {!loading && !error && bookings.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your Repair Bookings
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You have {bookings.length} repair booking
              {bookings.length !== 1 ? "s" : ""}. Track your requests and check
              their latest status.
            </p>

            <Link
              href="/dashboard/customer/bookings"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View My Bookings
              <ArrowRight size={17} />
            </Link>
          </section>
        )}

        {/* Support */}
        <div className="mt-7 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Headphones size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Need help with a repair?
              </p>
              <p className="text-xs text-slate-500">
                Our support team is here to help.
              </p>
            </div>
          </div>

          <a
            href="mailto:support@fixmate.com"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
