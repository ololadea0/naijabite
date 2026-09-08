import React, { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { FiBell } from "react-icons/fi";

export default function NotificationBell({ navigate, adminMode = false }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const lastBrowserAlertRef = useRef("");

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data || []);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const t = setInterval(fetchNotifications, 30000);
    return () => clearInterval(t);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (
      !adminMode ||
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      return;
    }

    const newestUnread = [...notifications]
      .filter((n) => !n.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!newestUnread) return;

    const alertKey = `${newestUnread._id}-${newestUnread.message}`;
    if (lastBrowserAlertRef.current === alertKey) return;

    if (window.Notification.permission === "granted") {
      const browserNotification = new window.Notification(
        "NaijaBite admin alert",
        {
          body: newestUnread.message,
          tag: `naijabite-alert-${newestUnread._id}`,
        },
      );

      browserNotification.onclick = () => {
        window.focus();
        if (newestUnread.order) {
          navigate("admin-order-detail", { orderId: newestUnread.order });
        }
        setOpen(false);
      };

      lastBrowserAlertRef.current = alertKey;
    }
  }, [adminMode, notifications, navigate]);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await api.put(`/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            window.Notification.permission === "default"
          ) {
            window.Notification.requestPermission();
          }
          setOpen((v) => !v);
          if (!open) fetchNotifications();
        }}
        className="relative p-2 rounded-lg transition-colors text-stone-500 hover:text-stone-900 hover:bg-stone-100"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-xl shadow-lg z-50 text-stone-800">
          <div className="p-3 border-b border-stone-200 flex items-center justify-between text-sm font-medium text-stone-800">
            <div>Notifications</div>
            <button
              onClick={markAllRead}
              className="text-xs text-stone-500 hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-64 overflow-auto">
            {notifications.length === 0 && (
              <div className="p-3 text-sm text-stone-500">No notifications</div>
            )}
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 text-sm border-b border-stone-100 ${n.isRead ? "bg-white" : "bg-orange-50"}`}
              >
                <div className="flex justify-between items-start gap-2 text-stone-800">
                  <div className="truncate text-stone-800">{n.message}</div>
                  <div className="text-[11px] text-stone-500 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      markRead(n._id);
                    }}
                    className="text-xs text-stone-600 hover:underline"
                  >
                    Mark read
                  </button>
                  {n.order && (
                    <button
                      onClick={() => {
                        if (adminMode) {
                          navigate("admin-order-detail", { orderId: n.order });
                        } else {
                          navigate("order-tracking", { orderId: n.order });
                        }
                        setOpen(false);
                      }}
                      className="text-xs text-orange-600 hover:underline"
                    >
                      View order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
