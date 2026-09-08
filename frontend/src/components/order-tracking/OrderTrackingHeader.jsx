import React from "react";
import OrderStatusBadge from "../OrderStatusBadge";
import { formatDate } from "./orderTrackingHelpers";

export default function OrderTrackingHeader({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-4">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h1
            className="text-lg font-semibold text-stone-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Order #{order.id}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
    </div>
  );
}
