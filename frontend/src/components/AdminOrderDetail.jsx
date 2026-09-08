import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import api from "../lib/api";
import OrderDetailHeader from "./admin-order-detail/OrderDetailHeader";
import OrderStatusPanel from "./admin-order-detail/OrderStatusPanel";
import OrderItemsPanel from "./admin-order-detail/OrderItemsPanel";
import OrderCommentsPanel from "./admin-order-detail/OrderCommentsPanel";
import OrderSummaryPanel from "./admin-order-detail/OrderSummaryPanel";

export default function AdminOrderDetail({
  selectedOrder,
  setView,
  newStatus,
  setNewStatus,
  handleUpdateStatus,
  updateSuccess,
  updating,
  STATUS_OPTIONS,
  NEXT_STATUS,
  formatDate,
}) {
  if (!selectedOrder) return <p className="text-stone-500">Order not found.</p>;

  const [orderDetail, setOrderDetail] = useState(selectedOrder);
  const [replyValues, setReplyValues] = useState({});
  const [replying, setReplying] = useState({});

  useEffect(() => {
    setOrderDetail(selectedOrder);
  }, [selectedOrder]);

  const customerPhone =
    orderDetail.customer?.phone ||
    orderDetail.user?.phone ||
    orderDetail.user?.deliveryAddress?.phone ||
    orderDetail.deliveryAddressDetails?.phone ||
    orderDetail.deliveryAddress?.phone ||
    "—";

  const handleReply = async (commentId) => {
    const message = (replyValues[commentId] || "").trim();
    if (!message || replying[commentId]) return;

    setReplying((prev) => ({ ...prev, [commentId]: true }));

    try {
      const response = await api.post(
        `/orders/${orderDetail.id}/comments/${commentId}/reply`,
        { message },
      );
      setOrderDetail((current) => ({
        ...current,
        comments: response.data.comments,
      }));
      setReplyValues((prev) => ({ ...prev, [commentId]: "" }));
    } catch (error) {
      console.error("Failed to reply to comment", error);
    } finally {
      setReplying((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setView("list")}
        className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="19" y1="12" x2="5" y2="12" strokeLinecap="round" />
          <polyline
            points="12 19 5 12 12 5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to orders
      </button>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <OrderDetailHeader
            selectedOrder={selectedOrder}
            customerPhone={customerPhone}
            formatDate={formatDate}
          />

          <OrderStatusPanel
            selectedOrder={selectedOrder}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            handleUpdateStatus={handleUpdateStatus}
            updateSuccess={updateSuccess}
            updating={updating}
            STATUS_OPTIONS={STATUS_OPTIONS}
            NEXT_STATUS={NEXT_STATUS}
          />
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <OrderItemsPanel selectedOrder={selectedOrder} />

          <OrderCommentsPanel
            orderDetail={orderDetail}
            replyValues={replyValues}
            setReplyValues={setReplyValues}
            replying={replying}
            handleReply={handleReply}
            formatDate={formatDate}
          />

          <OrderSummaryPanel selectedOrder={selectedOrder} />
        </div>
      </div>
    </div>
  );
}
