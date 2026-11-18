
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  User,
  Wrench,
  BriefcaseBusiness,
  Smartphone,
  Laptop,
  Refrigerator,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Save the selected role through the protected backend API
  const completeRoleSelection = async (selectedRole) => {
    const response = await fetch(
      `${API_URL}/api/complete-signup-role`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          role: selectedRole,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Unable to save your account role."
      );
    }

    return result.role;
  };

  // Email Signup
  const handleSignUp = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    try {
      setLoading(true);

      const { data, error: authError } =
        await authClient.signUp.email({
          name: trimmedName,
          email: trimmedEmail,
          password,
        });

      if (authError) {
        setError(
          authError.message ||
            "Registration failed. Please try again."
        );
        return;
      }

      if (!data?.user) {
        setError(
          "Account creation could not be confirmed. Please try again."
        );
        return;
      }

      const savedRole = await completeRoleSelection(role);

      setSuccess("Account created successfully! Redirecting...");

      router.replace(`/dashboard/${savedRole}`);
      router.refresh();
    } catch (err) {
      console.error("Sign up error:", err);

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Signup
  const handleGoogleSignUp = async () => {
    try {
      setError("");
      setSuccess("");
      setGoogleLoading(true);

      const callbackURL =
        `${window.location.origin}/auth/callback`;

      const newUserCallbackURL =
        `${window.location.origin}/auth/callback?role=${encodeURIComponent(role)}`;

      const { error: googleError } =
        await authClient.signIn.social({
          provider: "google",

          // Existing Google users
          callbackURL,

          // Newly created Google users
          newUserCallbackURL,
        });

      if (googleError) {
        setError(
          googleError.message ||
            "Google authentication failed. Please try again."
        );

        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google authentication error:", err);

      setError(
        err.message || "Unable to continue with Google."
      );

      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-2">

        {/* Left Visual Section */}
        <div className="relative hidden min-h-[680px] flex-col overflow-hidden bg-[#07152e] p-10 text-white lg:flex">

          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-[90px]" />

          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 inline-flex w-fit items-center gap-3"
          >
            <div className="rounded-xl bg-blue-600 p-2.5 shadow-lg shadow-blue-600/30">
              <Wrench size={23} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              FixMate<span className="text-blue-400">.</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="relative z-10 mt-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles size={14} />
              SMART REPAIR EXPERIENCE
            </div>

            <h1 className="max-w-md text-4xl font-extrabold leading-[1.2] tracking-tight">
              Repairs Made Simple.
              <span className="block text-blue-400">
                Life Made Easier.
              </span>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Find trusted professionals and get your devices back
              to their best condition.
            </p>
          </div>

          {/* Visual Showcase */}
          <div className="relative z-10 mt-12 flex flex-1 items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative flex h-64 w-64 items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-2xl shadow-blue-950/40 backdrop-blur-sm">
              <div className="absolute inset-4 rounded-[2rem] border border-white/5" />

              <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-600/40">
                <Wrench
                  size={66}
                  strokeWidth={1.5}
                  className="text-white"
                />
              </div>

              <div className="absolute -left-10 top-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 shadow-xl shadow-black/30">
                <Smartphone size={29} className="text-blue-400" />
              </div>

              <div className="absolute -right-9 top-16 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 shadow-xl shadow-black/30">
                <Laptop size={29} className="text-indigo-400" />
              </div>

              <div className="absolute -bottom-5 left-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 shadow-xl shadow-black/30">
                <Refrigerator size={29} className="text-cyan-400" />
              </div>

              <div className="absolute -bottom-5 -right-8 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 shadow-xl">
                <CheckCircle2 size={17} className="text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Expert Care
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Indicator */}
          <div className="relative z-10 mt-12 flex items-center justify-between border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Trusted Repair Platform
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Quality service, made simple.
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold text-blue-300">
                FIXMATE
              </p>

              <p className="text-[10px] tracking-widest text-slate-500">
                REPAIR SMARTER
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-7 sm:p-10">

          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 lg:hidden"
            >
              <Wrench size={18} />
              FixMate
            </Link>

            <h2 className="mt-5 text-3xl font-bold text-slate-900">
              Create an Account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Join FixMate and get started today.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Account Role */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Create Account As
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                    role === "customer"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-blue-300"
                  }`}
                >
                  <User size={18} />
                  Customer
                </button>

                <button
                  type="button"
                  onClick={() => setRole("technician")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${
                    role === "technician"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-blue-300"
                  }`}
                >
                  <BriefcaseBusiness size={18} />
                  Technician
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={128}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Password must contain at least 6 characters,
                one uppercase letter and one lowercase letter.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div
                role="status"
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {success}
              </div>
            )}

            {/* Email Signup Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-slate-200" />

              <span className="mx-4 text-xs font-medium text-slate-400">
                OR CONTINUE WITH
              </span>

              <div className="flex-grow border-t border-slate-200" />
            </div>

            {/* Google Signup Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading || loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="h-5 w-5"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.91 46.98 31.71 46.98 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>

                  Continue with Google
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

