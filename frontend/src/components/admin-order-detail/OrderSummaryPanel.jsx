import React from "react";
import { formatCurrency } from "../../lib/formatters";

export default function OrderSummaryPanel({ selectedOrder }) {
  return (
    <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
      <div className="flex justify-between text-stone-600">
        <span>Subtotal</span>
        <span>{formatCurrency(selectedOrder.subtotal)}</span>
      </div>
      <div className="flex justify-between text-stone-600">
        <span>Delivery fee</span>
        <span>{formatCurrency(selectedOrder.deliveryFee)}</span>
      </div>
      <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-100">
        <span>Total</span>
        <span>{formatCurrency(selectedOrder.total)}</span>
      </div>
    </div>
  );
}
