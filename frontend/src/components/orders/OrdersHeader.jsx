import React from "react";

export default function OrdersHeader({ filtered }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1
        className="text-2xl font-semibold text-stone-900"
        style={{ fontFamily: "var(--font-display)" }}
      >
        My orders
      </h1>
      <span className="text-sm text-stone-500">
        {filtered.length} order{filtered.length !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
