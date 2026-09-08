import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { createCommentThunk } from "../store/orderSlice";
import Navbar from "../components/Navbar";
import OrderTrackingNotFound from "../components/order-tracking/OrderTrackingNotFound";
import OrderTrackingBackButton from "../components/order-tracking/OrderTrackingBackButton";
import OrderTrackingHeader from "../components/order-tracking/OrderTrackingHeader";
import OrderTrackingProgressPanel from "../components/order-tracking/OrderTrackingProgressPanel";
import OrderTrackingItemsSummary from "../components/order-tracking/OrderTrackingItemsSummary";
import OrderTrackingDeliveryDetails from "../components/order-tracking/OrderTrackingDeliveryDetails";
import OrderTrackingCommentsSection from "../components/order-tracking/OrderTrackingCommentsSection";

export default function OrderTrackingPage({ orderId, navigate }) {
  const dispatch = useDispatch();
  const params = useParams();
  const { orders } = useApp();
  const activeOrderId = orderId || params?.id;
  const order = orders.find(
    (item) => item.id === activeOrderId || item._id === activeOrderId,
  );

  if (!order) return <OrderTrackingNotFound navigate={navigate} />;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="orders" navigate={navigate} />

      <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
        <OrderTrackingBackButton navigate={navigate} />
        <OrderTrackingHeader order={order} />

        <div className="grid md:grid-cols-2 gap-4">
          <OrderTrackingProgressPanel order={order} />

          <div className="space-y-4">
            <OrderTrackingItemsSummary order={order} />
            <OrderTrackingDeliveryDetails order={order} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("menu")}
            className="h-11 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Order again
          </button>
          <button
            onClick={() => navigate("orders")}
            className="h-11 px-6 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors"
          >
            All orders
          </button>
        </div>

        <OrderTrackingCommentsSection order={order} dispatch={dispatch} />
      </div>
    </div>
  );
}
