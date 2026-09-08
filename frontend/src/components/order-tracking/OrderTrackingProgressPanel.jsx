import React from "react";
import OrderTimeline from "../OrderTimeline";

export default function OrderTrackingProgressPanel({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h2 className="text-sm font-semibold text-stone-900 mb-5">
        Order progress
      </h2>
      <OrderTimeline currentStatus={order.status} />
      {order.status !== "Delivered" && order.status !== "Cancelled" && (
        <div className="mt-4 p-3 bg-stone-50 rounded-xl text-xs text-stone-500">
          <span className="font-medium">Note:</span> Status is updated by the
          restaurant. Refresh to see the latest.
        </div>
      )}
    </div>
  );
}
