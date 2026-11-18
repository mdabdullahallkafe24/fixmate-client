
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  Menu,
  X,
  ArrowUpRight,
  UserRound,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Settings,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role || "customer";

  const dashboardPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const userName = user?.name || "FixMate User";
  const userEmail = user?.email || "";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Sign out error:", error);
        return;
      }

      closeMenus();
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  };

  const ProfileActions = ({ mobile = false }) => (
    <>
      <Link
        href={dashboardPath}
        onClick={closeMenus}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 ${
          mobile ? "" : ""
        }`}
      >
        <LayoutDashboard size={18} />
        Dashboard
      </Link>

      <Link
        href="/dashboard/profile"
        onClick={closeMenus}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
      >
        <Settings size={18} />
        My Profile
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
      >
        {signingOut ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <LogOut size={18} />
        )}
        {signingOut ? "Signing Out..." : "Sign Out"}
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="container-main flex h-[76px] items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={closeMenus}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <Wrench size={21} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col">
            <span className="text-[22px] font-extrabold tracking-tight text-slate-900">
              Fix<span className="text-blue-600">Mate</span>
            </span>
            <span className="-mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-slate-400">
              Smart Repair Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-2 text-[14px] font-semibold transition-colors duration-200 ${
                isActive(link.href)
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              {link.name}

              {isActive(link.href) && (
                <span className="absolute -bottom-[2px] left-0 h-[2px] w-full rounded-full bg-blue-600" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {isPending ? (
            <Loader2 size={21} className="animate-spin text-blue-600" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:border-blue-200 hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {initials || <UserRound size={19} />}
                </div>

                <div className="max-w-[145px] text-left">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {userName}
                  </p>
                  <p className="text-xs font-medium text-blue-600">
                    {roleLabel}
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  className={`text-slate-400 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {userName}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600">
                      {roleLabel} Account
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <ProfileActions />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30"
              >
                Get Started
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 pb-6 pt-4 shadow-xl md:hidden">
          <div className="container-main flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="my-2 border-t border-slate-100" />

            {isPending ? (
              <div className="flex justify-center py-4">
                <Loader2 size={22} className="animate-spin text-blue-600" />
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {initials || <UserRound size={19} />}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {userName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-blue-600">
                      {roleLabel} Account
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <ProfileActions mobile />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={closeMenus}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenus}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Get Started
                  <ArrowUpRight size={17} />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
