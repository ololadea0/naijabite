import React from "react";
import OrderStatusBadge from "../OrderStatusBadge";

export default function OrderDetailHeader({
  selectedOrder,
  customerPhone,
  formatDate,
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-mono text-xs text-stone-500 mb-1">
            #{selectedOrder.id}
          </p>
          <h2
            className="font-semibold text-stone-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Order Details
          </h2>
        </div>
        <OrderStatusBadge status={selectedOrder.status} />
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Customer</span>
          <span className="font-medium text-stone-900">
            {selectedOrder.customer.name}
          </span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Email</span>
          <span className="font-medium text-stone-900">
            {selectedOrder.customer.email}
          </span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Phone</span>
          <span className="font-medium text-stone-900">{customerPhone}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Address</span>
          <span className="font-medium text-stone-900 text-right max-w-[200px]">
            {selectedOrder.deliveryAddress}
          </span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Date</span>
          <span className="font-medium text-stone-900">
            {formatDate(selectedOrder.createdAt)}
          </span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Payment</span>
          <span
            className={`font-semibold ${selectedOrder.paymentStatus === "Paid" ? "text-green-600" : selectedOrder.paymentStatus === "Failed" ? "text-red-600" : "text-amber-600"}`}
          >
            {selectedOrder.paymentStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
