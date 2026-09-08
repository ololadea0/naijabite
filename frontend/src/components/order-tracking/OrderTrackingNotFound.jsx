import React from "react";
import Navbar from "../Navbar";

export default function OrderTrackingNotFound({ navigate }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="font-semibold text-stone-900">Order not found.</p>
        <button
          onClick={() => navigate("orders")}
          className="text-orange-600 text-sm font-medium hover:underline"
        >
          Back to orders
        </button>
      </div>
    </div>
  );
}
