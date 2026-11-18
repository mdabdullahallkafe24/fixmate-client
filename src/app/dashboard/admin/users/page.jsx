
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  UserCog,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function AdminUsersPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const user = session?.user;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch users.");
      }

      setUsers(Array.isArray(result.users) ? result.users : []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoading && user?.role === "admin") {
      fetchUsers();
    } else if (!sessionLoading) {
      setLoading(false);
    }
  }, [sessionLoading, user?.role, fetchUsers]);

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser._id === user?._id) {
      setError("You cannot change your own role.");
      return;
    }

    if (targetUser.role === newRole) return;

    const confirmed = window.confirm(
      `Are you sure you want to change ${targetUser.name}'s role from ${targetUser.role} to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(targetUser._id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/admin/users/${targetUser._id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update user role.");
      }

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === targetUser._id
            ? { ...item, role: newRole }
            : item
        )
      );

      setSuccess(`${targetUser.name}'s role updated to ${newRole}.`);
    } catch (err) {
      setError(err.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    all: users.length,
    customer: users.filter((item) => item.role === "customer").length,
    technician: users.filter((item) => item.role === "technician").length,
    admin: users.filter((item) => item.role === "admin").length,
  };

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const matchesFilter =
        activeFilter === "all" || item.role === activeFilter;

      const search = searchTerm.toLowerCase();

      const matchesSearch =
        item.name?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.role?.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [users, activeFilter, searchTerm]);

  const roleStyles = {
    customer: "bg-blue-100 text-blue-700",
    technician: "bg-purple-100 text-purple-700",
    admin: "bg-amber-100 text-amber-700",
  };

  if (sessionLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-14 w-14 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900">
            Access Denied
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            You must have an admin account to access this page.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              User Management
            </h1>

            <p className="mt-2 text-gray-500">
              View all users and manage their account roles.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={counts.all}
            icon={<Users size={22} />}
            color="blue"
          />
          <StatCard
            title="Customers"
            value={counts.customer}
            icon={<UserCheck size={22} />}
            color="green"
          />
          <StatCard
            title="Technicians"
            value={counts.technician}
            icon={<UserCog size={22} />}
            color="purple"
          />
          <StatCard
            title="Administrators"
            value={counts.admin}
            icon={<ShieldCheck size={22} />}
            color="amber"
          />
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            <CheckCircle size={20} />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Users", count: counts.all },
                { id: "customer", label: "Customers", count: counts.customer },
                { id: "technician", label: "Technicians", count: counts.technician },
                { id: "admin", label: "Admins", count: counts.admin },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex min-h-60 items-center justify-center rounded-2xl bg-white">
            <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <Users className="mx-auto mb-4 h-14 w-14 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-800">
              No users found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              No users match your current filter or search.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4">Manage Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((item) => {
                    const isCurrentUser =
                      item._id === user?._id;

                    return (
                      <tr
                        key={item._id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "User"}
                                className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                                {(item.name || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.name || "Unnamed User"}
                              </p>
                              {isCurrentUser && (
                                <span className="text-xs font-medium text-blue-600">
                                  You
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {item.email}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                              roleStyles[item.role] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.role}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>

                        <td className="px-6 py-5">
                          {isCurrentUser ? (
                            <span className="text-xs font-medium text-gray-400">
                              Cannot change own role
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <select
                                value={item.role}
                                disabled={updatingId === item._id}
                                onChange={(event) =>
                                  handleRoleChange(
                                    item,
                                    event.target.value
                                  )
                                }
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500 disabled:opacity-50"
                              >
                                <option value="customer">Customer</option>
                                <option value="technician">Technician</option>
                                <option value="admin">Admin</option>
                              </select>

                              {updatingId === item._id && (
                                <Loader2
                                  size={18}
                                  className="animate-spin text-blue-600"
                                />
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
