import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersFilterBar from "../components/orders/OrdersFilterBar";
import OrdersEmptyState from "../components/orders/OrdersEmptyState";
import OrdersList from "../components/orders/OrdersList";

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage({ navigate }) {
  const { orders, cancelOrder, confirmDelivery } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />

      <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
        <OrdersHeader filtered={filtered} />
        <OrdersFilterBar
          filter={filter}
          setFilter={setFilter}
          orders={orders}
          STATUS_FILTERS={STATUS_FILTERS}
        />

        {sorted.length === 0 ? (
          <OrdersEmptyState filter={filter} navigate={navigate} />
        ) : (
          <OrdersList
            orders={sorted}
            navigate={navigate}
            confirmDelivery={confirmDelivery}
            setConfirmTarget={setConfirmTarget}
            setConfirmOpen={setConfirmOpen}
          />
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Cancel order"
        message="Are you sure you want to cancel this order? This cannot be undone."
        loading={confirmLoading}
        confirmLabel="Cancel order"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmLoading(true);
          try {
            await cancelOrder(confirmTarget);
          } catch (err) {
            alert(err || "Unable to cancel order");
          } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
          }
        }}
      />

      <Footer navigate={navigate} />
    </div>
  );
}
