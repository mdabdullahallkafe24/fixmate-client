
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Laptop,
  Monitor,
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
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  Smartphone,
  "Laptop & PC": Laptop,
  AC: Settings,
  Refrigerator,
  TV: Tv,
  "Washing Machine": WashingMachine,
  Electrical: Wrench,
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  // Fetch approved and available services from backend
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/services`, {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to load services."
        );
      }

      setServices(
        Array.isArray(result.services) ? result.services : []
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Search, category filter and sorting
  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        service.title?.toLowerCase().includes(searchText) ||
        service.description?.toLowerCase().includes(searchText) ||
        service.category?.toLowerCase().includes(searchText) ||
        service.technicianName?.toLowerCase().includes(searchText) ||
        service.serviceArea?.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-to-high") {
      result.sort(
        (a, b) => Number(a.basePrice) - Number(b.basePrice)
      );
    } else if (sort === "high-to-low") {
      result.sort(
        (a, b) => Number(b.basePrice) - Number(a.basePrice)
      );
    }

    return result;
  }, [services, search, category, sort]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("default");
  };

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
        {/* Search and Sorting */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Available Services
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Find the repair solution you need.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              />
            </div>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="default">Default Sorting</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                category === item
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Result Count and Refresh */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredServices.length}
            </span>{" "}
            services
          </p>

          <div className="flex items-center gap-4">
            {(search || category !== "All" || sort !== "default") && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Reset Filters
              </button>
            )}

            <button
              type="button"
              onClick={fetchServices}
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

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={fetchServices}
              className="mt-5 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const Icon =
                categoryIcons[service.category] || Wrench;

              return (
                <article
                  key={service._id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  {/* Service Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    {service.image ? (
                      <img
                        src={service.image}
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

                  <div className="flex flex-1 flex-col p-6">
                    {/* Category */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                        <Icon size={25} />
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                        {service.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>

                    {/* Duration */}
                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 size={17} />
                      <span>{service.estimatedDuration}</span>
                    </div>

                    {/* Technician */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <ShieldCheck size={17} className="text-green-600" />
                      <span>
                        {service.technicianName || "Verified Technician"}
                      </span>
                    </div>

                    {/* Service Area */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={17} />
                      <span>{service.serviceArea}</span>
                    </div>

                    {/* Price and Details */}
                    <div className="mt-auto border-t border-slate-100 pt-5">
                      <div className="mt-5 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Starting from
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            ৳{service.basePrice}
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
        {!loading && !error && filteredServices.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Search
              size={35}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {services.length === 0
                ? "No approved services are available right now."
                : "Try another search term or change your category."}
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
