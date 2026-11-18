
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Wrench,
  XCircle,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const getStatusStyle = (status) => {
  switch (status) {
    case "accepted":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "in-progress":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "completed":
      return "bg-green-50 text-green-700 border-green-200";
    case "cancelled":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Not specified";
  }

  return `৳${Number(price).toLocaleString("en-BD")}`;
};

export default function RepairRequestsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/api/bookings/technician-requests`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load repair requests.");
      }

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while loading your repair requests."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusUpdate = async (bookingId, status) => {
    const action = status === "accepted" ? "accept" : "reject";

    try {
      setUpdatingId(bookingId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} this request.`);
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status }
            : booking
        )
      );

      setSuccessMessage(
        data.message || `Repair request ${action}ed successfully.`
      );
    } catch (err) {
      setError(err.message || "Could not update the repair request.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
              <Wrench size={17} />
              Technician Dashboard
            </div>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Repair Requests
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              View and manage repair requests from your customers.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRequests}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Requests
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {bookings.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Wrench size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Requests
                </p>
                <p className="mt-2 text-3xl font-bold text-amber-600">
                  {pendingCount}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
            <CheckCircle2 size={18} />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="mb-3 animate-spin text-blue-600" size={34} />
            <p className="text-sm font-medium text-slate-500">
              Loading repair requests...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center">
            <div className="mb-4 rounded-2xl bg-blue-50 p-5 text-blue-600">
              <Wrench size={36} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No Repair Requests Yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              You do not have any repair requests yet. New customer requests
              for your services will appear here.
            </p>
          </div>
        ) : (
          /* Request Cards */
          <div className="space-y-5">
            {bookings.map((booking) => {
              const isUpdating = updatingId === booking._id;
              const isPending = booking.status === "requested";

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row">
                    {/* Service Image */}
                    <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-44 lg:w-56">
                      {booking.serviceImage ? (
                        <img
                          src={booking.serviceImage}
                          alt={booking.serviceTitle || "Repair service"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                          <Wrench size={40} />
                        </div>
                      )}
                    </div>

                    {/* Main Details */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {(booking.status || "requested").replace("-", " ")}
                        </span>

                        {booking.category && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            {booking.category}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-slate-900">
                        {booking.serviceTitle || "Repair Service"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Booking ID: {booking._id}
                      </p>

                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={17}
                            className="shrink-0 text-blue-600"
                          />
                          <span>
                            Preferred date:{" "}
                            <strong className="font-semibold text-slate-800">
                              {formatDate(booking.preferredDate)}
                            </strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin
                            size={17}
                            className="shrink-0 text-blue-600"
                          />
                          <span className="break-words">
                            {booking.address || "Address not provided"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone
                            size={17}
                            className="shrink-0 text-blue-600"
                          />
                          <span>
                            {booking.customerPhone || "Phone not provided"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail
                            size={17}
                            className="shrink-0 text-blue-600"
                          />
                          <span className="break-all">
                            {booking.customerEmail || "Email not provided"}
                          </span>
                        </div>
                      </div>

                      {/* Customer and Price */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Customer
                          </p>
                          <p className="mt-1 font-semibold text-slate-800">
                            {booking.customerName || "Customer"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Base Price
                          </p>
                          <p className="mt-1 text-lg font-bold text-blue-700">
                            {formatPrice(booking.basePrice)}
                          </p>
                        </div>
                      </div>

                      {/* Problem Description */}
                      {booking.problemDescription && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Problem Description
                          </p>
                          <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                            {booking.problemDescription}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {isPending ? (
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(booking._id, "accepted")
                            }
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={17} />
                            )}
                            Accept Request
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(booking._id, "rejected")
                            }
                            disabled={isUpdating}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <XCircle size={17} />
                            )}
                            Reject Request
                          </button>
                        </div>
                      ) : (
                        <p className="mt-5 text-sm font-medium text-slate-500">
                          This request has already been processed.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
       </main>
    );
}