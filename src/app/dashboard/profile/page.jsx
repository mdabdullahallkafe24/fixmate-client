
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Phone,
  MapPin,
  FileText,
  ArrowLeft,
  LayoutDashboard,
  CalendarDays,
  BadgeCheck,
  CircleUserRound,
  Wrench,
  Loader2,
  Pencil,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();

  const user = session?.user;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        area: user.area || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      area: user?.area || "",
      bio: user?.bio || "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Full name is required.");
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } = await authClient.updateUser({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        area: formData.area.trim(),
        bio: formData.bio.trim(),
      });

      if (updateError) {
        setError(updateError.message || "Failed to update profile.");
        return;
      }

      await refetch();

      setEditing(false);
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="animate-spin text-blue-600" size={22} />
          Loading your profile...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CircleUserRound className="mx-auto text-slate-300" size={55} />
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Sign In Required
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please sign in to view your personal profile.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const role = user.role || "customer";
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const name = user.name || "FixMate User";
  const email = user.email || "No email available";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const accountDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const roleDashboard =
    role === "admin"
      ? "/dashboard/admin"
      : role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const profileItems = [
    {
      label: "Full Name",
      value: user.name || "Not added",
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: email,
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: user.phone || "Not added yet",
      icon: Phone,
    },
    {
      label: "Location / Area",
      value: user.area || "Not added yet",
      icon: MapPin,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Page Heading */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Account Settings
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              My Profile
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your personal information and account details.
            </p>
          </div>

          <Link
            href={roleDashboard}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={19} />
            {success}
          </div>
        )}

        {/* Profile Header */}
        <section className="relative mb-7 overflow-hidden rounded-3xl bg-[#07152e] p-7 text-white shadow-xl sm:p-10">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-extrabold shadow-xl">
              {initials || <UserRound size={42} />}
            </div>

            <div className="text-center sm:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
                <ShieldCheck size={14} />
                FixMate Member
              </div>

              <h2 className="text-2xl font-extrabold sm:text-3xl">
                {name}
              </h2>

              <p className="mt-2 text-sm text-slate-300">{email}</p>

              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="rounded-full bg-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-200">
                  {roleLabel} Account
                </span>

                {user.emailVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-300">
                    <BadgeCheck size={14} />
                    Verified Email
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Personal Information
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update your personal details.
                </p>
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => {
                  setSuccess("");
                  setError("");
                  setEditing(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    value={email}
                    disabled
                    className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`}
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Email cannot be changed here.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength={20}
                    placeholder="Enter your phone number"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="area"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Location / Area
                  </label>
                  <input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder="Enter your city or area"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="text-sm font-semibold text-slate-700"
                >
                  About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={500}
                  placeholder="Write something about yourself..."
                  className={`${inputClass} resize-y`}
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {formData.bio.length}/500
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                {profileItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                    >
                      <div className="flex items-center gap-2 text-slate-400">
                        <Icon size={17} />
                        <span className="text-xs font-semibold">
                          {item.label}
                        </span>
                      </div>

                      <p className="mt-3 break-words text-sm font-bold text-slate-800">
                        {item.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-slate-400">
                  <FileText size={17} />
                  <span className="text-xs font-semibold">About Me</span>
                </div>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {user.bio || "You haven't added a bio yet."}
                </p>
              </div>
            </>
          )}
        </section>

        {/* Account Details */}
        <section className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Account Details
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Your FixMate account information.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Wrench size={21} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Account Role</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarDays size={21} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Member Since</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {accountDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Button */}
        <section className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row">
          <div>
            <h3 className="font-bold text-slate-900">
              Welcome to FixMate!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage your repair journey from your dashboard.
            </p>
          </div>

          <Link
            href={roleDashboard}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <LayoutDashboard size={17} />
            Go to Dashboard
          </Link>
        </section>
      </div>
    </main>
  );
}
