import React from "react";
import { formatCurrency } from "../lib/formatters";
import OrderStatusBadge from "./OrderStatusBadge";

export default function AdminOrdersList({
  orders,
  filtered,
  openDetail,
  formatDate,
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-stone-100">
        <p className="text-xs text-stone-500 font-medium">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50">
              {[
                "Order ID",
                "Customer",
                "Total",
                "Payment",
                "Status",
                "Date",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-stone-500 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-stone-500 text-sm"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-stone-50 transition-colors cursor-pointer"
                  onClick={() => openDetail(order.id)}
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-stone-500 whitespace-nowrap">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-stone-900 whitespace-nowrap">
                      {order.customer.name}
                    </p>
                    <p className="text-xs text-stone-400 whitespace-nowrap">
                      {order.customer.email}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-stone-900 whitespace-nowrap">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`text-xs font-medium ${order.paymentStatus === "Paid" ? "text-green-600" : order.paymentStatus === "Failed" ? "text-red-600" : "text-amber-600"}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3.5 text-stone-400 text-xs whitespace-nowrap">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium text-orange-600">
                      Open →
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
