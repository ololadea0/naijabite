import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import { fetchUserOrders } from "../store/orderSlice";

export default function PaymentProcessingPage({ navigate }) {
  const dispatch = useDispatch();
  const { clearCart } = useApp();
  const [message, setMessage] = useState("Confirming payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference");
      const qOrderId = params.get("orderId");

      if (!reference && !qOrderId) {
        if (mounted) {
          setMessage("Missing payment reference or order id");
          setLoading(false);
          setTimeout(() => navigate("orders"), 2500);
        }
        return;
      }

      try {
        if (reference) {
          setMessage("Verifying payment with provider...");
          const res = await api.post("/payments/verify", { reference });
          // if backend returns orderId, use it
          const orderId = res?.data?.orderId || qOrderId;
          await dispatch(fetchUserOrders());
          if (mounted) {
            setMessage("Payment confirmed");
            setLoading(false);
            try {
              clearCart();
            } catch (e) {}
            // navigate to result page with orderId
            navigate("payment-result", { orderId });
          }
        } else {
          // no reference, but we have orderId: poll backend to see if paid
          setMessage("Checking order status...");
          let attempts = 0;
          while (attempts < 6) {
            const r = await api.get(`/orders/${qOrderId}`);
            if (r?.data?.isPaid) {
              await dispatch(fetchUserOrders());
              if (mounted) {
                setMessage("Payment confirmed");
                setLoading(false);
                try {
                  clearCart();
                } catch (e) {}
                navigate("payment-result", { orderId: qOrderId });
              }
              return;
            }
            await new Promise((r) => setTimeout(r, 2000));
            attempts++;
          }
          if (mounted) {
            setMessage("Payment not yet confirmed. Showing order details.");
            setLoading(false);
            navigate("payment-result", { orderId: qOrderId });
          }
        }
      } catch (err) {
        console.error("Processing error", err);
        if (mounted) {
          setMessage(err.response?.data?.message || "Verification failed");
          setLoading(false);
          // still navigate to result so user can see order
          const fallbackOrderId = new URLSearchParams(
            window.location.search,
          ).get("orderId");
          setTimeout(
            () =>
              navigate(fallbackOrderId ? "payment-result" : "orders", {
                orderId: fallbackOrderId,
              }),
            1500,
          );
        }
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-6">
            {loading ? (
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-orange-500 animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeOpacity="0.2"
                    fill="none"
                  ></circle>
                  <path
                    d="M22 12a10 10 0 00-10-10"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    fill="none"
                  ></path>
                </svg>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24">
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
          <h2 className="text-lg font-semibold text-stone-900 mb-2">
            {message}
          </h2>
          <p className="text-sm text-stone-500">
            You will be redirected shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
