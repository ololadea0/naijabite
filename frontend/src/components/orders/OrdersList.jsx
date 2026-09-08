import React from "react";
import { formatCurrency } from "../../lib/formatters";
import OrderStatusBadge from "../OrderStatusBadge";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrdersList({
  orders,
  navigate,
  confirmDelivery,
  setConfirmTarget,
  setConfirmOpen,
}) {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-stone-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-xs text-stone-500">
                  #{order.id}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-xs text-stone-400">
                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
              </p>
            </div>
            <span className="font-bold text-stone-900 text-base flex-shrink-0">
              {formatCurrency(order.total)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {order.items.slice(0, 3).map((item, i) => (
                <img
                  key={`${item.name}-${i}`}
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-9 h-9 rounded-lg object-cover bg-stone-100 border-2 border-white flex-shrink-0"
                />
              ))}
              {order.items.length > 3 && (
                <div className="w-9 h-9 rounded-lg bg-stone-100 border-2 border-white flex items-center justify-center text-xs font-semibold text-stone-500">
                  +{order.items.length - 3}
                </div>
              )}
            </div>
            <p className="text-sm text-stone-600 truncate">
              {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-stone-100 pt-3">
            <span
              className={`text-xs font-medium ${
                order.paymentStatus === "Paid"
                  ? "text-green-600"
                  : order.paymentStatus === "Failed"
                    ? "text-red-600"
                    : "text-amber-600"
              }`}
            >
              {order.paymentStatus === "Paid" ? "✓ " : ""}
              {order.paymentStatus}
            </span>

            <div className="flex gap-2">
              {(order.status === "Pending" || order.status === "Preparing") &&
                order.paymentStatus !== "Paid" && (
                  <button
                    onClick={() => {
                      setConfirmTarget(order.id);
                      setConfirmOpen(true);
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                )}

              {(order.status === "Out for Delivery" ||
                order.status === "Available for Pickup") && (
                <button
                  onClick={async () => {
                    try {
                      await confirmDelivery(order.id);
                    } catch (err) {
                      alert(err || "Unable to confirm delivery");
                    }
                  }}
                  className="text-xs font-semibold text-green-600 hover:text-green-700 border border-green-200 hover:border-green-400 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  Confirm delivery
                </button>
              )}

              {[
                "Pending",
                "Confirmed",
                "Preparing",
                "Out for Delivery",
                "Available for Pickup",
              ].includes(order.status) && (
                <button
                  onClick={() =>
                    navigate("order-tracking", { orderId: order.id })
                  }
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 hover:border-orange-400 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  Track order
                </button>
              )}

              <button
                onClick={() =>
                  navigate("order-tracking", { orderId: order.id })
                }
                className="text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 px-3 py-1.5 rounded-lg transition-all"
              >
                View details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
