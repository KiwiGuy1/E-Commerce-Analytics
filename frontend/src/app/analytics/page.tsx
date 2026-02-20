"use client";

import React from "react";
import Link from "next/link";
import RevenueChart from "../../components/RevenueChart";
import type { Sale } from "../../types/analytics";
import { useAnalytics } from "@/hooks/useAnalytics";

const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error } = useAnalytics();

  const revenueByMonth: { [month: string]: number } = {};
  data?.sales.forEach((sale: Sale) => {
    const month = new Date(sale.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    revenueByMonth[month] =
      (revenueByMonth[month] || 0) + sale.price * sale.quantity;
  });

  const productPerformance: { [name: string]: number } = {};
  data?.sales.forEach((sale: Sale) => {
    const name = sale.productId?.name;
    if (name) {
      productPerformance[name] =
        (productPerformance[name] || 0) + sale.quantity;
    }
  });

  const acquisitionChannels = [
    { channel: "Organic Search", percent: 40 },
    { channel: "Paid Ads", percent: 30 },
    { channel: "Social Media", percent: 20 },
    { channel: "Referral", percent: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Analytics / Reports
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Revenue trends, product momentum, and acquisition signal overview.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue Breakdown by Month
          </h2>
          <div className="mt-4 h-80">
            <RevenueChart
              revenue={
                Object.values(revenueByMonth).length
                  ? Object.values(revenueByMonth)
                  : [0]
              }
              labels={
                Object.keys(revenueByMonth).length
                  ? Object.keys(revenueByMonth)
                  : ["No Data"]
              }
            />
          </div>
        </div>

        <div className="surface rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Product Performance
          </h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {Object.entries(productPerformance).map(([name, qty], idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <span className="font-medium text-slate-800">{name}</span>
                <span className="text-sm text-emerald-700">{qty} sold</span>
              </li>
            ))}
            {!isLoading && Object.keys(productPerformance).length === 0 && (
              <li className="py-4 text-sm text-slate-500">
                No product data yet.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="surface mx-auto max-w-2xl rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Customer Acquisition Channels
        </h2>
        <table className="data-table mt-4 min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Channel</th>
              <th className="px-4 py-2 text-left">Percent</th>
            </tr>
          </thead>
          <tbody>
            {acquisitionChannels.map((ch, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 text-slate-800">{ch.channel}</td>
                <td className="px-4 py-2 text-emerald-700">{ch.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm font-medium text-slate-700 hover:underline"
        >
          {"<"} Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsPage;
