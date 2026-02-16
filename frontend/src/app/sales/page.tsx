"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RevenueChart from "../../components/RevenueChart";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useUsers } from "@/hooks/useUsers";
import { apiClient } from "@/lib/api";

const SalesPage: React.FC = () => {
  // Minimal API error shape used to safely read backend messages.
  type ApiError = {
    response?: {
      data?: {
        message?: string;
      };
    };
  };

  // Data sources for page content and form dropdowns.
  const { data, error: analyticsError, refetch } = useAnalytics();
  const { users, error: usersError } = useUsers();

  // Convenience aliases from analytics payload.
  const sales = data?.sales ?? [];
  const products = useMemo(() => data?.products ?? [], [data?.products]);

  // Controlled form state for manual sale/order creation.
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customerSegment, setCustomerSegment] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Submission UX state.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-select first available customer when data loads.
  useEffect(() => {
    if (users.length && !userId) {
      setUserId(users[0]._id);
    }
  }, [users, userId]);

  // Auto-select first available product when data loads.
  useEffect(() => {
    if (products.length && !productId) {
      setProductId(products[0]._id);
    }
  }, [products, productId]);

  // Selected product metadata powers stock limit + unit price display.
  const selectedProduct = useMemo(
    () => products.find((product) => product._id === productId),
    [productId, products],
  );

  // Fast lookup so sales rows can display customer name instead of raw userId.
  const userNameById = useMemo(() => {
    return users.reduce<Record<string, string>>((acc, user) => {
      acc[user._id] = user.name;
      return acc;
    }, {});
  }, [users]);

  // Aggregate revenue by day for chart rendering.
  const salesByDate: { [date: string]: number } = {};
  sales.forEach((sale) => {
    const date = new Date(sale.date).toLocaleDateString();
    salesByDate[date] = (salesByDate[date] || 0) + sale.price * sale.quantity;
  });

  const chartData = Object.entries(salesByDate).map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // Create a manual sale, then refresh analytics so UI updates immediately.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitMessage(null);

    if (!userId || !productId || quantity < 1) {
      setSubmitError("User, product, and quantity are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.createSale({
        userId,
        productId,
        quantity,
        customerSegment: customerSegment || undefined,
        paymentMethod: paymentMethod || undefined,
      });

      await refetch();
      setSubmitMessage("Sale created successfully.");
      setQuantity(1);
      setCustomerSegment("");
      setPaymentMethod("");
    } catch (error: unknown) {
      const apiMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as ApiError).response?.data?.message
          : undefined;
      setSubmitError(apiMessage || "Unable to create sale.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-6 flex flex-col items-center justify-start bg-slate-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">
        Sales and Orders
      </h1>

      {/* Top-level loading/API errors from analytics or users endpoints. */}
      {(analyticsError || usersError) && (
        <div className="w-full max-w-6xl mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {analyticsError || usersError}
        </div>
      )}

      {/* Manual order entry form that posts to POST /api/sales. */}
      <div className="sales-card w-full max-w-6xl rounded-xl border border-slate-200 bg-white p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-slate-900">
          Enter Sale / Order
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Customer
            <select
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
              required
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Product
            <select
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
              required
            >
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} (${product.price}) | Stock: {product.stock}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Quantity
            <input
              type="number"
              min={1}
              max={selectedProduct?.stock || 9999}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Payment Method
            <input
              type="text"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
              placeholder="card, paypal, bank_transfer"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700 md:col-span-2">
            Customer Segment
            <input
              type="text"
              value={customerSegment}
              onChange={(event) => setCustomerSegment(event.target.value)}
              placeholder="retail, wholesale, vip"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400"
            />
          </label>

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !users.length || !products.length}
              className="rounded-lg bg-slate-900 px-4 py-2 text-white font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Create Sale"}
            </button>
            {selectedProduct && (
              <span className="text-sm text-slate-600">
                Unit price: ${selectedProduct.price} | Stock left:{" "}
                {selectedProduct.stock}
              </span>
            )}
          </div>
        </form>

        {submitMessage && (
          <p className="mt-4 text-sm text-emerald-700">{submitMessage}</p>
        )}
        {submitError && (
          <p className="mt-4 text-sm text-red-700">{submitError}</p>
        )}
      </div>

      {/* Revenue history visualization built from grouped sales data. */}
      <div className="sales-card w-full max-w-6xl rounded-xl border border-slate-200 bg-white p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-slate-900">
          Revenue Trend by Date
        </h2>
        <div className="h-80">
          <RevenueChart
            revenue={chartData.map((d) => d.revenue)}
            labels={chartData.map((d) => d.date)}
          />
        </div>
      </div>

      {/* Most recent sales table for quick operational review. */}
      <div className="sales-card w-full max-w-6xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-slate-900">
          Recent Sales
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-slate-600 font-semibold">
                  Product
                </th>
                <th className="px-4 py-2 text-left text-slate-600 font-semibold">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-slate-600 font-semibold">
                  Price
                </th>
                <th className="px-4 py-2 text-left text-slate-600 font-semibold">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-slate-600 font-semibold">
                  Customer
                </th>
                <th className="px-4 py-2 text-left text-slate-600 font-semibold">
                  Segment
                </th>
                <th className="px-4 py-2 text-left text-slate-600 font-semibold">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody>
              {sales
                .slice(-20)
                .reverse()
                .map((sale, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-2 text-slate-800">
                      {sale.productId?.name || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-slate-900 font-semibold">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-2 text-slate-700 font-semibold">
                      ${sale.price}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {userNameById[sale.userId] || "Unknown Customer"}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {sale.customerSegment || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {sale.paymentMethod || "N/A"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-slate-700 hover:underline text-base">
          {"<"} Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default SalesPage;
