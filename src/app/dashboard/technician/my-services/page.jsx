
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"];

const initialForm = {
  title: "",
  category: "Smartphone",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "Home Visit",
  serviceArea: "",
  image: "",
};

export default function MyServicesPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const user = session?.user;

  async function fetchServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/services/my-services`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load services.");
      }

      setServices(Array.isArray(data.services) ? data.services : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!sessionLoading && user) {
      fetchServices();
    }

    if (!sessionLoading && !user) {
      setLoading(false);
    }
  }, [sessionLoading, user]);

  function openEditModal(service) {
    setEditingService(service);

    setForm({
      title: service.title || "",
      category: service.category || "Smartphone",
      description: service.description || "",
      basePrice: String(service.basePrice ?? ""),
      estimatedDuration: service.estimatedDuration || "",
      serviceMode: service.serviceMode || "Home Visit",
      serviceArea: service.serviceArea || "",
      image: service.image || "",
    });

    setMessage("");
    setError("");
  }

  function closeEditModal() {
    if (saving || uploading) return;

    setEditingService(null);
    setForm(initialForm);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      setError("ImgBB API key is missing from .env.local.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");

      const imageData = new FormData();
      imageData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Image upload failed. Please try another image.");
      }

      setForm((previous) => ({
        ...previous,
        image: result.data.url,
      }));

      setMessage("Image uploaded successfully!");
    } catch (err) {
      setError(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleUpdateService(event) {
    event.preventDefault();

    if (!editingService) return;

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.basePrice ||
      !form.estimatedDuration.trim() ||
      !form.serviceArea.trim() ||
      !form.image.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(form.basePrice) <= 0) {
      setError("Base price must be greater than zero.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/services/${editingService._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            basePrice: Number(form.basePrice),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update service.");
      }

      setServices((previous) =>
        previous.map((service) =>
          service._id === editingService._id
            ? {
                ...service,
                ...form,
                basePrice: Number(form.basePrice),
                approvalStatus: "pending",
              }
            : service
        )
      );

      setEditingService(null);
      setForm(initialForm);
      setMessage(
        "Service updated successfully! It is now waiting for admin approval."
      );
    } catch (err) {
      setError(err.message || "Failed to update service.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteService(service) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(service._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/services/${service._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not delete service.");
      }

      setServices((previous) =>
        previous.filter((item) => item._id !== service._id)
      );

      setMessage("Service deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete service.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAvailability(service) {
    try {
      setUpdatingId(service._id);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/services/${service._id}/availability`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAvailable: !service.isAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not update availability."
        );
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: !service.isAvailable }
            : item
        )
      );

      setMessage(
        `Service is now ${
          !service.isAvailable ? "Available" : "Unavailable"
        }.`
      );
    } catch (err) {
      setError(err.message || "Failed to update availability.");
    } finally {
      setUpdatingId(null);
    }
  }

  const pendingCount = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const availableCount = services.filter(
    (service) => service.isAvailable
  ).length;

  if (sessionLoading || loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Loading your services...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold">Please sign in</h1>
        <p className="text-gray-600">
          You need to sign in to manage your services.
        </p>
        <Link
          href="/sign-in"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Sign In
        </Link>
      </main>
    );
  }

  if (user.role !== "technician") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-lg font-semibold text-red-600">
          Access denied. Technician account required.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Services
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your repair services, pricing and availability.
            </p>
          </div>

          <Link
            href="/dashboard/technician/add-service"
            className="rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            + Add New Service
          </Link>
        </div>

        {/* Notifications */}
        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Services" value={services.length} />
          <StatCard title="Pending Approval" value={pendingCount} />
          <StatCard title="Approved Services" value={approvedCount} />
          <StatCard title="Available Services" value={availableCount} />
        </div>

        {/* Service List */}
        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-gray-800">
              No Services Added Yet
            </h2>
            <p className="mt-2 text-gray-500">
              Start by adding your first repair service.
            </p>
            <Link
              href="/dashboard/technician/add-service"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Add Your First Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-52 bg-gray-100">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {service.category}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.approvalStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : service.approvalStatus === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {service.approvalStatus || "pending"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {service.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 min-h-12 text-sm text-gray-600">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm text-gray-600">
                    <p>
                      <strong className="text-gray-800">Price:</strong>{" "}
                      ${service.basePrice}
                    </p>
                    <p>
                      <strong className="text-gray-800">Duration:</strong>{" "}
                      {service.estimatedDuration}
                    </p>
                    <p>
                      <strong className="text-gray-800">Service Mode:</strong>{" "}
                      {service.serviceMode}
                    </p>
                    <p>
                      <strong className="text-gray-800">Area:</strong>{" "}
                      {service.serviceArea}
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Availability
                      </p>
                      <p
                        className={`text-xs ${
                          service.isAvailable
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {service.isAvailable ? "Available" : "Unavailable"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAvailability(service)}
                      disabled={updatingId === service._id}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                        service.isAvailable
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {updatingId === service._id
                        ? "Updating..."
                        : service.isAvailable
                        ? "Make Unavailable"
                        : "Make Available"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(service)}
                      className="rounded-lg border border-blue-600 px-4 py-2.5 font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteService(service)}
                      disabled={deletingId === service._id}
                      className="rounded-lg border border-red-600 px-4 py-2.5 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === service._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">
            <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit Service
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your service information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving || uploading}
                  className="rounded-lg px-3 py-2 text-xl text-gray-500 hover:bg-gray-100"
                  aria-label="Close edit form"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateService} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Service Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Base Price ($)
                    </label>
                    <input
                      name="basePrice"
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.basePrice}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Estimated Duration
                    </label>
                    <input
                      name="estimatedDuration"
                      value={form.estimatedDuration}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 hours"
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Service Area
                    </label>
                    <input
                      name="serviceArea"
                      value={form.serviceArea}
                      onChange={handleInputChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Service Mode
                  </label>
                  <select
                    name="serviceMode"
                    value={form.serviceMode}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    {SERVICE_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    Replace Service Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
                  />

                  {uploading && (
                    <p className="mt-2 text-sm text-blue-600">
                      Uploading image...
                    </p>
                  )}

                  {form.image && (
                    <div className="mt-3">
                      <img
                        src={form.image}
                        alt="Service preview"
                        className="h-32 w-40 rounded-lg border object-cover"
                      />
                      <p className="mt-1 text-xs text-green-600">
                        Current image is selected.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
                  After editing, your service will return to pending status
                  and require admin approval again.
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={saving || uploading}
                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
