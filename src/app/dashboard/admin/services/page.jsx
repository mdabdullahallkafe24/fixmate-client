
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Package,
  Search,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function AdminServicesPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const user = session?.user;

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/services`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load services.");
      }

      setServices(Array.isArray(result.services) ? result.services : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!sessionLoading && user?.role === "admin") {
      fetchServices();
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [sessionLoading, user?.role]);

  const handleApproval = async (serviceId, approvalStatus) => {
    const action = approvalStatus === "approved" ? "approve" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this service?`
    );

    if (!confirmed) return;

    try {
      setActionId(serviceId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/services/${serviceId}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ approvalStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${action} service.`);
      }

      setServices((previousServices) =>
        previousServices.map((service) =>
          service._id === serviceId
            ? { ...service, approvalStatus }
            : service
        )
      );

      setSuccess(
        `Service ${
          approvalStatus === "approved" ? "approved" : "rejected"
        } successfully!`
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setActionId(null);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesFilter =
        activeFilter === "all" ||
        service.approvalStatus === activeFilter;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        service.title?.toLowerCase().includes(search) ||
        service.category?.toLowerCase().includes(search) ||
        service.technicianName?.toLowerCase().includes(search) ||
        service.technicianEmail?.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [services, activeFilter, searchTerm]);

  const counts = {
    all: services.length,
    pending: services.filter(
      (service) => service.approvalStatus === "pending"
    ).length,
    approved: services.filter(
      (service) => service.approvalStatus === "approved"
    ).length,
    rejected: services.filter(
      (service) => service.approvalStatus === "rejected"
    ).length,
  };

  const filters = [
    { id: "all", label: "All Services", count: counts.all },
    { id: "pending", label: "Pending", count: counts.pending },
    { id: "approved", label: "Approved", count: counts.approved },
    { id: "rejected", label: "Rejected", count: counts.rejected },
  ];

  const statusStyle = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-14 w-14 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            You must have an admin account to access this page.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Service Management
            </h1>

            <p className="mt-2 text-gray-500">
              Review, approve and manage technician service submissions.
            </p>
          </div>

          <button
            onClick={fetchServices}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Services" value={counts.all} icon={<Package size={22} />} color="blue" />
          <StatCard title="Pending Approval" value={counts.pending} icon={<Clock size={22} />} color="amber" />
          <StatCard title="Approved Services" value={counts.approved} icon={<CheckCircle size={22} />} color="green" />
          <StatCard title="Rejected Services" value={counts.rejected} icon={<XCircle size={22} />} color="red" />
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <CheckCircle size={20} />
            <p className="text-sm">{success}</p>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search service or technician..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-2xl bg-white">
            <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-14 w-14 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800">
              No services found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              No services match your current filter or search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredServices.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-52 bg-gray-100">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title || "Service image"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <Package size={45} />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        {service.category}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-gray-900">
                        {service.title}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        statusStyle[service.approvalStatus] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {service.approvalStatus || "unknown"}
                    </span>
                  </div>

                  <p className="mb-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Base Price</p>
                      <p className="mt-1 font-bold text-gray-900">
                        ${service.basePrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="mt-1 font-semibold text-gray-800">
                        {service.estimatedDuration}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Service Mode</p>
                      <p className="mt-1 font-semibold text-gray-800">
                        {service.serviceMode}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Service Area</p>
                      <p className="mt-1 font-semibold text-gray-800">
                        {service.serviceArea}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-gray-100 p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                      Submitted By
                    </p>
                    <p className="font-semibold text-gray-900">
                      {service.technicianName || "Unknown technician"}
                    </p>
                    <p className="mt-1 break-all text-sm text-gray-500">
                      {service.technicianEmail}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => handleApproval(service._id, "approved")}
                      disabled={
                        actionId === service._id ||
                        service.approvalStatus === "approved"
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionId === service._id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                      {service.approvalStatus === "approved"
                        ? "Already Approved"
                        : "Approve Service"}
                    </button>

                    <button
                      onClick={() => handleApproval(service._id, "rejected")}
                      disabled={
                        actionId === service._id ||
                        service.approvalStatus === "rejected"
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionId === service._id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <XCircle size={18} />
                      )}
                      {service.approvalStatus === "rejected"
                        ? "Already Rejected"
                        : "Reject Service"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
