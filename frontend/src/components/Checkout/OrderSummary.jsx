import React from "react";
import { formatCurrency } from "../../lib/formatters";

const OrderSummary = ({ cart, cartSubtotal, deliveryFee, total }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sticky top-20">
      <h3 className="font-semibold text-stone-900 text-sm mb-4">
        Order summary
      </h3>
      <div className="space-y-2.5 text-sm">
        {cart.map(({ food, quantity }, idx) => (
          <div
            key={food?.id ?? `item-${idx}`}
            className="flex justify-between text-stone-600"
          >
            <span className="truncate mr-2">
              {food?.name ?? "Menu item"} ×{quantity}
            </span>
            <span className="font-medium text-stone-900">
              {formatCurrency((food?.price ?? 0) * quantity)}
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
