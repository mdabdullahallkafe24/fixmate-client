
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Wrench,
  ClipboardList,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const initialStats = {
  totalUsers: 0,
  totalTechnicians: 0,
  pendingServices: 0,
  totalBookings: 0,
};

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-blue-50 p-4 text-blue-600">
          <Icon size={27} />
        </div>
      </div>
    </div>
  );
}

const adminLinks = [
  {
    title: "User Management",
    description: "View users and manage their account roles.",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Service Management",
    description: "Review, approve and reject technician services.",
    href: "/dashboard/admin/services",
    icon: Wrench,
  },
  {
    title: "Booking Management",
    description: "View and monitor all customer bookings.",
    href: "/dashboard/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Transaction Management",
    description: "View customer payments and monitor all platform transactions.",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
];

export default function AdminDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const user = session?.user;

  const fetchDashboardData = async () => {
    try {
      setError("");
      setRefreshing(true);

      const [usersRes, servicesRes, bookingsRes] =
        await Promise.all([
          fetch(`${API_URL}/api/admin/users`, {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/admin/services`, {
            credentials: "include",
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/admin/bookings`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

      const [usersData, servicesData, bookingsData] =
        await Promise.all([
          usersRes.json(),
          servicesRes.json(),
          bookingsRes.json(),
        ]);

      if (!usersRes.ok || !servicesRes.ok || !bookingsRes.ok) {
        throw new Error(
          usersData.message ||
            servicesData.message ||
            bookingsData.message ||
            "Failed to load dashboard data."
        );
      }

      const users = usersData.users || [];
      const services = servicesData.services || [];
      const bookings = bookingsData.bookings || [];

      setStats({
        totalUsers: users.length,

        totalTechnicians: users.filter(
          (item) => item.role === "technician"
        ).length,

        pendingServices: services.filter(
          (item) => item.approvalStatus === "pending"
        ).length,

        totalBookings: bookings.length,
      });
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (user?.role === "admin") {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isPending, user?.role]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <ShieldCheck
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Only administrators can access this dashboard.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-600" size={27} />

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Admin Dashboard
              </h1>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Welcome back, {user.name || "Admin"}! Manage your FixMate platform.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Data
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} className="shrink-0" />

            <div>
              <p className="font-semibold">
                Unable to load dashboard data
              </p>

              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <section>
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Platform Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              description="Registered platform users"
              icon={Users}
            />

            <StatCard
              title="Total Technicians"
              value={stats.totalTechnicians}
              description="Registered technicians"
              icon={Wrench}
            />

            <StatCard
              title="Pending Services"
              value={stats.pendingServices}
              description="Services waiting for approval"
              icon={ClipboardList}
            />

            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              description="All customer bookings"
              icon={CalendarCheck}
            />
          </div>
        </section>

        {/* Management Pages */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage different sections of your FixMate platform.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {adminLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={25} />
                    </div>

                    <ArrowRight
                      size={20}
                      className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    Manage Now
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck
              className="shrink-0 text-blue-600"
              size={23}
            />

            <div>
              <h3 className="font-semibold text-slate-900">
                FixMate Administration
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Monitor users, services, bookings and transactions from one place.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
