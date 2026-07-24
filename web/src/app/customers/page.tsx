"use client";

import React, { useMemo } from "react";
import { useUsers } from "@/hooks/useUsers";
import LoadingScreen from "@/components/LoadingScreen";

const CustomersPage: React.FC = () => {
  const {
    users,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    newCustomers,
    refetch,
  } = useUsers({ live: true, pollIntervalMs: 4000 });

  const newIds = useMemo(
    () => new Set(newCustomers.map((customer) => customer._id)),
    [newCustomers],
  );

  if (isLoading) {
    return <LoadingScreen label="Loading customers..." />;
  }

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
          <button
            onClick={() => void refetch({ silent: true })}
            className="btn-secondary text-sm font-medium"
          >
            Refresh now
          </button>
        </div>
      </div>

      <div className="surface rounded-xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live updates
          </span>
          <span>Polling every 4s {isRefreshing ? "(refreshing...)" : ""}</span>
          <span>
            Last updated:{" "}
            {lastUpdated
              ? lastUpdated.toLocaleTimeString("en-US")
              : "waiting for first sync"}
          </span>
        </div>
      </div>

      {newCustomers.length > 0 && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm">
          {newCustomers.length === 1
            ? `New customer joined: ${newCustomers[0].name}`
            : `${newCustomers.length} new customers joined just now.`}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="surface overflow-x-auto rounded-2xl p-4">
        <table className="data-table min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Signup Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className={newIds.has(user._id) ? "bg-emerald-50/70" : ""}
              >
                <td className="px-4 py-2 text-slate-800">{user.name}</td>
                <td className="px-4 py-2 text-emerald-700">{user.email}</td>
                <td className="px-4 py-2 text-violet-700">{user.role}</td>
                <td className="px-4 py-2 text-slate-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!isLoading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersPage;
