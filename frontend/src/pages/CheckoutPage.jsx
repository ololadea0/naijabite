import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import DeliveryForm from "../components/Checkout/DeliveryForm";
import ReviewOrder from "../components/Checkout/ReviewOrder";
import PaymentSection from "../components/Checkout/PaymentSection";
import OrderSummary from "../components/Checkout/OrderSummary";
import CheckoutProgress from "../components/Checkout/CheckoutProgress";
import CheckoutEmptyState from "../components/Checkout/CheckoutEmptyState";
import {
  DEFAULT_DELIVERY_FEE,
  buildDeliveryDetailsFromUser,
  validateDeliveryDetails,
} from "../components/Checkout/checkoutHelpers";
import { formatDeliveryAddress } from "../lib/formatters";

export default function CheckoutPage({ navigate }) {
  const { cart, cartSubtotal, user, placeOrder } = useApp();
  const [step, setStep] = useState("delivery");
  const [orderType, setOrderType] = useState("delivery");
  const [deliveryDetails, setDeliveryDetails] = useState(() =>
    buildDeliveryDetailsFromUser(user),
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [deliveryFeeConfig, setDeliveryFeeConfig] =
    useState(DEFAULT_DELIVERY_FEE);
  const deliveryFee = orderType === "delivery" ? deliveryFeeConfig : 0;
  const total = cartSubtotal + deliveryFee;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/settings");
        if (!mounted) return;
        if (typeof res.data.deliveryFee === "number")
          setDeliveryFeeConfig(res.data.deliveryFee);
      } catch (err) {
        // ignore and use default
      }
    })();
    return () => (mounted = false);
  }, []);

  const validateDelivery = () => validateDeliveryDetails(deliveryDetails);

  const handleNextDelivery = () => {
    if (orderType === "pickup") {
      setErrors({});
      setStep("review");
      return;
    }

    const e = validateDelivery();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep("review");
  };

  useEffect(() => {
    if (!user || orderType !== "delivery") return;

    setDeliveryDetails((current) => {
      const next = buildDeliveryDetailsFromUser(user);
      const hasLocalEdits = Boolean(
        current.address || current.landmark || current.city || current.phone,
      );

      if (hasLocalEdits && current.address !== next.address) {
        return current;
      }

      return { ...current, ...next };
    });
  }, [
    orderType,
    user?._id,
    user?.address,
    user?.city,
    user?.phone,
    user?.deliveryAddress?.address,
    user?.deliveryAddress?.city,
    user?.deliveryAddress?.landmark,
    user?.deliveryAddress?.phone,
  ]);

  const handlePlaceOrder = async () => {
    if (orderType === "delivery") {
      const e = validateDelivery();
      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }
    }

    setErrors({});
    setLoading(true);

    try {
      const order = await placeOrder(deliveryDetails, orderType, {
        clearCart: false,
      });
      if (!order) {
        setLoading(false);
        return;
      }

      const paymentResponse = await api.post("/payments/initialize", {
        orderId: order.id || order._id,
      });

      const authorizationUrl = paymentResponse?.data?.authorizationUrl;
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
        return;
      }

      navigate("payment-processing", { orderId: order.id || order._id });
    } catch (error) {
      console.error("Paystack redirect error:", error);
      setErrors({
        payment:
          error.response?.data?.message ||
          "Unable to start Paystack payment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const STEPS = [
    { key: "delivery", label: "Delivery" },
    { key: "review", label: "Review" },
    { key: "payment", label: "Pay" },
  ];
  const stepIdx = STEPS.findIndex((s) => s.key === step);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar currentPage="cart" navigate={navigate} />
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="w-24 h-24 mx-auto mb-6">
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
            </div>
            <h2 className="text-lg font-semibold text-stone-900 mb-2">
              Processing your order
            </h2>
            <p className="text-sm text-stone-500">
              Please wait while we prepare payment details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar currentPage="cart" navigate={navigate} />
        <CheckoutEmptyState navigate={navigate} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="cart" navigate={navigate} />

      <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
        <CheckoutProgress STEPS={STEPS} stepIdx={stepIdx} />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              {step === "delivery" && (
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <label
                      className={`px-3 py-2 rounded-full border text-stone-700 font-medium ${orderType === "delivery" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-stone-200"} cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name="orderType"
                        value="delivery"
                        checked={orderType === "delivery"}
                        onChange={() => setOrderType("delivery")}
                        className="sr-only"
                      />
                      Delivery
                    </label>
                    <label
                      className={`px-3 py-2 rounded-full border text-stone-700 font-medium ${orderType === "pickup" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-white border-stone-200"} cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name="orderType"
                        value="pickup"
                        checked={orderType === "pickup"}
                        onChange={() => setOrderType("pickup")}
                        className="sr-only"
                      />
                      Pickup (I'll pick it up)
                    </label>
                  </div>

                  {orderType === "delivery" ? (
                    <DeliveryForm
                      user={user}
                      deliveryDetails={deliveryDetails}
                      setDeliveryDetails={setDeliveryDetails}
                      note={note}
                      setNote={setNote}
                      errors={errors}
                      onNext={handleNextDelivery}
                    />
                  ) : (
                    <div>
                      <div className="p-4 border rounded-md text-sm text-stone-600">
                        You chose to pick up your order at the restaurant. We'll
                        hold it for you — no delivery address required.
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={handleNextDelivery}
                          className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
                        >
                          Continue to review
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === "review" && (
                <ReviewOrder
                  cart={cart}
                  address={formatDeliveryAddress(deliveryDetails)}
                  onEditDelivery={() => setStep("delivery")}
                  onContinueToPayment={() => setStep("payment")}
                />
              )}

              {step === "payment" && (
                <PaymentSection
                  errors={errors}
                  loading={loading}
                  onBack={() => setStep("review")}
                  onPay={handlePlaceOrder}
                  total={total}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              cartSubtotal={cartSubtotal}
              deliveryFee={deliveryFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
