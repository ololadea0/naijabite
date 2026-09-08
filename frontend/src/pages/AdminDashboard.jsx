import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AdminLayout from "../components/AdminLayout";
import OrderStatusBadge from "../components/OrderStatusBadge";

function StatCard({ label, value, change, up, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
          {label}
        </p>
        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-base">
          {icon}
        </div>
      </div>
      <p
        className="text-2xl font-semibold text-stone-900 mb-2"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
      >
        <svg
          className={`w-3 h-3 ${up ? "" : "rotate-180"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <polyline
            points="18 15 12 9 6 15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {change} this month
      </span>
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export default function AdminDashboard({ navigate, onLogout }) {
  const { orders } = useApp();
  const nav = navigate || useNavigate();

  const recent = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((s, o) => s + Number(o.total || 0), 0);
  const pending = orders.filter((o) => o.status === "Pending").length;

  return (
    <AdminLayout
      activeNav="admin"
      navigate={nav}
      onLogout={onLogout}
      pageTitle="Dashboard"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={`₦${totalRevenue.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            change="+12.5%"
            up={true}
            icon="💰"
          />
          <StatCard
            label="Total Orders"
            value={String(orders.length)}
            change="+8.3%"
            up={true}
            icon="📦"
          />
          <StatCard
            label="Pending Orders"
            value={String(pending)}
            change={pending > 2 ? "+" : "-"}
            up={false}
            icon="⏳"
          />
          <StatCard
            label="Menu Items"
            value="12"
            change="+2"
            up={true}
            icon="🍽️"
          />
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-semibold text-stone-900">Recent Orders</h3>
            <button
              onClick={() => nav("admin-orders")}
              className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Date",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-stone-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recent.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-stone-500 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-stone-900 whitespace-nowrap">
                      {order.customer?.name}
                    </td>
                    <td className="px-4 py-3.5 text-stone-500 max-w-[160px] truncate hidden md:table-cell">
                      {order.items
                        .map((i) => `${i.name} ×${i.quantity}`)
                        .join(", ")}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-stone-900 whitespace-nowrap">
                      ₦{Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium ${order.paymentStatus === "Paid" ? "text-green-600" : order.paymentStatus === "Failed" ? "text-red-600" : "text-amber-600"}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3.5 text-stone-400 text-xs whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() =>
                          nav("admin-order-detail", { orderId: order.id })
                        }
                        className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              label: "Manage Orders",
              desc: "Update order statuses",
              page: "admin-orders",
              icon: "📋",
            },
            {
              label: "Manage Menu",
              desc: "Add, edit, or remove items",
              page: "admin-menu",
              icon: "🍕",
            },
            {
              label: "View Customers",
              desc: "Browse customer accounts",
              page: "admin-customers",
              icon: "👥",
            },
          ].map((action) => (
            <button
              key={action.page}
              onClick={() => nav(action.page)}
              className="bg-white rounded-2xl border border-stone-200 p-5 text-left hover:border-orange-300 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl mb-3">{action.icon}</div>
              <p className="font-semibold text-stone-900 text-sm mb-1 group-hover:text-orange-600 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-stone-500">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
