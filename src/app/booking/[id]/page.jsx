
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id;

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  useEffect(() => {
    if (!serviceId) return;

    async function fetchService() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/services/${encodeURIComponent(serviceId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.service) {
          throw new Error(
            data.message || "Unable to load service information."
          );
        }

        setService(data.service);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [serviceId]);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.preferredDate ||
      !formData.problemDescription.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          serviceId,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          preferredDate: formData.preferredDate,
          problemDescription: formData.problemDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          router.push("/sign-in");
          return;
        }

        throw new Error(
          data.message || "Failed to submit booking request."
        );
      }

      setSuccess(data.booking);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date();
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-4 font-medium text-slate-600">
            Loading booking information...
          </p>
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Service Not Found
          </h1>

          <p className="mt-3 text-slate-600">
            {error || "This service is unavailable or may have been removed."}
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 size={36} className="text-green-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            Booking Request Submitted!
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Your repair booking request has been submitted successfully.
            The technician will review your request.
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
            <p className="text-sm text-slate-500">Service</p>
            <p className="mt-1 font-semibold text-slate-900">
              {success.serviceTitle}
            </p>

            <p className="mt-4 text-sm text-slate-500">Booking ID</p>
            <p className="mt-1 break-all text-sm font-semibold text-slate-900">
              {success._id}
            </p>

            <p className="mt-4 text-sm text-slate-500">Booking Status</p>
            <span className="mt-2 inline-flex rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold capitalize text-yellow-700">
              {success.status || "requested"}
            </span>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="mt-7 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
          >
            View My Bookings
          </Link>

          <Link
            href="/services"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Explore More Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Link
          href={`/services/${serviceId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Service Details
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Book a Repair Service
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Provide your contact information and repair details to
            submit a booking request.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Your Booking Information
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Fields marked with * are required.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                {error}
              </div>
            )}

            <div className="mt-7 space-y-6">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number *
                </label>

                <div className="relative">
                  <Phone
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    minLength={7}
                    maxLength={20}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Service Address *
                </label>

                <div className="relative">
                  <MapPin
                    size={19}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="preferredDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Preferred Service Date *
                </label>

                <div className="relative">
                  <CalendarDays
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    required
                    min={minimumDate}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="problemDescription"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Describe Your Problem *
                </label>

                <textarea
                  id="problemDescription"
                  name="problemDescription"
                  required
                  minLength={5}
                  rows={5}
                  value={formData.problemDescription}
                  onChange={handleChange}
                  placeholder="Describe your device problem and any relevant details..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm leading-6 text-blue-800">
                  Your booking request will be sent to the technician.
                  The final repair cost will be confirmed after
                  assessing your device.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  Confirm Booking Request
                  <CheckCircle2 size={19} />
                </>
              )}
            </button>
          </form>

          <aside className="h-fit overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {service.image && (
              <img
                src={service.image}
                alt={service.title}
                className="h-52 w-full object-cover"
              />
            )}

            <div className="p-6">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                {service.category}
              </span>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {service.title}
              </h2>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Starting Price
                </span>

                <span className="text-2xl font-bold text-slate-900">
                  ৳{Number(service.basePrice).toLocaleString("en-BD")}
                </span>
              </div>

              <div className="my-6 border-t border-slate-100" />

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Technician</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {service.technicianName || "Professional Technician"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Estimated Duration
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {service.estimatedDuration || "To be confirmed"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <Wrench size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Service Mode</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {service.serviceMode || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Service Area</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {service.serviceArea || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  The displayed price is the starting price.
                  Final repair charges may vary depending on
                  the device condition and required parts.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
