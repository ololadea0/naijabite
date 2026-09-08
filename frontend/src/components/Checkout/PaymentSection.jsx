import React from "react";
import { formatCurrency } from "../../lib/formatters";

export default function PaymentSection({
  errors,
  loading,
  onBack,
  onPay,
  total,
}) {
  return (
    <div>
      <h2
        className="font-semibold text-stone-900 text-lg mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Payment
      </h2>

      <p className="text-sm text-stone-600 mb-4">
        You will be redirected to a secure Paystack payment page to complete
        your payment.
      </p>

      {errors.payment && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
          {errors.payment}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 h-11 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onPay}
          disabled={loading}
          className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Processing…
            </>
          ) : (
            `Pay ${formatCurrency(total)}`
          )}
        </button>
      </div>
    </div>
  );
}
