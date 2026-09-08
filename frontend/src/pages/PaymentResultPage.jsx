import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useApp } from "../context/AppContext";
import { useDispatch } from "react-redux";
import { fetchUserOrders } from "../store/orderSlice";
import { formatCurrency } from "../lib/formatters";

export default function PaymentResultPage({ orderId, navigate }) {
  const { orders, clearCart } = useApp();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const order = orders.find((o) => o.id === orderId);

  useEffect(() => {
    if (order) {
      clearCart();
    }
  }, [clearCart, order]);

  useEffect(() => {
    const t = setTimeout(() => navigate("orders"), 6000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-stone-900 mb-2">
            Payment status
          </h1>
          <p className="text-sm text-stone-500 mb-4">
            You will be redirected to your orders shortly.
          </p>

          {order ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 text-left">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-xs text-stone-400 font-mono">
                  #{order.id}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="space-y-3 text-sm">
                {order.items.map((it, i) => (
                  <div
                    key={it.id ?? `it-${i}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {it.imageUrl ? (
                        <img
                          src={it.imageUrl}
                          alt={it.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-stone-100" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-stone-900 truncate">
                          {it.name}
                        </p>
                        <p className="text-xs text-stone-500">
                          Qty: {it.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatCurrency(it.price * it.quantity)}
                    </div>
                  </div>
                ))}

                <div className="border-t border-stone-100 pt-3 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery</span>
                    <span>{formatCurrency(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-stone-500">Order not found.</div>
          )}

          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => navigate("orders")}
              className="h-10 px-4 bg-orange-500 text-white rounded-xl"
            >
              View orders
            </button>
            <button
              onClick={() => navigate("menu")}
              className="h-10 px-4 border rounded-xl"
            >
              Back to menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
