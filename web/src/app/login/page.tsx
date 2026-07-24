"use client";

import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useUsers } from "@/hooks/useUsers";
import LoadingScreen from "@/components/LoadingScreen";

export default function LoginPage() {
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

  if (analyticsLoading || usersLoading) {
    return <LoadingScreen label="Loading showcase data..." />;
  }

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Showcase Entry
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Authentication is intentionally disabled for recruiter-friendly
          review. Use this page as a quick launch point into the live dashboard
          experience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Customers</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {usersLoading ? "..." : users.length}
          </p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {analyticsLoading ? "..." : (data?.products.length ?? 0)}
          </p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {analyticsLoading ? "..." : (data?.sales.length ?? 0)}
          </p>
        </div>
      </div>

      {(analyticsError || usersError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {analyticsError || usersError}
        </div>
      )}

      <div className="surface rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">Quick Links</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary text-sm">
            Open Dashboard
          </Link>
          <Link href="/sales" className="btn-secondary text-sm">
            Create Order
          </Link>
          <Link href="/customers" className="btn-secondary text-sm">
            View Customers
          </Link>
        </div>
      </div>
    </div>
  );
}
