import React from "react";
import { formatCurrency } from "../../lib/formatters";

export default function OrderItemsPanel({ selectedOrder }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h3 className="font-semibold text-stone-900 mb-4">Items</h3>
      <div className="space-y-3 mb-4">
        {selectedOrder.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-11 h-11 rounded-xl object-cover bg-stone-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-stone-500">
                Qty: {item.quantity} · {formatCurrency(item.price)} each
              </p>
            </div>
            <span className="text-sm font-semibold text-stone-900 flex-shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
