
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Search,
  RefreshCw,
  Wallet,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  Receipt,
  CalendarDays,
  User,
  Wrench,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function formatCurrency(amount, currency = "bdt") {
  const currencyCode = String(currency || "bdt").toUpperCase();

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
  } catch {
    return `${currencyCode} ${Number(amount || 0).toLocaleString()}`;
  }
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status) {
  switch (String(status || "").toLowerCase()) {
    case "succeeded":
      return {
        label: "Paid",
        className: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
      };

    case "pending":
      return {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock3,
      };

    case "failed":
      return {
        label: "Failed",
        className: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      };

    default:
      return {
        label: status || "Unknown",
        className: "bg-slate-100 text-slate-600 border-slate-200",
        icon: AlertCircle,
      };
  }
}

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </h2>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={25} />
        </div>
      </div>
    </div>
  );
}

export default function AdminTransactionsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const user = session?.user;

  const fetchTransactions = useCallback(async () => {
    try {
      setError("");
      setRefreshing(true);

      const response = await fetch(
        `${API_URL}/api/admin/transactions`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch transactions."
        );
      }

      setTransactions(
        Array.isArray(data.transactions) ? data.transactions : []
      );

      setSummary({
        totalRevenue: Number(data.summary?.totalRevenue) || 0,
        totalTransactions: Number(data.summary?.totalTransactions) || 0,
      });
    } catch (err) {
      console.error("Admin transactions fetch error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (user?.role === "admin") {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [isPending, user?.role, fetchTransactions]);

  const successfulTransactions = useMemo(
    () =>
      transactions.filter(
        (item) => String(item.status).toLowerCase() === "succeeded"
      ),
    [transactions]
  );

  const pendingTransactions = useMemo(
    () =>
      transactions.filter(
        (item) => String(item.status).toLowerCase() === "pending"
      ),
    [transactions]
  );

  const failedTransactions = useMemo(
    () =>
      transactions.filter(
        (item) => String(item.status).toLowerCase() === "failed"
      ),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return transactions.filter((item) => {
      const matchesSearch =
        !search ||
        [
          item.customerEmail,
          item.technicianEmail,
          item.transactionId,
          item.paymentIntentId,
          item.stripeSessionId,
          item.bookingId?.toString(),
        ].some((value) =>
          String(value || "").toLowerCase().includes(search)
        );

      const matchesStatus =
        statusFilter === "all" ||
        String(item.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-slate-500">
            Loading transactions...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Only administrators can access transactions.
          </p>

          <Link
            href="/dashboard/admin"
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
              href="/dashboard/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Admin Dashboard
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <CreditCard size={27} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Transactions
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor all customer payments on FixMate.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Transactions
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} className="shrink-0" />

            <div>
              <p className="font-semibold">
                Unable to load transactions
              </p>

              <p className="mt-1">{error}</p>

              <button
                onClick={fetchTransactions}
                className="mt-3 font-semibold underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <section>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Payment Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A summary of platform payment activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(summary.totalRevenue)}
              description="Successfully received payments"
              icon={Wallet}
            />

            <StatCard
              title="Successful Payments"
              value={successfulTransactions.length}
              description="Payments completed successfully"
              icon={CheckCircle2}
            />

            <StatCard
              title="Pending Payments"
              value={pendingTransactions.length}
              description="Payments awaiting confirmation"
              icon={Clock3}
            />

            <StatCard
              title="Failed Payments"
              value={failedTransactions.length}
              description="Payments that were unsuccessful"
              icon={XCircle}
            />
          </div>
        </section>

        {/* Transactions Table */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              All Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View and search customer payment records.
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
                placeholder="Search email, transaction ID or booking ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-48"
            >
              <option value="all">All Status</option>
              <option value="succeeded">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredTransactions.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {transactions.length}
              </span>{" "}
              transactions
            </p>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {filteredTransactions.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Receipt size={27} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-800">
                  {transactions.length === 0
                    ? "No transactions yet"
                    : "No matching transactions"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                  {transactions.length === 0
                    ? "Customer payment records will appear here after successful payments."
                    : "Try changing your search keyword or payment status filter."}
                </p>

                {transactions.length > 0 && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Booking ID
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Transaction ID
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
                    {filteredTransactions.map((transaction, index) => {
                      const status = getStatusStyle(transaction.status);
                      const StatusIcon = status.icon;

                      return (
                        <tr
                          key={
                            transaction._id ||
                            transaction.stripeSessionId ||
                            index
                          }
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <User size={19} />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {transaction.customerEmail || "Unknown customer"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  <Wrench
                                    size={12}
                                    className="mr-1 inline"
                                  />
                                  {transaction.technicianEmail || "Technician unavailable"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <p
                              className="max-w-[150px] truncate text-sm font-medium text-slate-700"
                              title={transaction.bookingId?.toString()}
                            >
                              {transaction.bookingId?.toString() || "N/A"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p
                              className="max-w-[180px] truncate text-sm font-medium text-slate-700"
                              title={
                                transaction.transactionId ||
                                transaction.paymentIntentId ||
                                ""
                              }
                            >
                              {transaction.transactionId ||
                                transaction.paymentIntentId ||
                                "N/A"}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <p className="whitespace-nowrap text-sm font-bold text-slate-900">
                              {formatCurrency(
                                transaction.amount,
                                transaction.currency
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
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
                              {formatDate(
                                transaction.paidAt ||
                                transaction.createdAt
                              )}
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

        {/* Footer */}
        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon />

            <div>
              <h3 className="font-semibold text-slate-900">
                Secure Transaction Management
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Payment records are retrieved from the FixMate payment database.
                Only administrators can access this information.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

function ShieldCheckIcon() {
  return (
    <div className="shrink-0 rounded-lg bg-white p-2 text-blue-600">
      <CreditCard size={22} />
    </div>
  );
}
