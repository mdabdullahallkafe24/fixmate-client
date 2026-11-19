
"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowRight,
  Clock3,
  Laptop,
  Refrigerator,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Tv,
  WashingMachine,
  Wrench,
  Loader2,
  MapPin,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  X,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const categories = [
  "All",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const categoryIcons = {
  Smartphone: Smartphone,
  "Laptop & PC": Laptop,
  AC: Settings,
  Refrigerator: Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Wrench,
};

// Services content
function ServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [services, setServices] = useState([]);
  const [serviceModes, setServiceModes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Read filters from URL
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const serviceMode = searchParams.get("serviceMode") || "All";
  const sort = searchParams.get("sort") || "newest";
  const maxPrice = searchParams.get("maxPrice") || "";

  const queryString = searchParams.toString();

  // Update URL query parameters
  const updateQuery = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const query = params.toString();

      router.replace(
        query ? `${pathname}?${query}` : pathname,
        { scroll: false }
      );
    },
    [pathname, router, searchParams]
  );

  // Fetch services
  useEffect(() => {
    let isActive = true;

    const fetchServices = async () => {
      try {
        if (!isActive) return;

        setLoading(true);
        setError("");

        const endpoint = queryString
          ? `${API_URL}/api/services?${queryString}`
          : `${API_URL}/api/services`;

        const response = await fetch(endpoint, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load services."
          );
        }

        // Ignore outdated requests
        if (!isActive) return;

        setServices(
          Array.isArray(result.services)
            ? result.services
            : []
        );

        setServiceModes(
          Array.isArray(result.serviceModes)
            ? result.serviceModes
            : []
        );
      } catch (err) {
        // Ignore errors from an inactive effect
        if (!isActive) return;

        console.error("Fetch services error:", err);

        setError(
          err.message || "Something went wrong while loading services."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    // Cleanup: ignore the previous request instead of aborting it
    return () => {
      isActive = false;
    };
  }, [queryString, refreshKey]);

  // Clear all filters
  const resetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    serviceMode !== "All" ||
    sort !== "newest" ||
    maxPrice !== "";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <section className="bg-slate-950 px-6 py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
              <Wrench size={16} />
              Professional Repair Services
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Find the Right
              <span className="block text-blue-400">
                Repair Service
              </span>
            </h1>

            <p className="mt-5 text-base leading-8 text-slate-300">
              Explore our approved repair services and connect with
              skilled technicians to get your devices working again.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Available Services
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Find the repair solution you need.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal size={17} />
            <span>Find services that fit your needs</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  updateQuery("q", event.target.value)
                }
                placeholder="Search services, technician or location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Maximum Price */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                ৳
              </span>

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) =>
                  updateQuery("maxPrice", event.target.value)
                }
                placeholder="Maximum Price"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Sorting */}
            <select
              value={sort}
              onChange={(event) =>
                updateQuery("sort", event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="newest">Newest First</option>
              <option value="low-to-high">
                Price: Low to High
              </option>
              <option value="high-to-low">
                Price: High to Low
              </option>
            </select>

            {/* Service Mode */}
            <select
              value={serviceMode}
              onChange={(event) =>
                updateQuery("serviceMode", event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:col-span-2 lg:col-span-2"
            >
              <option value="All">All Service Modes</option>

              {serviceModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                Filters:
              </span>

              {category !== "All" && (
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                  {category}
                </span>
              )}

              {serviceMode !== "All" && (
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                  {serviceMode}
                </span>
              )}

              {maxPrice !== "" && (
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                  Max ৳{maxPrice}
                </span>
              )}

              {search.trim() !== "" && (
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                  Search: {search}
                </span>
              )}

              {sort !== "newest" && (
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
                  {sort === "low-to-high"
                    ? "Price: Low to High"
                    : "Price: High to Low"}
                </span>
              )}

              {!hasActiveFilters && <span>All services</span>}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                <X size={15} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-7">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Browse by Category
          </p>

          <div className="flex flex-wrap gap-2">
            {categories.map((item) => {
              const isActive = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    updateQuery("category", item)
                  }
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Count and Refresh */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {services.length}
            </span>{" "}
            services
          </p>

          <button
            type="button"
            onClick={() =>
              setRefreshKey((previous) => previous + 1)
            }
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading available services...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

            <h3 className="mt-4 text-xl font-bold text-red-700">
              Unable to Load Services
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setRefreshKey((previous) => previous + 1)
              }
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && services.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon =
                categoryIcons[service.category] || Wrench;

              const imageUrl = service.image || service.imageUrl;

              return (
                <article
                  key={service._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  {/* Service Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={service.title || "Repair service"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-blue-500">
                        <Icon size={55} />
                      </div>
                    )}

                    <span className="absolute right-3 top-3 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                      Available
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon size={25} />
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                      {service.title}
                    </h3>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={17} />
                      <span>
                        {service.estimatedDuration ||
                          "Duration not specified"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <ShieldCheck
                        size={17}
                        className="text-green-600"
                      />
                      <span>
                        {service.technicianName ||
                          "Verified Technician"}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={17} />
                      <span>
                        {service.serviceArea ||
                          "Location not specified"}
                      </span>
                    </div>

                    {service.serviceMode && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <Settings size={17} />
                        <span>{service.serviceMode}</span>
                      </div>
                    )}

                    {/* Price and Details */}
                    <div className="mt-auto border-t border-slate-100 pt-5">
                      <div className="mt-5 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Starting from
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            ৳
                            {Number(
                              service.basePrice || 0
                            ).toLocaleString("en-BD")}
                          </p>
                        </div>

                        <Link
                          href={`/services/${service._id}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </Link>
                      </div>

                      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                        <ShieldCheck
                          size={15}
                          className="mt-0.5 shrink-0 text-green-600"
                        />
                        Service provided by an admin-approved technician.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Search
              size={35}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No approved services match your current search and filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

// Main page
export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
