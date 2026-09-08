import React from "react";

export default function OrderTrackingDeliveryDetails({ order }) {
  const paymentClass =
    order.paymentStatus === "Paid"
      ? "font-medium text-green-700"
      : order.paymentStatus === "Failed"
        ? "font-medium text-red-600"
        : "font-medium text-amber-700";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h2 className="text-sm font-semibold text-stone-900 mb-3">
        Delivery details
      </h2>
      <div className="space-y-2.5 text-sm">
        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <circle cx="12" cy="11" r="3" />
          </svg>
          <span className="text-stone-700">{order.deliveryAddress}</span>
        </div>

        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          <span className="text-stone-700">{order.customer.phone}</span>
        </div>

        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" strokeLinecap="round" />
          </svg>
          <span className={paymentClass}>Payment: {order.paymentStatus}</span>
        </div>
      </div>
    </div>
  );
}
