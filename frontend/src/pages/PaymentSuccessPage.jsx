import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import OrderStatusBadge from "../components/OrderStatusBadge";
import api from "../lib/api";
import { fetchUserOrders } from "../store/orderSlice";

export default function PaymentSuccessPage({ orderId, navigate }) {
  const { orders, clearCart } = useApp();
  const [currentOrderId, setCurrentOrderId] = useState(orderId);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const order = orders.find((o) => o.id === currentOrderId);

  useEffect(() => {
    let mounted = true;

    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    const qOrderId = params.get("orderId") || orderId;
    if (qOrderId && qOrderId !== currentOrderId) setCurrentOrderId(qOrderId);

    const verifyByReference = async (ref) => {
      setLoading(true);
      try {
        const res = await api.post("/payments/verify", { reference: ref });
        // If backend returns an orderId, ensure we display it
        if (res?.data?.orderId) {
          setCurrentOrderId(res.data.orderId);
        }
        await dispatch(fetchUserOrders());
        if (mounted) setMessage("Payment confirmed");
      } catch (err) {
        console.error("Verify error", err);
        // If verification failed because metadata.orderId wasn't present on provider
        // fallback to polling the order if we have an orderId in the query string
        const errMsg = err.response?.data?.message || "Verification failed";
        console.warn("Verify error msg:", errMsg);
        if (mounted) setMessage(errMsg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const pollOrder = async (id) => {
      if (!id) return;
      setLoading(true);
      try {
        let attempts = 0;
        while (attempts < 6) {
          const res = await api.get(`/orders/${id}`);
          if (res?.data?.isPaid) {
            await dispatch(fetchUserOrders());
            if (mounted) setMessage("Payment confirmed");
            break;
          }
          await new Promise((r) => setTimeout(r, 2000));
          attempts++;
        }
      } catch (err) {
        console.error("Poll error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (reference) {
      verifyByReference(reference);
    } else if (qOrderId) {
      pollOrder(qOrderId);
    }

    return () => {
      mounted = false;
    };
  }, [orderId, dispatch]);

  useEffect(() => {
    if (message === "Payment confirmed" || currentOrderId) {
      clearCart();
    }
  }, [currentOrderId, clearCart, message]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-40" />
            <div className="relative w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline
                  points="20 6 9 17 4 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1
            className="text-3xl font-semibold text-stone-900 mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Order placed!
          </h1>
          <p className="text-stone-500 mb-1">
            Thanks for your order. We've received it and the restaurant will
            confirm shortly.
          </p>
          {message && <p className="text-sm text-stone-600 mb-3">{message}</p>}

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("orders")}
              className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              View orders
            </button>
            <button
              onClick={() => navigate("menu")}
              className="h-11 px-6 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors"
            >
              Back to menu
            </button>
          </div>

          {order && (
            <div className="mt-6 text-left w-full max-w-md mx-auto">
              <div className="inline-flex items-center gap-2 mt-2 mb-4">
                <span className="text-xs text-stone-400 font-mono">
                  #{order.id}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 text-left mb-4">
                <h3 className="text-sm font-semibold text-stone-900 mb-3">
                  Your order
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-stone-500 truncate">
                          {item.quantity} × {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
