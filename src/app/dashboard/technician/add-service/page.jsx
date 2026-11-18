
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  ImagePlus,
  X,
  Loader2,
  CheckCircle2,
  Wrench,
  MapPin,
  Clock,
  DollarSign,
  User,
  Mail,
} from "lucide-react";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes = ["Home Visit", "Shop Drop-off"];

export default function AddServicePage() {
  const router = useRouter();

  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const user = session?.user;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "",
    serviceArea: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Image preview
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setImageFile(null);

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  // Upload image to ImgBB
  const uploadImageToImgBB = async () => {
    if (!IMGBB_API_KEY) {
      throw new Error(
        "ImgBB API key is missing. Please check your .env.local file."
      );
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(
        IMGBB_API_KEY
      )}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result?.error?.message || "Image upload failed."
      );
    }

    return result.data.url;
  };

  // Submit service
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!user) {
      setError("Please sign in before adding a service.");
      return;
    }

    if (user.role !== "technician") {
      setError("Only technicians can add services.");
      return;
    }

    if (!imageFile) {
      setError("Please select a service image.");
      return;
    }

    if (!IMGBB_API_KEY) {
      setError("ImgBB API key is missing from .env.local.");
      return;
    }

    const price = Number(formData.basePrice);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price greater than 0.");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);

      // First upload image to ImgBB
      const imageUrl = await uploadImageToImgBB();

      setUploading(false);

      // Then save service in MongoDB through backend API
      const response = await fetch(`${API_URL}/api/services`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          basePrice: price,
          image: imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add service."
        );
      }

      setSuccess(
        "Service added successfully! Waiting for admin approval."
      );

      setFormData({
        title: "",
        category: "",
        description: "",
        basePrice: "",
        estimatedDuration: "",
        serviceMode: "",
        serviceArea: "",
      });

      setImageFile(null);

      // Redirect after successful submission
      setTimeout(() => {
        router.push("/dashboard/technician/my-services");
        router.refresh();
      }, 1800);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Please Sign In
        </h2>
        <p className="mt-2 text-slate-500">
          You need to sign in to add a service.
        </p>
        <Link
          href="/sign-in"
          className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (user.role !== "technician") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Access Denied
        </h2>
        <p className="mt-2 text-slate-500">
          Only technicians can add repair services.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/technician"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                  <Wrench size={21} />
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  TECHNICIAN PANEL
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Add New Service
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Create a repair service and make it available to customers.
              </p>
            </div>

            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600"
            >
              My Services
            </Link>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Technician Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Technician Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your account information is automatically attached to this service.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User size={16} />
                  Technician Name
                </label>
                <input
                  type="text"
                  value={user.name || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail size={16} />
                  Technician Email
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Service Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Provide the basic details of your repair service.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Professional AC Repair Service"
                  required
                  minLength={3}
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your repair service, experience, and what customers can expect..."
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {formData.description.length}/2000 characters
                </p>
              </div>
            </div>
          </section>

          {/* Pricing and Duration */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Pricing & Duration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Set your service price and estimated completion time.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <DollarSign size={16} />
                  Base Price (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock size={16} />
                  Estimated Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  placeholder="e.g. 1-2 hours"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* Service Mode and Area */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Service Availability
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tell customers how and where you provide your service.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Service Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceMode"
                  value={formData.serviceMode}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">Select service mode</option>
                  {serviceModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin size={16} />
                  Service Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka, Mirpur"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* Image Upload */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Service Image
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload a clear image representing your repair service.
              </p>
            </div>

            <label
              htmlFor="serviceImage"
              className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/50"
            >
              {imagePreview ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="max-h-64 w-full rounded-xl object-cover"
                  />
                  <span className="mt-3 block text-sm font-medium text-green-600">
                    Image selected successfully
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-3 rounded-full bg-blue-100 p-4 text-blue-600">
                    <ImagePlus size={30} />
                  </div>
                  <span className="font-semibold text-slate-700">
                    Click to upload an image
                  </span>
                  <span className="mt-1 text-sm text-slate-400">
                    JPG, PNG or WEBP (Maximum 5MB)
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                    <Upload size={16} />
                    Choose Image
                  </span>
                </>
              )}
            </label>

            <input
              id="serviceImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            {imageFile && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">
                    {imageFile.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                  aria-label="Remove image"
                >
                  <X size={19} />
                </button>
              </div>
            )}
          </section>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <X size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <p>{success}</p>
            </div>
          )}

          {/* Approval Notice */}
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-800">
              Admin Approval Required
            </p>
            <p className="mt-1 text-sm leading-relaxed text-blue-700">
              Your service will be submitted for admin review. It will
              become visible to customers only after approval.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/technician"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {uploading ? "Uploading Image..." : "Submitting..."}
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Submit Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
