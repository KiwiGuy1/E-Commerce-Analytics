"use client";

import { useMemo, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function OrdersPage() {
  const { data, isLoading, error, isRefreshing, refetch } = useAnalytics({
    live: true,
    pollIntervalMs: 6000,
  });

  const [search, setSearch] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const sales = useMemo(() => data?.sales ?? [], [data?.sales]);

  const segmentOptions = useMemo(() => {
    return Array.from(
      new Set(sales.map((sale) => sale.customerSegment).filter(Boolean))
    ) as string[];
  }, [sales]);

  const paymentOptions = useMemo(() => {
    return Array.from(
      new Set(sales.map((sale) => sale.paymentMethod).filter(Boolean))
    ) as string[];
  }, [sales]);

  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sales
      .filter((sale) => {
        const productName = sale.productId?.name?.toLowerCase() ?? "";
        const matchesQuery =
          !query ||
          productName.includes(query) ||
          sale.userId.toLowerCase().includes(query);
        const matchesSegment =
          segmentFilter === "all" || sale.customerSegment === segmentFilter;
        const matchesPayment =
          paymentFilter === "all" || sale.paymentMethod === paymentFilter;

        return matchesQuery && matchesSegment && matchesPayment;
      })
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [paymentFilter, sales, search, segmentFilter]);

  const summary = useMemo(() => {
    const orderCount = filteredSales.length;
    const unitsSold = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const revenue = filteredSales.reduce(
      (sum, sale) => sum + sale.quantity * sale.price,
      0
    );
    return { orderCount, unitsSold, revenue };
  }, [filteredSales]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
            <p className="mt-1 text-sm text-slate-600">
              Live order stream with filtering and revenue tracking.
            </p>
          </div>
          <button
            onClick={() => void refetch({ silent: true })}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.orderCount}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Units Sold</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {summary.unitsSold}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {money.format(summary.revenue)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product or customer id"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400"
          />
          <select
            value={segmentFilter}
            onChange={(event) => setSegmentFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All segments</option>
            {segmentOptions.map((segment) => (
              <option key={segment} value={segment}>
                {segment}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(event) => setPaymentFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          >
            <option value="all">All payments</option>
            {paymentOptions.map((payment) => (
              <option key={payment} value={payment}>
                {payment}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearch("");
              setSegmentFilter("all");
              setPaymentFilter("all");
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-slate-600">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Unit Price</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Segment</th>
              <th className="px-3 py-2">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale._id} className="border-t border-slate-100 text-sm">
                <td className="px-3 py-2 text-slate-700">
                  {new Date(sale.date).toLocaleString("en-US")}
                </td>
                <td className="px-3 py-2 font-medium text-slate-900">
                  {sale.productId?.name || "N/A"}
                </td>
                <td className="px-3 py-2 text-slate-700">{sale.quantity}</td>
                <td className="px-3 py-2 text-slate-700">
                  {money.format(sale.price)}
                </td>
                <td className="px-3 py-2 text-emerald-700">
                  {money.format(sale.price * sale.quantity)}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {sale.customerSegment || "N/A"}
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {sale.paymentMethod || "N/A"}
                </td>
              </tr>
            ))}
            {!isLoading && filteredSales.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
