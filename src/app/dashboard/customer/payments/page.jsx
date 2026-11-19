
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Receipt,
  CalendarDays,
  Wallet,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function formatCurrency(amount, currency = "bdt") {
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: String(currency || "bdt").toUpperCase(),
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  } catch {
    return `${String(currency).toUpperCase()} ${Number(amount || 0)}`;
  }
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatus(status) {
  switch (String(status || "").toLowerCase()) {
    case "succeeded":
      return {
        label: "Paid",
        icon: CheckCircle2,
        style: "bg-green-50 text-green-700 border-green-200",
      };

    case "pending":
      return {
        label: "Pending",
        icon: Clock3,
        style: "bg-amber-50 text-amber-700 border-amber-200",
      };

    case "failed":
      return {
        label: "Failed",
        icon: XCircle,
        style: "bg-red-50 text-red-700 border-red-200",
      };

    default:
      return {
        label: status || "Unknown",
        icon: AlertCircle,
        style: "bg-slate-100 text-slate-600 border-slate-200",
      };
  }
}

export default function CustomerPaymentsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const user = session?.user;

  const fetchPayments = useCallback(async () => {
    try {
      setError("");
      setRefreshing(true);

      const response = await fetch(
        `${API_URL}/api/payments/my-payments`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load payment history."
        );
      }

      setPayments(
        Array.isArray(data.payments) ? data.payments : []
      );
    } catch (err) {
      console.error("Payment history error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (user?.role === "customer") {
      fetchPayments();
    } else {
      setLoading(false);
    }
  }, [isPending, user?.role, fetchPayments]);

  const successfulPayments = useMemo(
    () =>
      payments.filter(
        (payment) =>
          String(payment.status).toLowerCase() === "succeeded"
      ),
    [payments]
  );

  const totalPaid = useMemo(
    () =>
      successfulPayments.reduce(
        (total, payment) => total + (Number(payment.amount) || 0),
        0
      ),
    [successfulPayments]
  );

  const filteredPayments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !search ||
        [
          payment.transactionId,
          payment.paymentIntentId,
          payment.bookingId?.toString(),
          payment.stripeSessionId,
          payment.technicianEmail,
        ].some((value) =>
          String(value || "").toLowerCase().includes(search)
        );

      const matchesStatus =
        statusFilter === "all" ||
        String(payment.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm text-slate-500">
            Loading payment history...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "customer") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle size={42} className="mx-auto text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            This page is only available to customers.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
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

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/dashboard/customer"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <CreditCard size={27} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  My Payments
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  View and track your repair payment history.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchPayments}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle size={19} />
              Unable to load payments
            </div>
            <p className="mt-2">{error}</p>
            <button
              onClick={fetchPayments}
              className="mt-3 font-semibold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Overview */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Payment Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Payments
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-slate-900">
                    {payments.length}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    All payment records
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Receipt size={25} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Amount Paid
                  </p>
                  <h2 className="mt-3 break-words text-3xl font-bold text-slate-900">
                    {formatCurrency(totalPaid)}
                  </h2>
                  <p className="mt-2 text-xs text-slate-500">
                    Successful payments only
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <Wallet size={25} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment History */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Payment History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your previous repair payments and transaction details.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transaction or booking ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 sm:w-44"
            >
              <option value="all">All Status</option>
              <option value="succeeded">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="mb-3 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredPayments.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {payments.length}
            </span>{" "}
            payments
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {filteredPayments.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CreditCard size={27} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  {payments.length === 0
                    ? "No payments yet"
                    : "No matching payments"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  {payments.length === 0
                    ? "Your successful repair payments will appear here."
                    : "Try changing your search keyword or status filter."}
                </p>

                {payments.length === 0 && (
                  <Link
                    href="/services"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Browse Services
                  </Link>
                )}

                {payments.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="mt-4 text-sm font-semibold text-blue-600"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Transaction ID
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Booking ID
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Technician
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Amount
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Payment Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((payment, index) => {
                      const status = getStatus(payment.status);
                      const StatusIcon = status.icon;

                      return (
                        <tr
                          key={payment._id || payment.stripeSessionId || index}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-5">
                            <p
                              className="max-w-[180px] truncate text-sm font-medium text-slate-700"
                              title={payment.transactionId || payment.paymentIntentId || ""}
                            >
                              {payment.transactionId ||
                                payment.paymentIntentId ||
                                "N/A"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p
                              className="max-w-[150px] truncate text-sm text-slate-700"
                              title={payment.bookingId?.toString()}
                            >
                              {payment.bookingId?.toString() || "N/A"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="max-w-[180px] truncate text-sm text-slate-600">
                              {payment.technicianEmail || "N/A"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="whitespace-nowrap text-sm font-bold text-slate-900">
                              {formatCurrency(
                                payment.amount,
                                payment.currency
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${status.style}`}
                            >
                              <StatusIcon size={14} />
                              {status.label}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-600">
                              <CalendarDays
                                size={15}
                                className="text-slate-400"
                              />
                              {formatDate(payment.paidAt || payment.createdAt)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
