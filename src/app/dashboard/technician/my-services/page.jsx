
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Wrench,
  Clock,
  MapPin,
  Home,
  Store,
  RefreshCw,
  AlertCircle,
  PackageSearch,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyServicesPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/services/my-services`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load your services."
        );
      }

      setServices(result.services || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      setError("Please sign in to view your services.");
      setLoading(false);
      return;
    }

    if (session.user.role !== "technician") {
      setError("Only technicians can access this page.");
      setLoading(false);
      return;
    }

    fetchMyServices();
  }, [session, sessionLoading, fetchMyServices]);

  if (sessionLoading || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading your services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Technician Dashboard
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              My Services
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage and monitor the repair services you have added.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchMyServices}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add New Service
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-semibold">Unable to load services</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Summary */}
        {!error && (
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Total Services
                </p>
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Wrench size={21} />
                </div>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {services.length}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Pending Approval
                </p>
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Clock size={21} />
                </div>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {services.filter(
                  (service) => service.approvalStatus === "pending"
                ).length}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  Approved Services
                </p>
                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <PackageSearch size={21} />
                </div>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {services.filter(
                  (service) => service.approvalStatus === "approved"
                ).length}
              </h2>
            </div>
          </div>
        )}

        {/* Services */}
        {!error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Service Image */}
                <div className="relative h-52 w-full bg-slate-100">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title || "Service image"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <Wrench size={42} />
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                      statusStyles[service.approvalStatus] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {service.approvalStatus || "Unknown"}
                  </span>
                </div>

                {/* Service Information */}
                <div className="p-5">
                  <div className="mb-3">
                    <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {service.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="my-5 border-t border-slate-100" />

                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Base Price</span>
                      <span className="text-lg font-bold text-blue-600">
                        ${Number(service.basePrice || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>
                        {service.estimatedDuration || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {service.serviceMode === "Home Visit" ? (
                        <Home size={16} className="text-slate-400" />
                      ) : (
                        <Store size={16} className="text-slate-400" />
                      )}
                      <span>
                        {service.serviceMode || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{service.serviceArea || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                    <span className="text-sm font-medium text-slate-600">
                      Availability
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {service.approvalStatus === "pending" && (
                    <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                      Your service is waiting for admin approval. It will
                      become visible to customers after approval.
                    </p>
                  )}

                  {service.approvalStatus === "rejected" && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-700">
                      This service was rejected by the admin. Please contact
                      the admin for more information.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Wrench size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              You haven&apos;t added any services yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add your first repair service so customers can discover your
              expertise after admin approval.
            </p>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Your First Service
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
