
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const handleCallback = async () => {
      try {
        const { data, error: sessionError } =
          await authClient.getSession();

        if (!active) return;

        if (sessionError || !data?.user) {
          router.replace("/sign-in");
          return;
        }

        // New Google signup includes a selected role
        const selectedRole = searchParams.get("role");

        if (selectedRole !== null) {
          if (
            selectedRole !== "customer" &&
            selectedRole !== "technician"
          ) {
            throw new Error("Invalid account role.");
          }

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
              result.message ||
                "Unable to save your account role."
            );
          }
        }

        if (!active) return;

        // Get the latest saved user role
        const { data: updatedSession, error: updatedError } =
          await authClient.getSession();

        if (updatedError || !updatedSession?.user) {
          throw new Error(
            "Unable to verify your account. Please sign in again."
          );
        }

        const userRole = updatedSession.user.role;

        if (userRole === "admin") {
          router.replace("/dashboard/admin");
        } else if (userRole === "technician") {
          router.replace("/dashboard/technician");
        } else {
          router.replace("/dashboard/customer");
        }

        router.refresh();
      } catch (err) {
        console.error("Authentication callback error:", err);

        if (active) {
          setError(
            err.message ||
              "Authentication failed. Please try again."
          );
        }
      }
    };

    handleCallback();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Authentication Failed
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <Link
            href="/sign-in"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

        <h1 className="mt-5 text-xl font-bold text-slate-900">
          Signing you in...
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Please wait while we prepare your FixMate dashboard.
        </p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
