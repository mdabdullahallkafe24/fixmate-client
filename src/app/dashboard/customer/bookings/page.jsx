
"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Loader2,
  MapPin,
  Search,
  Wrench,
  XCircle,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Banknote,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const statusStyles = {
  requested: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  "in-progress": "bg-purple-50 text-purple-700 border-purple-200",
  "awaiting-payment": "bg-orange-50 text-orange-700 border-orange-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

const statusMessages = {
  requested: {
    title: "Your repair request has been submitted.",
    description:
      "Please wait while a technician reviews and responds to your request.",
  },
  accepted: {
    title: "Your repair request has been accepted!",
    description:
      "The technician has accepted your request. Your repair will be started soon.",
  },
  "in-progress": {
    title: "Your device is being repaired!",
    description:
      "The technician is currently working on your repair. Please wait for the completion update.",
  },
  "awaiting-payment": {
    title: "Your repair is ready for payment!",
    description:
      "The technician has finished the repair and submitted the final amount. Please review the amount and complete your payment.",
  },
  completed: {
    title: "Your repair has been completed successfully!",
    description:
      "The technician has confirmed the completion of your repair.",
  },
  rejected: {
    title: "Your repair request was rejected.",
    description:
      "Unfortunately, the technician could not accept this request. You can explore other available services.",
  },
  cancelled: {
    title: "This booking has been cancelled.",
    description: "This repair booking is no longer active.",
  },
};

function formatDate(date) {
  if (!date) return "Not specified";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return null;

  return parsedDate.toLocaleString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatus(status) {
  if (!status) return "Requested";

  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPrice(price) {
  if (price === null || price === undefined || price === "") {
    return "Not specified";
  }

  return `৳${Number(price).toLocaleString("en-BD")}`;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  // Prevent duplicate verification during React Strict Mode
  const verificationStarted = useRef(false);

  // Fetch customer bookings
  const fetchBookings = useCallback(async () => {
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

      if (response.status === 401) {
        setError("Please sign in to view your bookings.");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load your bookings.");
      }

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();

    const handleFocus = () => {
      fetchBookings();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchBookings]);

  // Verify Stripe payment after returning from Checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentResult = params.get("payment");
    const sessionId = params.get("session_id");

    if (paymentResult === "success") {
      if (!sessionId) {
        setPaymentError(
          "Payment session ID was not found. Please refresh your bookings or contact support."
        );
        fetchBookings();
        return;
      }

      if (verificationStarted.current) return;

      verificationStarted.current = true;

      const verifyPayment = async () => {
        try {
          setPaymentError("");
          setPaymentMessage(
            "Verifying your payment securely. Please wait..."
          );

          const response = await fetch(
            `${API_URL}/api/payments/verify-checkout-session`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sessionId }),
            }
          );

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(
              data.message || "Payment verification failed."
            );
          }

          setPaymentMessage(
            "Payment verified successfully! Your booking payment status has been updated."
          );

          await fetchBookings();
        } catch (err) {
          setPaymentMessage("");
          setPaymentError(
            err.message ||
              "Unable to verify your payment. Please refresh and try again."
          );

          // Still reload bookings in case the webhook already updated them
          await fetchBookings();
        } finally {
          // Remove payment query parameters from the URL
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("payment");
          cleanUrl.searchParams.delete("session_id");

          window.history.replaceState(
            {},
            "",
            cleanUrl.pathname + cleanUrl.search + cleanUrl.hash
          );
        }
      };

      verifyPayment();
    } else if (paymentResult === "cancelled") {
      setPaymentMessage(
        "Payment was cancelled. You can try again whenever you are ready."
      );

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("payment");

      window.history.replaceState(
        {},
        "",
        cleanUrl.pathname + cleanUrl.search + cleanUrl.hash
      );

      fetchBookings();
    }
  }, [fetchBookings]);

  // Create Stripe Checkout Session
  const handlePayment = async (bookingId) => {
    try {
      setPayingId(bookingId);
      setPaymentError("");
      setPaymentMessage("");

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create payment session."
        );
      }

      if (!data.checkoutUrl) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setPaymentError(
        err.message || "Something went wrong while starting payment."
      );

      setPayingId(null);
    }
  };

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          href="/dashboard/customer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <section className="mt-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600">
              CUSTOMER DASHBOARD
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Track your repair requests, check booking status,
              and manage your repair journey.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            <Search size={17} />
            Browse Services
          </Link>
        </section>

        {/* Booking Statistics */}
        <section className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total Bookings",
              value: totalBookings,
              icon: ClipboardList,
              color: "bg-blue-50 text-blue-600",
            },
            {
              label: "Pending Requests",
              value: pendingBookings,
              icon: Clock3,
              color: "bg-amber-50 text-amber-600",
            },
            {
              label: "Completed Repairs",
              value: completedBookings,
              icon: CheckCircle2,
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map((item) => {
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

                <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
                  {loading || error ? "—" : item.value}
                </h2>
              </div>
            );
          })}
        </section>

        {/* Payment Return Message */}
        {paymentMessage && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
            <p>{paymentMessage}</p>
          </div>
        )}

        {paymentError && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{paymentError}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <Loader2
              size={38}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 font-medium text-slate-600">
              Loading your bookings...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <XCircle size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Unable to Load Bookings
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-600">
              {error}
            </p>

            <button
              onClick={fetchBookings}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No Bookings Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't booked any repair services yet.
              Explore our available services and find the right
              technician for your needs.
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

        {/* Booking List */}
        {!loading && !error && bookings.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Your Repair Requests
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                All your submitted repair booking requests.
              </p>
            </div>

            <div className="space-y-5">
              {bookings.map((booking) => {
                const currentStatus = booking.status || "requested";

                const statusMessage =
                  statusMessages[currentStatus] || statusMessages.requested;

                const completedAt = formatDateTime(booking.completedAt);

                const paymentStatus = (
                  booking.paymentStatus || "unpaid"
                ).toLowerCase();

                const isAwaitingPayment =
                  currentStatus === "awaiting-payment";

                const isCompleted = currentStatus === "completed";
                const isPaid = paymentStatus === "paid";

                const isPayable =
                  isAwaitingPayment &&
                  !isPaid &&
                  Number(booking.finalAmount) > 0;

                const isPaying = payingId === booking._id;

                const showPaymentSection =
                  isAwaitingPayment || isCompleted;

                return (
                  <article
                    key={booking._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="grid md:grid-cols-[220px_1fr]">

                      {/* Service Image */}
                      <div className="h-52 bg-slate-100 md:h-full">
                        {booking.serviceImage ? (
                          <img
                            src={booking.serviceImage}
                            alt={booking.serviceTitle || "Repair service"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full min-h-48 items-center justify-center text-slate-400">
                            <Wrench size={45} />
                          </div>
                        )}
                      </div>

                      {/* Booking Information */}
                      <div className="p-6 sm:p-7">

                        {/* Title and Status */}
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                              {booking.category || "Repair Service"}
                            </span>

                            <h3 className="mt-3 text-xl font-bold text-slate-900">
                              {booking.serviceTitle || "Repair Service"}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                              Booking ID:{" "}
                              <span className="break-all font-medium text-slate-700">
                                {booking._id}
                              </span>
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${
                              statusStyles[currentStatus] ||
                              statusStyles.requested
                            }`}
                          >
                            {formatStatus(currentStatus)}
                          </span>
                        </div>

                        {/* Booking Status Message */}
                        <div
                          className={`mt-5 rounded-xl border p-4 ${
                            isCompleted
                              ? "border-emerald-200 bg-emerald-50"
                              : isAwaitingPayment
                                ? "border-orange-200 bg-orange-50"
                                : currentStatus === "rejected"
                                  ? "border-red-200 bg-red-50"
                                  : currentStatus === "in-progress"
                                    ? "border-purple-200 bg-purple-50"
                                    : currentStatus === "accepted"
                                      ? "border-blue-200 bg-blue-50"
                                      : "border-amber-200 bg-amber-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {isCompleted ? (
                              <CheckCircle2
                                size={21}
                                className="mt-0.5 shrink-0 text-emerald-600"
                              />
                            ) : isAwaitingPayment ? (
                              <Banknote
                                size={21}
                                className="mt-0.5 shrink-0 text-orange-600"
                              />
                            ) : currentStatus === "rejected" ? (
                              <XCircle
                                size={21}
                                className="mt-0.5 shrink-0 text-red-600"
                              />
                            ) : currentStatus === "in-progress" ? (
                              <Wrench
                                size={21}
                                className="mt-0.5 shrink-0 text-purple-600"
                              />
                            ) : currentStatus === "accepted" ? (
                              <CheckCircle2
                                size={21}
                                className="mt-0.5 shrink-0 text-blue-600"
                              />
                            ) : (
                              <Clock3
                                size={21}
                                className="mt-0.5 shrink-0 text-blue-600"
                              />
                            )}

                            <div>
                              <p className="text-sm font-bold text-slate-800">
                                {statusMessage.title}
                              </p>

                              <p className="mt-1 text-sm leading-6 text-slate-600">
                                {statusMessage.description}
                              </p>

                              {completedAt && isCompleted && (
                                <p className="mt-2 text-xs font-semibold text-emerald-700">
                                  Completed on: {completedAt}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="my-5 border-t border-slate-100" />

                        {/* Booking Details */}
                        <div className="grid gap-4 sm:grid-cols-2">

                          <div className="flex items-start gap-3">
                            <CalendarDays
                              size={19}
                              className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <div>
                              <p className="text-xs text-slate-500">
                                Preferred Date
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                {formatDate(booking.preferredDate)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Wrench
                              size={19}
                              className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <div>
                              <p className="text-xs text-slate-500">
                                Technician
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-800">
                                {booking.technicianName || "Not assigned"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin
                              size={19}
                              className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <div>
                              <p className="text-xs text-slate-500">
                                Service Address
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                {booking.address || "Not provided"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <ClipboardList
                              size={19}
                              className="mt-0.5 shrink-0 text-blue-600"
                            />

                            <div>
                              <p className="text-xs text-slate-500">
                                Payment Status
                              </p>

                              <p
                                className={`mt-1 text-sm font-semibold ${
                                  isPaid
                                    ? "text-emerald-700"
                                    : "text-amber-700"
                                }`}
                              >
                                {formatStatus(paymentStatus)}
                              </p>
                            </div>
                          </div>

                        </div>

                        {/* Starting Price and Service Link */}
                        <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                          <div>
                            <p className="text-xs text-slate-500">
                              Starting Price
                            </p>

                            <p className="mt-1 text-xl font-extrabold text-slate-900">
                              {formatPrice(booking.basePrice)}
                            </p>
                          </div>

                          <Link
                            href={`/services/${booking.serviceId}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            View Service
                            <ArrowRight size={17} />
                          </Link>
                        </div>

                        {/* Customer Payment Section */}
                        {showPaymentSection && (
                          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                            {/* Already Paid */}
                            {isPaid ? (
                              <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                                  <ShieldCheck size={24} />
                                </div>

                                <div>
                                  <p className="font-bold text-emerald-800">
                                    Payment Completed
                                  </p>

                                  <p className="mt-1 text-sm text-slate-600">
                                    Your payment for this repair has been received successfully.
                                  </p>
                                </div>
                              </div>
                            ) : isPayable ? (
                              <>
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                  <div>
                                    <p className="font-bold text-slate-900">
                                      Complete Your Payment
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                      The technician has submitted your final repair amount. Pay securely through Stripe.
                                    </p>
                                  </div>

                                  <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                    Payment Required
                                  </span>
                                </div>

                                {/* Final Amount */}
                                <div className="mt-4 flex flex-col justify-between gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center">
                                  <div>
                                    <p className="text-xs font-medium text-slate-500">
                                      Final Repair Amount
                                    </p>

                                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                      {formatPrice(booking.finalAmount)}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handlePayment(booking._id)}
                                    disabled={
                                      isPaying || payingId !== null
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isPaying ? (
                                      <>
                                        <Loader2
                                          size={18}
                                          className="animate-spin"
                                        />
                                        Redirecting...
                                      </>
                                    ) : (
                                      <>
                                        <CreditCard size={18} />
                                        Pay Now
                                      </>
                                    )}
                                  </button>
                                </div>

                                <p className="mt-3 text-xs text-slate-500">
                                  <ShieldCheck
                                    size={13}
                                    className="mr-1 inline"
                                  />
                                  Secure payment powered by Stripe.
                                </p>
                              </>
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-slate-200 p-3 text-slate-600">
                                  <Clock3 size={23} />
                                </div>

                                <div>
                                  <p className="font-bold text-slate-800">
                                    Payment Not Available
                                  </p>

                                  <p className="mt-1 text-sm text-slate-500">
                                    The final payment amount has not been submitted yet.
                                  </p>
                                </div>
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/customer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Customer Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}
