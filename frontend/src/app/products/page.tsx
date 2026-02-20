"use client";

import { useMemo, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export default function ProductsPage() {
  const { data, isLoading, isRefreshing, error, refetch } = useAnalytics({
    live: true,
    pollIntervalMs: 6000,
  });

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockView, setStockView] = useState<"all" | "low">("all");

  const products = useMemo(() => data?.products ?? [], [data?.products]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(products.map((product) => product.category)),
    ).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const categoryMatch =
          categoryFilter === "all" || product.category === categoryFilter;
        const stockMatch = stockView === "all" || product.stock <= 20;
        return categoryMatch && stockMatch;
      })
      .slice()
      .sort((a, b) => b.stock - a.stock);
  }, [categoryFilter, products, stockView]);

  const inventorySummary = useMemo(() => {
    const totalSkus = products.length;
    const totalUnits = products.reduce(
      (sum, product) => sum + product.stock,
      0,
    );
    const lowStock = products.filter((product) => product.stock <= 20).length;
    const estInventoryValue = products.reduce(
      (sum, product) => sum + product.stock * product.price,
      0,
    );
    return { totalSkus, totalUnits, lowStock, estInventoryValue };
  }, [products]);

  return (
    <div className="space-y-6">
      <div className="surface rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
            <p className="mt-1 text-sm text-slate-600">
              Catalog, stock health, and inventory value from live data.
            </p>
          </div>
          <button
            onClick={() => void refetch({ silent: true })}
            className="btn-secondary text-sm"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">SKUs</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {inventorySummary.totalSkus}
          </p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Units in Stock</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {inventorySummary.totalUnits}
          </p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Low Stock SKUs</p>
          <p className="mt-2 text-2xl font-semibold text-orange-700">
            {inventorySummary.lowStock}
          </p>
        </div>
        <div className="surface rounded-2xl p-5">
          <p className="text-sm text-slate-500">Est. Inventory Value</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">
            {money.format(inventorySummary.estInventoryValue)}
          </p>
        </div>
      </div>

      <div className="surface rounded-2xl p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="field text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={stockView}
            onChange={(event) =>
              setStockView(event.target.value as "all" | "low")
            }
            className="field text-sm"
          >
            <option value="all">All stock levels</option>
            <option value="low">Low stock only (20 or less)</option>
          </select>

          <button
            onClick={() => {
              setCategoryFilter("all");
              setStockView("all");
            }}
            className="btn-secondary text-sm"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="surface overflow-x-auto rounded-2xl p-4">
        <table className="data-table min-w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-slate-600">
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Unit Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Stock Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="text-sm">
                <td className="px-3 py-2 font-medium text-slate-900">
                  {product.name}
                </td>
                <td className="px-3 py-2 text-slate-700">{product.category}</td>
                <td className="px-3 py-2 text-slate-700">
                  {money.format(product.price)}
                </td>
                <td
                  className={
                    "px-3 py-2 font-semibold " +
                    (product.stock <= 20 ? "text-orange-700" : "text-slate-800")
                  }
                >
                  {product.stock}
                </td>
                <td className="px-3 py-2 text-emerald-700">
                  {money.format(product.stock * product.price)}
                </td>
              </tr>
            ))}
            {!isLoading && filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  No products match your filters.
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
