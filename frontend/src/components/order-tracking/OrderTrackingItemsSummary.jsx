import React from "react";
import { formatCurrency } from "../../lib/formatters";

export default function OrderTrackingItemsSummary({ order }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h2 className="text-sm font-semibold text-stone-900 mb-4">
        Items ordered
      </h2>
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-3"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-11 h-11 rounded-lg object-cover bg-stone-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-stone-900 flex-shrink-0">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 mt-4 pt-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Delivery fee</span>
          <span>{formatCurrency(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between font-bold text-stone-900 pt-1">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
