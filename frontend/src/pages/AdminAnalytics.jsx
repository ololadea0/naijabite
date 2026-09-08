import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelector } from "react-redux";
import { useApp } from "../context/AppContext";
import { formatCurrency } from "../lib/formatters";
import AdminLayout from "../components/AdminLayout";
export default function AdminAnalytics({ navigate, onLogout }) {
  const { orders } = useApp();
  const customers = useSelector((state) => state.auth.users || []);
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;
  // Status distribution
  const statusCounts = {};
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });
  const maxStatus = Math.max(...Object.values(statusCounts));
  // Most ordered items
  const itemCounts = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemCounts[item.name])
        itemCounts[item.name] = { count: 0, img: item.imageUrl };
      itemCounts[item.name].count += item.quantity;
    });
  });
  const topItems = Object.entries(itemCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);
  const maxItem = Math.max(...topItems.map((i) => i[1].count));
  const STATUS_COLORS = {
    Pending: "bg-amber-400",
    Confirmed: "bg-blue-400",
    Preparing: "bg-orange-400",
    "Out for Delivery": "bg-purple-400",
    Delivered: "bg-green-500",
    Cancelled: "bg-red-400",
  };
  return _jsx(AdminLayout, {
    activeNav: "admin-analytics",
    navigate: navigate,
    onLogout: onLogout,
    pageTitle: "Analytics",
    children: _jsxs("div", {
      className: "space-y-6",
      children: [
        _jsxs("div", {
          className:
            "bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800",
          children: [
            _jsx("span", {
              className: "font-semibold",
              children: "Data note:",
            }),
            " Analytics reflect current session data. Connect dedicated analytics endpoints for historical data, revenue trends, and advanced reporting.",
          ],
        }),
        _jsx("div", {
          className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
          children: [
            {
              label: "Total Revenue",
              value: formatCurrency(totalRevenue),
              sub: "from paid orders",
            },
            {
              label: "Total Orders",
              value: totalOrders.toString(),
              sub: "all time",
            },
            {
              label: "Completed",
              value: delivered.toString(),
              sub: `${totalOrders ? Math.round((delivered / totalOrders) * 100) : 0}% completion rate`,
            },
            {
              label: "Customers",
              value: customers.length.toString(),
              sub: `${customers.length} registered`,
            },
          ].map((kpi) =>
            _jsxs(
              "div",
              {
                className: "bg-white rounded-2xl border border-stone-200 p-5",
                children: [
                  _jsx("p", {
                    className:
                      "text-xs text-stone-500 font-medium uppercase tracking-wide mb-2",
                    children: kpi.label,
                  }),
                  _jsx("p", {
                    className: "text-2xl font-semibold text-stone-900 mb-1",
                    style: { fontFamily: "var(--font-display)" },
                    children: kpi.value,
                  }),
                  _jsx("p", {
                    className: "text-xs text-stone-400",
                    children: kpi.sub,
                  }),
                ],
              },
              kpi.label,
            ),
          ),
        }),
        _jsxs("div", {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [
            _jsxs("div", {
              className: "bg-white rounded-2xl border border-stone-200 p-5",
              children: [
                _jsx("h3", {
                  className: "font-semibold text-stone-900 mb-5",
                  children: "Order status distribution",
                }),
                _jsx("div", {
                  className: "space-y-3",
                  children: Object.entries(statusCounts).map(
                    ([status, count]) =>
                      _jsxs(
                        "div",
                        {
                          children: [
                            _jsxs("div", {
                              className: "flex justify-between text-sm mb-1.5",
                              children: [
                                _jsx("span", {
                                  className: "text-stone-700 font-medium",
                                  children: status,
                                }),
                                _jsxs("span", {
                                  className: "text-stone-500",
                                  children: [
                                    count,
                                    " (",
                                    totalOrders
                                      ? Math.round((count / totalOrders) * 100)
                                      : 0,
                                    "%)",
                                  ],
                                }),
                              ],
                            }),
                            _jsx("div", {
                              className:
                                "h-2 bg-stone-100 rounded-full overflow-hidden",
                              children: _jsx("div", {
                                className: `h-full rounded-full transition-all ${STATUS_COLORS[status] ?? "bg-stone-400"}`,
                                style: {
                                  width: `${(count / maxStatus) * 100}%`,
                                },
                              }),
                            }),
                          ],
                        },
                        status,
                      ),
                  ),
                }),
              ],
            }),
            _jsxs("div", {
              className: "bg-white rounded-2xl border border-stone-200 p-5",
              children: [
                _jsx("h3", {
                  className: "font-semibold text-stone-900 mb-5",
                  children: "Most ordered items",
                }),
                _jsx("div", {
                  className: "space-y-3",
                  children: topItems.map(([name, { count, img }], rank) =>
                    _jsxs(
                      "div",
                      {
                        className: "flex items-center gap-3",
                        children: [
                          _jsx("span", {
                            className:
                              "w-5 text-xs font-bold text-stone-400 flex-shrink-0",
                            children: rank + 1,
                          }),
                          _jsx("img", {
                            src: img,
                            alt: name,
                            className:
                              "w-8 h-8 rounded-lg object-cover bg-stone-100 flex-shrink-0",
                          }),
                          _jsxs("div", {
                            className: "flex-1 min-w-0",
                            children: [
                              _jsxs("div", {
                                className: "flex justify-between text-sm mb-1",
                                children: [
                                  _jsx("span", {
                                    className:
                                      "text-stone-700 font-medium truncate",
                                    children: name,
                                  }),
                                  _jsxs("span", {
                                    className:
                                      "text-stone-500 flex-shrink-0 ml-2",
                                    children: [count, "x"],
                                  }),
                                ],
                              }),
                              _jsx("div", {
                                className:
                                  "h-1.5 bg-stone-100 rounded-full overflow-hidden",
                                children: _jsx("div", {
                                  className:
                                    "h-full bg-orange-400 rounded-full",
                                  style: {
                                    width: `${(count / maxItem) * 100}%`,
                                  },
                                }),
                              }),
                            ],
                          }),
                        ],
                      },
                      name,
                    ),
                  ),
                }),
              ],
            }),
          ],
        }),
        _jsxs("div", {
          className: "bg-white rounded-2xl border border-stone-200 p-5",
          children: [
            _jsx("h3", {
              className: "font-semibold text-stone-900 mb-4",
              children: "Revenue breakdown",
            }),
            _jsxs("div", {
              className: "grid sm:grid-cols-3 gap-4 text-sm",
              children: [
                _jsxs("div", {
                  className:
                    "bg-green-50 border border-green-200 rounded-xl p-4",
                  children: [
                    _jsx("p", {
                      className: "text-green-700 font-medium mb-1",
                      children: "Collected",
                    }),
                    _jsxs("p", {
                      className: "text-2xl font-semibold text-green-900",
                      children: [
                        formatCurrency(
                          orders
                            .filter((o) => o.paymentStatus === "Paid")
                            .reduce((s, o) => s + o.total, 0),
                        ),
                      ],
                    }),
                    _jsxs("p", {
                      className: "text-xs text-green-600 mt-1",
                      children: [
                        orders.filter((o) => o.paymentStatus === "Paid").length,
                        " paid orders",
                      ],
                    }),
                  ],
                }),
                _jsxs("div", {
                  className:
                    "bg-amber-50 border border-amber-200 rounded-xl p-4",
                  children: [
                    _jsx("p", {
                      className: "text-amber-700 font-medium mb-1",
                      children: "Pending",
                    }),
                    _jsxs("p", {
                      className: "text-2xl font-semibold text-amber-900",
                      children: [
                        formatCurrency(
                          orders
                            .filter((o) => o.paymentStatus === "Pending")
                            .reduce((s, o) => s + o.total, 0),
                        ),
                      ],
                    }),
                    _jsxs("p", {
                      className: "text-xs text-amber-600 mt-1",
                      children: [
                        orders.filter((o) => o.paymentStatus === "Pending")
                          .length,
                        " pending orders",
                      ],
                    }),
                  ],
                }),
                _jsxs("div", {
                  className: "bg-red-50 border border-red-200 rounded-xl p-4",
                  children: [
                    _jsx("p", {
                      className: "text-red-700 font-medium mb-1",
                      children: "Lost (cancelled)",
                    }),
                    _jsxs("p", {
                      className: "text-2xl font-semibold text-red-900",
                      children: [
                        formatCurrency(
                          orders
                            .filter((o) => o.status === "Cancelled")
                            .reduce((s, o) => s + o.total, 0),
                        ),
                      ],
                    }),
                    _jsxs("p", {
                      className: "text-xs text-red-600 mt-1",
                      children: [cancelled, " cancelled orders"],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
