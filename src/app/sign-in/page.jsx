
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
  Wrench,
  Smartphone,
  Laptop,
  Refrigerator,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Email and Password Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } =
        await authClient.signIn.email({
          email: trimmedEmail,
          password,
          rememberMe,
        });

      if (authError) {
        setError(
          authError.message ||
            "Invalid email or password. Please try again."
        );
        return;
      }

      const user = data?.user;

      if (!user) {
        setError("Login response was incomplete. Please try again.");
        return;
      }

      if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user.role === "technician") {
        router.replace("/dashboard/technician");
      } else {
        router.replace("/dashboard/customer");
      }

      router.refresh();
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setGoogleLoading(true);

      const { error: googleError } =
        await authClient.signIn.social({
          provider: "google",
          callbackURL: `${window.location.origin}/auth/callback`,
        });

      if (googleError) {
        setError(
          googleError.message ||
            "Google sign-in failed. Please try again."
        );
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Unable to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-2">

        {/* Left Visual Section */}
        <div className="relative hidden min-h-[650px] flex-col overflow-hidden bg-[#07152e] p-10 text-white lg:flex">
          <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-blue-600/25 blur-[90px]" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-[90px]" />

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

          <div className="relative z-10 mt-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles size={14} />
              WELCOME BACK
            </div>

            <h1 className="max-w-md text-4xl font-extrabold leading-[1.2] tracking-tight">
              Your Repairs.
              <span className="block text-blue-400">
                Our Priority.
              </span>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Sign in to manage your repair services, track bookings,
              and stay connected with your repair journey.
            </p>
          </div>

          {/* Visual Showcase */}
          <div className="relative z-10 mt-12 flex flex-1 items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative flex h-64 w-64 items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-4 rounded-[2rem] border border-white/5" />

              <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl shadow-blue-600/40">
                <Wrench size={66} strokeWidth={1.5} />
              </div>

              <div className="absolute -left-10 top-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 shadow-xl">
                <Smartphone size={29} className="text-blue-400" />
              </div>

              <div className="absolute -right-9 top-16 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 shadow-xl">
                <Laptop size={29} className="text-indigo-400" />
              </div>

              <div className="absolute -bottom-5 left-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 shadow-xl">
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

        {/* Right Sign In Form */}
        <div className="flex items-center p-7 sm:p-10">
          <div className="w-full">
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 lg:hidden"
              >
                <Wrench size={18} />
                FixMate
              </Link>

              <h2 className="mt-5 text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to your FixMate account.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">

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
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
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
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  />
                  Remember me
                </label>
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

              {/* Email Sign In */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.25 5.48-4.73 7.18l7.66 5.94c4.47-4.13 7.11-10.22 7.11-17.59Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.9-5.86l-7.66-5.94c-2.13 1.43-4.85 2.27-8.24 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                      />
                    </svg>

                    Continue with Google
                  </>
                )}
              </button>

              {/* Create Account */}
              <p className="pt-2 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
