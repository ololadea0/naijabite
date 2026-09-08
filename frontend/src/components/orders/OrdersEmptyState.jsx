import React from "react";

export default function OrdersEmptyState({ filter, navigate }) {
  return (
    <div className="text-center py-24 flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p className="font-semibold text-stone-900 mb-1">
        {filter === "All"
          ? "You haven't placed an order yet."
          : `No ${filter.toLowerCase()} orders.`}
      </p>
      <p className="text-stone-500 text-sm mb-5">
        Browse our menu and place your first order.
      </p>
      <button
        onClick={() => navigate("menu")}
        className="h-10 px-5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600"
      >
        Browse Menu
      </button>
    </div>
  );
}
