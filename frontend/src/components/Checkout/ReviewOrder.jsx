import React from "react";
import { formatCurrency } from "../../lib/formatters";

export default function ReviewOrder({
  cart,
  address,
  onEditDelivery,
  onContinueToPayment,
}) {
  return (
    <div>
      <h2
        className="font-semibold text-stone-900 text-lg mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Review your order
      </h2>

      <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-800">
        <strong>Note:</strong> Paid orders cannot be cancelled or refunded.
        Please confirm your details before placing the order.
      </div>

      <div className="space-y-3 mb-5">
        {cart.map(({ food, quantity }, idx) => {
          const imageSrc = food?.imageUrl || food?.image || null;

          return (
            <div
              key={food?._id || food?.id || `item-${idx}`}
              className="flex items-center gap-3"
            >
              {imageSrc ? (
                <img
                  src={String(imageSrc).replace("w=600&h=450", "w=100&h=100")}
                  alt={food.name}
                  className="w-12 h-12 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">
                  {food.name}
                </p>
                <p className="text-xs text-stone-500">Qty: {quantity}</p>
              </div>
              <span className="text-sm font-semibold text-stone-900 flex-shrink-0">
                {formatCurrency(food.price * quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-stone-100 pt-4 mb-4">
        <div className="flex justify-between text-sm text-stone-600 mb-2">
          <span>Delivering to</span>
          <span className="text-stone-900 font-medium text-right max-w-[200px]">
            {address}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onEditDelivery}
          className="flex-1 h-11 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors"
        >
          Edit delivery
        </button>
        <button
          onClick={onContinueToPayment}
          className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
}
