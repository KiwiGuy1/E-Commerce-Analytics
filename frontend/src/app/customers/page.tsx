"use client";

import React, { useMemo } from "react";
import { useUsers } from "@/hooks/useUsers";

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
    [newCustomers]
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-blue-900">Customers</h1>
          <button
            onClick={() => void refetch({ silent: true })}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
          >
            Refresh now
          </button>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live updates
            </span>
            <span>
              Polling every 4s {isRefreshing ? "(refreshing...)" : ""}
            </span>
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

        <div className="bg-white rounded-lg shadow p-8">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-blue-900">Name</th>
                <th className="px-4 py-2 text-left text-blue-900">Email</th>
                <th className="px-4 py-2 text-left text-blue-900">Role</th>
                <th className="px-4 py-2 text-left text-blue-900">Signup Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={
                    "border-t transition-colors " +
                    (newIds.has(user._id) ? "bg-emerald-50" : "hover:bg-gray-50")
                  }
                >
                  <td className="px-4 py-2 text-blue-800">{user.name}</td>
                  <td className="px-4 py-2 text-green-700">{user.email}</td>
                  <td className="px-4 py-2 text-purple-700">{user.role}</td>
                  <td className="px-4 py-2 text-orange-700">
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
    </div>
  );
};

export default CustomersPage;
