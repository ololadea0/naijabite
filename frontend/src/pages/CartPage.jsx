import React, { useState } from "react";
import { formatCurrency } from "../lib/formatters";
import { summarizeConfiguration } from "../lib/mealConfig";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import MealConfigurator from "../components/MealConfigurator";

const DEFAULT_DELIVERY_FEE = 2.5;

export default function CartPage({ navigate }) {
  const {
    cart,
    updateCartQty,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartSubtotal,
    getCartItemId,
  } = useApp();
  const [deliveryFee, setDeliveryFee] = React.useState(DEFAULT_DELIVERY_FEE);
  const [editingItem, setEditingItem] = useState(null);

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
          Your Order
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Your order is empty
            </h2>
            <p className="text-stone-500 text-sm mb-6 max-w-xs">
              Browse the menu and build a plate from today's kitchen.
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
              {cart.map((item, idx) => {
                const { food, quantity, configuration, totalPrice } = item;
                const cartItemId = getCartItemId(item);
                const imageSrc = food?.image || food?.imageUrl || null;
                const summary = summarizeConfiguration(configuration, food);

                return (
                  <div
                    key={cartItemId || `cart-${idx}`}
                    className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-4"
                  >
                    <button
                      type="button"
                      className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200"
                      onClick={() => navigate(`/food/${food?._id || food?.id}`)}
                    >
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt={food?.name ?? ""}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <button
                            onClick={() => navigate(`/food/${food?._id || food?.id}`)}
                            className="font-semibold text-stone-900 text-lg hover:text-orange-600 text-left leading-tight"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {food.name}
                          </button>
                          {summary.length > 0 ? (
                            <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                              {summary.join(" · ")}
                            </p>
                          ) : (
                            <p className="text-sm text-stone-500 mt-1">
                              Quantity x {quantity}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromCart(cartItemId)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1.5"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                        {summary.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="h-10 px-4 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50"
                          >
                            Edit plate
                          </button>
                        ) : (
                          <div className="inline-flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                            <button
                              onClick={() => updateCartQty(cartItemId, Math.max(1, quantity - 1))}
                              className="h-10 w-10 text-xl font-medium text-stone-700 hover:bg-stone-100"
                            >
                              -
                            </button>
                            <span className="w-10 text-center text-base font-medium text-stone-800">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(cartItemId, quantity + 1)}
                              className="h-10 w-10 text-xl font-medium text-stone-700 hover:bg-stone-100"
                            >
                              +
                            </button>
                          </div>
                        )}

                        <div className="text-xl font-semibold text-stone-900">
                          {formatCurrency(totalPrice)}
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
                Continue ordering
              </button>
            </div>

            <aside className="w-full bg-white rounded-2xl border border-stone-200 p-5 h-fit sticky top-20 shadow-sm lg:max-w-[360px] lg:justify-self-end">
              <h3 className="font-semibold text-stone-900 text-xl mb-5">
                Order summary
              </h3>

              <div className="space-y-3 text-sm text-stone-600">
                {cart.map((item, idx) => (
                  <div
                    key={getCartItemId(item) ?? `summary-${idx}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="text-stone-700">
                      {item.food?.name ?? "Menu item"}
                    </span>
                    <span className="font-medium text-stone-900">
                      {formatCurrency(item.totalPrice)}
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
                  className="flex-1 h-11 border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium rounded-xl transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => navigate("checkout")}
                  className="flex-[1.5] h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-xl transition-colors"
                >
                  Checkout
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>

      {editingItem && (
        <MealConfigurator
          food={editingItem.food}
          initialQuantity={editingItem.quantity}
          initialConfiguration={editingItem.configuration}
          onCancel={() => setEditingItem(null)}
          onAdd={(next) => {
            updateCartItem(getCartItemId(editingItem), {
              quantity: next.quantity,
              configuration: next.configuration,
            });
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
