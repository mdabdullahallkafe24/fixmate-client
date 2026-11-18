
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Clock3,
  CheckCircle2,
  ClipboardList,
  PlusCircle,
  ArrowRight,
  Headphones,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const quickActions = [
  {
    title: "Add New Service",
    description: "Create a new repair service and make it available to customers.",
    icon: PlusCircle,
    href: "/dashboard/technician/add-service",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "My Services",
    description: "Manage, update, and monitor your listed repair services.",
    icon: Wrench,
    href: "/dashboard/technician/my-services",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Repair Requests",
    description: "Review customer requests and manage your repair jobs.",
    icon: ClipboardList,
    href: "/dashboard/technician/requests",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export default function TechnicianDashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [servicesResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_URL}/api/services/my-services`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/bookings/technician-requests`, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        const [servicesData, bookingsData] = await Promise.all([
          servicesResponse.json(),
          bookingsResponse.json(),
        ]);

        if (!servicesResponse.ok) {
          throw new Error(
            servicesData.message || "Failed to load your services."
          );
        }

        if (!bookingsResponse.ok) {
          throw new Error(
            bookingsData.message || "Failed to load repair requests."
          );
        }

        if (!isMounted) return;

        setServices(
          Array.isArray(servicesData.services) ? servicesData.services : []
        );

        setBookings(
          Array.isArray(bookingsData.bookings) ? bookingsData.bookings : []
        );
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

  const stats = [
    {
      label: "Total Services",
      value: loading ? "..." : services.length.toString(),
      icon: Wrench,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Requests",
      value: loading
        ? "..."
        : bookings
            .filter((booking) => booking.status === "requested")
            .length.toString(),
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Accepted Requests",
      value: loading
        ? "..."
        : bookings
            .filter((booking) => booking.status === "accepted")
            .length.toString(),
      icon: ClipboardList,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Completed Repairs",
      value: loading
        ? "..."
        : bookings
            .filter((booking) => booking.status === "completed")
            .length.toString(),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
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
                TECHNICIAN DASHBOARD
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Welcome to FixMate!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your repair services, handle customer requests, and
                keep track of your repair activities from one place.
              </p>
            </div>

            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Add New Service
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* Welcome Banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-200">
              <ShieldCheck size={15} />
              Trusted FixMate Technician
            </div>

            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              Your skills make
              <br />
              every repair matter.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
              Connect with customers, showcase your expertise, and deliver
              reliable repair services. Build trust with every successful job.
            </p>

            <Link
              href="/dashboard/technician/my-services"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-blue-50"
            >
              Manage Services
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
              A quick look at your service and repair activities.
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
              Manage your technician activities easily.
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

        {/* Empty Requests */}
        {!loading && !error && bookings.length === 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Repair Requests Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't received any customer repair requests yet. Add your
              repair services so customers can discover and book them.
            </p>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Your First Service
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
              You Have Repair Requests!
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You have received {bookings.length} customer repair request
              {bookings.length !== 1 ? "s" : ""}. Review the details and manage
              your repair jobs.
            </p>

            <Link
              href="/dashboard/technician/requests"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Repair Requests
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
                Need help with your services?
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
