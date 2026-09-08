import React from "react";

export default function CheckoutEmptyState({ navigate }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="font-semibold text-stone-900">Nothing to check out.</p>
        <button
          onClick={() => navigate("menu")}
          className="h-10 px-5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600"
        >
          Browse Menu
        </button>
      </div>
    </div>
  );
}
