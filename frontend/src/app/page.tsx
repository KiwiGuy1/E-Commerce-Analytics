"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import KPI from "../components/KPI";
import RevenueChart from "../components/RevenueChart";
import type { Sale } from "../types/analytics";
import { useAnalytics } from "@/hooks/useAnalytics";

gsap.registerPlugin(useGSAP);

const DashboardHome: React.FC = () => {
  const { data, error, isLoading, isRefreshing, lastUpdated } = useAnalytics({
    live: true,
    pollIntervalMs: 5000,
  });
  const scope = useRef<HTMLDivElement>(null);
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const revenueByDay: { [label: string]: number } = {};
  data?.sales.forEach((sale) => {
    const label = new Date(sale.date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
    revenueByDay[label] =
      (revenueByDay[label] || 0) + sale.price * sale.quantity;
  });

  const sortedLabels = Object.keys(revenueByDay).sort((a, b) => {
    const [dayA, monthA] = a.split(" ");
    const [dayB, monthB] = b.split(" ");
    const dA = new Date(`${monthA} ${dayA}, 2000`).getTime();
    const dB = new Date(`${monthB} ${dayB}, 2000`).getTime();
    return dA - dB;
  });
  const sortedRevenue = sortedLabels.map((label) => revenueByDay[label]);

  const productSalesCount: { [key: string]: number } = {};
  data?.sales.forEach((sale) => {
    const name = sale.productId?.name || "N/A";
    productSalesCount[name] = (productSalesCount[name] || 0) + sale.quantity;
  });
  const topProducts = Object.entries(productSalesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const recentSales = data?.sales.slice(-8).reverse() || [];

  useGSAP(
    () => {
      gsap.to(".bg-blob", {
        y: 20,
        x: 10,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.25,
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".sidebar", { x: -24, opacity: 0, duration: 0.5 })
        .from(".topbar", { y: -16, opacity: 0, duration: 0.5 }, "-=0.25")
        .from(".hero", { y: 18, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(
          ".kpi-card",
          { y: 26, opacity: 0, duration: 0.55, stagger: 0.08 },
          "-=0.1",
        )
        .from(
          ".card",
          { y: 26, opacity: 0, duration: 0.6, stagger: 0.08 },
          "-=0.15",
        )
        .from(
          ".row-anim",
          { opacity: 0, y: 10, stagger: 0.03, duration: 0.25 },
          "-=0.2",
        );
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <div className="flex-1">
        <div className="topbar mb-4 flex items-center gap-3">
          <div className="flex-1 rounded-xl border border-slate-200 bg-white/70 backdrop-blur px-3 py-2 shadow-sm">
            <input
              placeholder="Search products, orders..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <button className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-100/70">
            Export
          </button>
        </div>

        <div className="hero mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time insights into sales, revenue, and product performance.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="kpi-card rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow">
            <KPI
              label="Total Sales"
              value={data?.totalSales ?? 0}
              color="text-blue-600"
            />
          </div>
          <div className="kpi-card rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow">
            <KPI
              label="Total Revenue"
              value={currencyFormatter.format(data?.totalRevenue ?? 0)}
              color="text-emerald-600"
            />
          </div>
          <div className="kpi-card rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow">
            <KPI
              label="Top Product"
              value={data?.topProduct ?? "N/A"}
              color="text-purple-600"
            />
          </div>
          <div className="kpi-card rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow">
            <KPI
              label="Products in Stock"
              value={
                data ? data.products.reduce((s, p) => s + (p.stock || 0), 0) : 0
              }
              color="text-orange-600"
            />
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="card xl:col-span-2 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Revenue (by Day)
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                {isRefreshing ? "Syncing..." : "Synced"}
                <span>
                  {lastUpdated
                    ? `at ${lastUpdated.toLocaleTimeString("en-US")}`
                    : ""}
                </span>
              </div>
            </div>
            <div className="mt-4 h-80">
              <RevenueChart
                revenue={sortedLabels.length ? sortedRevenue : [0]}
                labels={sortedLabels.length ? sortedLabels : ["No Data"]}
              />
            </div>
          </div>

          <div className="card rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Top Products
              </h2>
              <span className="text-xs text-slate-500">
                {topProducts.length} items
              </span>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {topProducts.map(([name, qty], idx) => (
                <li
                  key={idx}
                  className="row-anim flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-sm">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">{name}</span>
                  </div>
                  <span className="text-sm text-emerald-700">{qty} sold</span>
                </li>
              ))}
              {topProducts.length === 0 && (
                <li className="py-6 text-sm text-slate-500">
                  No product sales yet.
                </li>
              )}
            </ul>
          </div>
        </section>

        <section className="mt-6">
          <div className="card rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Sales
              </h2>
              <span className="text-xs text-slate-500">
                Last {recentSales.length || 0} records
              </span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-slate-600 text-sm">
                    <th className="px-4 py-2">Product</th>
                    <th className="px-4 py-2">Quantity</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale: Sale, idx: number) => (
                    <tr
                      key={idx}
                      className="row-anim border-t border-slate-100 hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-2 text-slate-800">
                        {sale.productId?.name || "N/A"}
                      </td>
                      <td className="px-4 py-2 text-emerald-700">
                        {sale.quantity}
                      </td>
                      <td className="px-4 py-2 text-purple-700">
                        ${sale.price}
                      </td>
                      <td className="px-4 py-2 text-slate-600">
                        {new Date(sale.date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                  {recentSales.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-sm text-slate-500"
                      >
                        No recent sales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {isLoading && !error && (
          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
