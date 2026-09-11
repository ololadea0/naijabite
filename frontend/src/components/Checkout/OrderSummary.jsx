import React from "react";
import { formatCurrency } from "../../lib/formatters";
import { summarizeConfiguration } from "../../lib/mealConfig";

const OrderSummary = ({ cart, cartSubtotal, deliveryFee, total }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-20">
      <h3 className="font-semibold text-stone-900 text-sm mb-4">
        Order summary
      </h3>
      <div className="space-y-2.5 text-sm">
        {cart.map(({ food, quantity, configuration, totalPrice }, idx) => (
          <div
            key={food?.id ?? food?._id ?? `item-${idx}`}
            className="flex justify-between gap-3 text-stone-600"
          >
            <span className="min-w-0">
              <span className="block truncate">{food?.name ?? "Menu item"}</span>
              <span className="block text-xs text-stone-400 truncate">
                {summarizeConfiguration(configuration, food).join(" · ") ||
                  `Qty x ${quantity}`}
              </span>
            </span>
            <span className="font-medium text-stone-900 flex-shrink-0">
              {formatCurrency(totalPrice ?? (food?.price ?? 0) * quantity)}
            </span>
          </div>
        ))}

        <div className="border-t border-stone-100 pt-2.5 space-y-2">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-medium text-stone-900">
              {formatCurrency(cartSubtotal)}
            </span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery</span>
            <span className="font-medium text-stone-900">
              {formatCurrency(deliveryFee)}
            </span>
          </div>
          <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-stone-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
