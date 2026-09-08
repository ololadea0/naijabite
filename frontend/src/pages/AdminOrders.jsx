import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import AdminLayout from "../components/AdminLayout";
import AdminOrdersList from "../components/AdminOrdersList";
import AdminOrderDetail from "../components/AdminOrderDetail";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
];
const NEXT_STATUS = {
  Pending: "Confirmed",
  Confirmed: "Preparing",
  Preparing: "Out for Delivery",
};

export default function AdminOrders({ navigate, onLogout, initialOrderId }) {
  const { orders, updateOrderStatus } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState(initialOrderId ? "detail" : "list");
  const [selectedId, setSelectedId] = useState(initialOrderId ?? null);
  const [newStatus, setNewStatus] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updating, setUpdating] = useState(false);

  const filtered = orders
    .filter((o) => {
      const matchSearch =
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const selectedOrder = orders.find((o) => o.id === selectedId);

  const openDetail = (id) => {
    setSelectedId(id);
    setNewStatus("");
    setUpdateSuccess(false);
    setView("detail");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);
    await new Promise((r) => setTimeout(r, 800));
    updateOrderStatus(selectedOrder.id, newStatus);
    setUpdateSuccess(true);
    setUpdating(false);
    setNewStatus("");
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <AdminLayout
      activeNav="admin-orders"
      navigate={navigate}
      onLogout={onLogout}
      pageTitle="Orders"
    >
      {view === "list" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-xs">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line
                  x1="21"
                  y1="21"
                  x2="16.65"
                  y2="16.65"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by ID or customer…"
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-3 pr-8 rounded-xl bg-white border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30 appearance-none cursor-pointer"
              >
                <option value="All">All statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline
                  points="6 9 12 15 18 9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <AdminOrdersList
            orders={orders}
            filtered={filtered}
            openDetail={openDetail}
            formatDate={formatDate}
          />
        </div>
      ) : selectedOrder ? (
        <AdminOrderDetail
          selectedOrder={selectedOrder}
          setView={setView}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          handleUpdateStatus={handleUpdateStatus}
          updateSuccess={updateSuccess}
          updating={updating}
          STATUS_OPTIONS={STATUS_OPTIONS}
          NEXT_STATUS={NEXT_STATUS}
          formatDate={formatDate}
        />
      ) : (
        <p className="text-stone-500">Order not found.</p>
      )}
    </AdminLayout>
  );
}
