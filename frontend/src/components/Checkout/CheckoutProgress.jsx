import React from "react";

export default function CheckoutProgress({ STEPS, stepIdx }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
          <div
            className={`flex items-center gap-2 ${i <= stepIdx ? "text-orange-600" : "text-stone-400"}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                i < stepIdx
                  ? "bg-green-500 border-green-500 text-white"
                  : i === stepIdx
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-stone-300 text-stone-400"
              }`}
            >
              {i < stepIdx ? (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline
                    points="20 6 9 17 4 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${i === stepIdx ? "text-stone-900" : "text-stone-500"}`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-3 ${i < stepIdx ? "bg-green-400" : "bg-stone-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
