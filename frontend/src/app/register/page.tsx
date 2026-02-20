"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useUsers } from "@/hooks/useUsers";

export default function RegisterPage() {
  const {
    data,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useAnalytics({
    live: false,
  });
  const {
    users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers({
    live: false,
  });

  const topCategories = useMemo(() => {
    const products = data?.products ?? [];
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [data?.products]);

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Demo Setup Guide
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Use this page to verify sample data before demoing. No sign-up or
          authentication is required.
        </p>
      </div>

      {(analyticsError || usersError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {analyticsError || usersError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Seeded Customers</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {usersLoading ? "..." : users.length}
          </p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Catalog Items</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {analyticsLoading ? "..." : (data?.products.length ?? 0)}
          </p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Sales Records</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {analyticsLoading ? "..." : (data?.sales.length ?? 0)}
          </p>
        </div>
      </div>

      <div className="surface rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Strongest Categories
        </h2>
        <ul className="mt-4 divide-y divide-slate-100">
          {topCategories.map(([category, count]) => (
            <li
              key={category}
              className="flex items-center justify-between py-3 text-sm"
            >
              <span className="text-slate-800">{category}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                {count} products
              </span>
            </li>
          ))}
          {!analyticsLoading && topCategories.length === 0 && (
            <li className="py-4 text-sm text-slate-500">
              No category data available.
            </li>
          )}
        </ul>
      </div>

      <div className="surface rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Runbook</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-700">
          <p>
            1. Start backend + frontend with `npm run dev` from workspace root.
          </p>
          <p>2. Seed demo data with `npm run prisma:seed`.</p>
          <p>
            3. Open `Sales` to add a manual order and watch dashboard metrics
            update.
          </p>
        </div>
        <div className="mt-4">
          <Link href="/sales" className="btn-primary text-sm">
            Go to Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
