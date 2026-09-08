import React from "react";
import { formatCurrency } from "../lib/formatters";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";

const DEFAULT_DELIVERY_FEE = 2.5;

export default function CartPage({ navigate }) {
  const { cart, updateCartQty, removeFromCart, clearCart, cartSubtotal } =
    useApp();
  const [deliveryFee, setDeliveryFee] = React.useState(DEFAULT_DELIVERY_FEE);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await (await import("../lib/api")).default.get("/settings");
        if (!mounted) return;
        if (typeof res.data.deliveryFee === "number")
          setDeliveryFee(res.data.deliveryFee);
      } catch (err) {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, []);

  const total = cartSubtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="cart" navigate={navigate} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <h1
          className="text-4xl font-semibold text-stone-900 mb-7 leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-stone-100 flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-stone-500 text-sm mb-6 max-w-xs">
              Looks like you haven't added anything yet. Browse our menu to find
              something delicious.
            </p>
            <button
              onClick={() => navigate("menu")}
              className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="space-y-4 min-w-0">
              {cart.map(({ food, quantity }, idx) => {
                const itemId = food?._id || food?.id || `cart-${idx}`;
                return (
                  <div
                    key={itemId}
                    className="bg-white rounded-3xl border border-stone-200 p-4 flex items-center gap-5"
                  >
                    <div
                      className="w-28 h-28 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 cursor-pointer border border-stone-200"
                      onClick={() =>
                        navigate("food-detail", { foodId: food.id })
                      }
                    >
                      {(() => {
                        const src = food?.image || food?.imageUrl || null;
                        return src ? (
                          <img
                            src={src.replace("w=600&h=450", "w=200&h=200")}
                            alt={food?.name ?? ""}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25zM7.5 13.5l2.25 3 3-4 4.5 6H6l1.5-5.5z"
                              />
                            </svg>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <button
                          onClick={() =>
                            navigate("food-detail", { foodId: food.id })
                          }
                          className="font-semibold text-stone-900 text-xl hover:text-orange-600 transition-colors text-left leading-tight"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {food.name}
                        </button>

                        <button
                          onClick={() => removeFromCart(itemId)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1.5"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-stone-500 text-sm mt-2 leading-relaxed max-w-xl truncate">
                        {food.description || "Freshly prepared and served hot."}
                      </p>

                      <div className="flex items-center justify-between gap-4 mt-4">
                        <div className="inline-flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                          <button
                            onClick={() =>
                              updateCartQty(itemId, Math.max(1, quantity - 1))
                            }
                            className="h-11 w-11 text-xl font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-12 text-center text-base font-medium text-stone-800">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(itemId, quantity + 1)}
                            className="h-11 w-11 text-xl font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-xl font-semibold text-stone-900">
                          {formatCurrency((food?.price ?? 0) * quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => navigate("menu")}
                className="mt-2 inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium text-lg transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-2xl">←</span>
                Continue shopping
              </button>
            </div>

            <aside className="w-full bg-white rounded-3xl border border-stone-200 p-5 h-fit sticky top-20 shadow-sm lg:max-w-[360px] lg:justify-self-end">
              <h3
                className="font-semibold text-stone-900 text-xl mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Order summary
              </h3>

              <div className="space-y-3 text-sm text-stone-600">
                {cart.map(({ food, quantity }, idx) => (
                  <div
                    key={food?._id ?? food?.id ?? `summary-${idx}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-stone-700">
                      {food?.name ?? "Menu item"} × {quantity}
                    </span>
                    <span className="font-medium text-stone-900">
                      {formatCurrency((food?.price ?? 0) * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-200 mt-5 pt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-stone-700">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Delivery fee</span>
                  <span className="font-medium text-stone-900">
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-base font-semibold text-stone-900">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={clearCart}
                  className="flex-1 h-11 border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium rounded-2xl transition-colors"
                >
                  Clear cart
                </button>
                <button
                  onClick={() => navigate("checkout")}
                  className="flex-[1.5] h-11 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-base rounded-2xl transition-colors shadow-sm shadow-orange-500/20"
                >
                  Checkout · {formatCurrency(total)}
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-stone-500 text-sm">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                </svg>
                Secure checkout
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
