import React from "react";

export default function OrdersFilterBar({
  filter,
  setFilter,
  orders,
  STATUS_FILTERS,
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
      {STATUS_FILTERS.map((s) => {
        const count =
          s === "All"
            ? orders.length
            : orders.filter((o) => o.status === s).length;

        if (count === 0 && s !== "All") return null;

        return (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex-shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold border transition-all ${
              filter === s
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600"
            }`}
          >
            {s} {count > 0 && <span className="opacity-70">({count})</span>}
          </button>
        );
      })}
    </div>
  );
}
