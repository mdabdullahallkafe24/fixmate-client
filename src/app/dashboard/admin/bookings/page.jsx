
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  RefreshCw,
  Search,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Wrench,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const FILTERS = [
  "all",
  "requested",
  "accepted",
  "rejected",
  "in-progress",
  "completed",
  "cancelled",
];

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(value) {
  if (value === null || value === undefined || value === "") return "—";

  const amount = Number(value);

  if (Number.isNaN(amount)) return "—";

  return `৳${amount.toLocaleString("en-BD")}`;
}

function getStatusStyle(status) {
  const styles = {
    requested: "bg-amber-100 text-amber-700",
    accepted: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    "in-progress": "bg-violet-100 text-violet-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-slate-200 text-slate-700",
  };

  return styles[status] || "bg-slate-100 text-slate-700";
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={23} />
        </div>
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchBookings = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load bookings.");
      }

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading && session?.user) {
      fetchBookings();
    }
  }, [sessionLoading, session, fetchBookings]);

  const stats = useMemo(() => ({
    total: bookings.length,
    requested: bookings.filter((b) => b.status === "requested").length,
    inProgress: bookings.filter((b) => b.status === "in-progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  }), [bookings]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesStatus =
        activeFilter === "all" || booking.status === activeFilter;

      const searchableText = [
        booking.customerName,
        booking.customerEmail,
        booking.customerPhone,
        booking.serviceTitle,
        booking.technicianName,
        booking.technicianEmail,
        booking.category,
        booking.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [bookings, activeFilter, search]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={30} />
      </div>
    );
  }

  if (!session?.user || session.user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto text-red-500" size={40} />
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            You do not have permission to access this page.
          </p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/dashboard/admin"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Admin Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Booking Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and monitor all customer repair bookings.
            </p>
          </div>

          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={stats.total}
            icon={ClipboardList}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Requested"
            value={stats.requested}
            icon={Clock3}
            color="bg-amber-100 text-amber-600"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Wrench}
            color="bg-violet-100 text-violet-600"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            color="bg-emerald-100 text-emerald-600"
          />
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Unable to load bookings</p>
              <p className="mt-1">{error}</p>
              <button
                onClick={() => fetchBookings(true)}
                className="mt-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                All Bookings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredBookings.length} booking(s) found
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, service, technician..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition sm:text-sm ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter === "all" ? "All Bookings" : filter.replace("-", " ")}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center">
              <RefreshCw className="animate-spin text-blue-600" size={28} />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-14 text-center">
              <ClipboardList
                size={42}
                className="mx-auto text-slate-300"
              />
              <h3 className="mt-4 font-semibold text-slate-800">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="px-4 py-3 font-semibold">Technician</th>
                    <th className="px-4 py-3 font-semibold">Booking Date</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Payment</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {booking.customerName || "Unknown customer"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {booking.customerEmail || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">
                          {booking.serviceTitle || "Unknown service"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.category || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-800">
                          {booking.technicianName || "Not assigned"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.technicianEmail || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={15} className="text-slate-400" />
                          {formatDate(booking.preferredDate)}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Created: {formatDate(booking.createdAt)}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">
                          {formatAmount(
                            booking.finalAmount ?? booking.basePrice
                          )}
                        </p>
                        {booking.finalAmount != null && (
                          <p className="text-xs text-slate-400">
                            Final amount
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            booking.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {booking.paymentStatus || "unpaid"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status?.replace("-", " ") || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          <XCircle size={13} className="mr-1 inline" />
          Admin booking management is read-only. Booking updates are handled
          by customers and technicians.
        </p>
      </div>
    </main>
  );
}
