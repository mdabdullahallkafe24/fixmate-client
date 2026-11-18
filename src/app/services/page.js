
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  Tablet,
  Wrench,
} from "lucide-react";

const services = [
  {
    id: "1",
    name: "Smartphone Repair",
    category: "Smartphone",
    price: 500,
    duration: "1–2 hours",
    description:
      "Professional repair solutions for screen, battery, charging, and software issues.",
    icon: Smartphone,
  },
  {
    id: "2",
    name: "Laptop Repair",
    category: "Laptop",
    price: 800,
    duration: "2–4 hours",
    description:
      "Expert solutions for laptop hardware, keyboard, performance, and software problems.",
    icon: Laptop,
  },
  {
    id: "3",
    name: "Tablet Repair",
    category: "Tablet",
    price: 600,
    duration: "1–3 hours",
    description:
      "Reliable repair services for tablet display, battery, charging, and software issues.",
    icon: Tablet,
  },
  {
    id: "4",
    name: "TV & Monitor Repair",
    category: "TV & Monitor",
    price: 1000,
    duration: "2–5 hours",
    description:
      "Professional troubleshooting for display, power, and connectivity problems.",
    icon: Monitor,
  },
  {
    id: "5",
    name: "Refrigerator Repair",
    category: "Home Appliances",
    price: 1200,
    duration: "2–4 hours",
    description:
      "Dependable repair solutions for cooling problems and refrigerator maintenance.",
    icon: Refrigerator,
  },
  {
    id: "6",
    name: "Washing Machine Repair",
    category: "Home Appliances",
    price: 900,
    duration: "2–4 hours",
    description:
      "Professional troubleshooting for drainage, spinning, and water supply issues.",
    icon: Settings,
  },
];

const categories = [
  "All",
  "Smartphone",
  "Laptop",
  "Tablet",
  "TV & Monitor",
  "Home Appliances",
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  const filteredServices = useMemo(() => {
    let result = services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-to-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-to-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort]);

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
              Explore our repair services and connect with skilled
              technicians to get your devices working again.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        {/* Search and Filters */}
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
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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

        {/* Result Count */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredServices.length}
            </span>{" "}
            services
          </p>

          {(search || category !== "All" || sort !== "default") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Service Cards */}
        {filteredServices.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={27} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {service.name}
                  </h3>

                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={17} />
                    <span>{service.duration}</span>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Starting from
                        </p>

                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          ৳{service.price}
                        </p>
                      </div>

                      <Link
                        href={`/services/${service.id}`}
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
                      Final price depends on technician inspection.
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Search
              size={35}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term or change your category.
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
