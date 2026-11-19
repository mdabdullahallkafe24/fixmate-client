
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

// Fetch service details
async function getService(id) {
  try {
    const response = await fetch(
      `${API_URL}/api/services/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (response.status === 404 || response.status === 400) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch service details.");
    }

    const data = await response.json();

    return data.success ? data.service : null;
  } catch (error) {
    console.error("Service details fetch error:", error);
    throw error;
  }
}

// Loading UI
function ServiceDetailsLoading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
        <p className="mt-4 font-medium text-slate-600">
          Loading service details...
        </p>
      </div>
    </main>
  );
}

// Service details content
async function ServiceDetailsContent({ params }) {
  const { id } = await params;

  let service;

  try {
    service = await getService(id);
  } catch {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Unable to Load Service
          </h1>

          <p className="mt-3 text-slate-600">
            Something went wrong while loading this service.
            Please try again.
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

  if (!service) {
    notFound();
  }

  const serviceInformation = [
    {
      label: "Service Mode",
      value: service.serviceMode || "Not specified",
      icon: Wrench,
    },
    {
      label: "Service Area",
      value: service.serviceArea || "Not specified",
      icon: MapPin,
    },
    {
      label: "Technician",
      value: service.technicianName || "Professional Technician",
      icon: UserRound,
    },
  ];

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            {service.image && (
              <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
            )}

            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {service.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {service.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              {service.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Clock3 size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Estimated Duration
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    {service.estimatedDuration || "To be confirmed"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Service Quality
                  </p>

                  <p className="mt-1 font-bold text-slate-900">
                    Professional Support
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900">
                Service Information
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {serviceInformation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5"
                    >
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm text-slate-500">
                          {item.label}
                        </p>

                        <p className="mt-1 break-words font-semibold text-slate-900">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={22}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <div>
                  <h3 className="font-bold text-green-900">
                    Verified Service Listing
                  </h3>

                  <p className="mt-1 text-sm leading-7 text-green-800">
                    This service has been approved by the FixMate
                    administration and is currently available for
                    booking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Wrench size={23} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Starting from
                </p>

                <p className="text-3xl font-bold text-slate-900">
                  ৳{Number(service.basePrice).toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            <div className="my-6 border-t border-slate-100" />

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                How is the final price determined?
              </p>

              <p className="mt-2 text-sm leading-7 text-blue-800">
                This is the technician&apos;s starting price. The
                final repair cost may depend on the device condition,
                replacement parts, and required work.
              </p>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-600">
              You can submit a booking request to discuss your
              repair needs with the technician.
            </p>

            <Link
              href={`/booking/${service._id}`}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Book This Service
              <ArrowRight size={18} />
            </Link>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500">
              Sign in to request a repair service.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

// Page component
export default function ServiceDetailsPage({ params }) {
  return (
    <Suspense fallback={<ServiceDetailsLoading />}>
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
