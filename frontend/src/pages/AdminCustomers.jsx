import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/authSlice";
import AdminLayout from "../components/AdminLayout";
import { formatCurrency } from "../lib/formatters";
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
export default function AdminCustomers({ navigate, onLogout }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.auth.users || []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const customers = useMemo(
    () =>
      users.map((user) => ({
        id: user._id || user.id,
        name: user.name || "Customer",
        email: user.email || "",
        phone: user.deliveryAddress?.phone || user.phone || "",
        role: user.role || "user",
        status: user.isDeleted ? "Inactive" : "Active",
        orders: user.orders ?? 0,
        totalSpent: user.totalSpent ?? 0,
        joinedAt: user.createdAt,
      })),
    [users],
  );

  const filtered = customers.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const selected = customers.find((c) => c.id === selectedId);
  return _jsx(AdminLayout, {
    activeNav: "admin-customers",
    navigate: navigate,
    onLogout: onLogout,
    pageTitle: "Customers",
    children: _jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
      children: [
        _jsxs("div", {
          className: "lg:col-span-2 space-y-4",
          children: [
            _jsxs("div", {
              className: "flex flex-col sm:flex-row gap-3",
              children: [
                _jsxs("div", {
                  className: "relative flex-1",
                  children: [
                    _jsxs("svg", {
                      className:
                        "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        _jsx("circle", { cx: "11", cy: "11", r: "8" }),
                        _jsx("line", {
                          x1: "21",
                          y1: "21",
                          x2: "16.65",
                          y2: "16.65",
                          strokeLinecap: "round",
                        }),
                      ],
                    }),
                    _jsx("input", {
                      type: "search",
                      value: search,
                      onChange: (e) => setSearch(e.target.value),
                      placeholder: "Search customers\u2026",
                      className:
                        "w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400",
                    }),
                  ],
                }),
                _jsxs("div", {
                  className: "relative",
                  children: [
                    _jsxs("select", {
                      value: statusFilter,
                      onChange: (e) => setStatusFilter(e.target.value),
                      className:
                        "h-10 pl-3 pr-8 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none appearance-none cursor-pointer",
                      children: [
                        _jsx("option", { children: "All" }),
                        _jsx("option", { children: "Active" }),
                        _jsx("option", { children: "Inactive" }),
                      ],
                    }),
                    _jsx("svg", {
                      className:
                        "absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: _jsx("polyline", {
                        points: "6 9 12 15 18 9",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                      }),
                    }),
                  ],
                }),
              ],
            }),
            _jsxs("div", {
              className:
                "bg-white rounded-2xl border border-stone-200 overflow-hidden",
              children: [
                _jsx("div", {
                  className: "px-5 py-3 border-b border-stone-100",
                  children: _jsxs("p", {
                    className: "text-xs text-stone-500 font-medium",
                    children: [
                      filtered.length,
                      " customer",
                      filtered.length !== 1 ? "s" : "",
                    ],
                  }),
                }),
                _jsx("div", {
                  className: "divide-y divide-stone-100",
                  children:
                    filtered.length === 0
                      ? _jsx("div", {
                          className:
                            "px-5 py-12 text-center text-stone-500 text-sm",
                          children: "No customers found.",
                        })
                      : filtered.map((customer) =>
                          _jsxs(
                            "button",
                            {
                              onClick: () =>
                                setSelectedId(
                                  selectedId === customer.id
                                    ? null
                                    : customer.id,
                                ),
                              className: `w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${selectedId === customer.id ? "bg-orange-50" : "hover:bg-stone-50"}`,
                              children: [
                                _jsx("div", {
                                  className:
                                    "w-10 h-10 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0",
                                  children: _jsx("span", {
                                    className:
                                      "text-stone-600 font-bold text-sm",
                                    children: customer.name.charAt(0),
                                  }),
                                }),
                                _jsxs("div", {
                                  className: "flex-1 min-w-0",
                                  children: [
                                    _jsx("p", {
                                      className:
                                        "font-medium text-stone-900 text-sm",
                                      children: customer.name,
                                    }),
                                    _jsx("p", {
                                      className:
                                        "text-xs text-stone-500 truncate",
                                      children: customer.email,
                                    }),
                                  ],
                                }),
                                _jsxs("div", {
                                  className: "text-right flex-shrink-0",
                                  children: [
                                    _jsxs("p", {
                                      className:
                                        "text-xs font-semibold text-stone-900",
                                      children: [customer.orders, " orders"],
                                    }),
                                    _jsx("span", {
                                      className: `text-xs px-1.5 py-0.5 rounded-full ${customer.status === "Active" ? "text-green-700 bg-green-50" : "text-stone-500 bg-stone-100"}`,
                                      children: customer.status,
                                    }),
                                  ],
                                }),
                              ],
                            },
                            customer.id,
                          ),
                        ),
                }),
              ],
            }),
          ],
        }),
        _jsx("div", {
          className: "lg:col-span-1",
          children: selected
            ? _jsxs("div", {
                className:
                  "bg-white rounded-2xl border border-stone-200 p-5 sticky top-20",
                children: [
                  _jsxs("div", {
                    className: "flex items-center gap-3 mb-5",
                    children: [
                      _jsx("div", {
                        className:
                          "w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center flex-shrink-0",
                        children: _jsx("span", {
                          className: "text-orange-600 font-bold",
                          children: selected.name.charAt(0),
                        }),
                      }),
                      _jsxs("div", {
                        children: [
                          _jsx("p", {
                            className: "font-semibold text-stone-900",
                            children: selected.name,
                          }),
                          _jsx("span", {
                            className: `text-xs px-2 py-0.5 rounded-full font-medium ${selected.status === "Active" ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"}`,
                            children: selected.status,
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsx("div", {
                    className: "space-y-3 text-sm",
                    children: [
                      ["Email", selected.email],
                      ["Phone", selected.phone],
                      ["Role", selected.role],
                      ["Joined", formatDate(selected.joinedAt)],
                      ["Total orders", String(selected.orders)],
                      ["Total spent", formatCurrency(selected.totalSpent)],
                    ].map(([label, value]) =>
                      _jsxs(
                        "div",
                        {
                          className: "flex justify-between gap-2",
                          children: [
                            _jsx("span", {
                              className: "text-stone-500",
                              children: label,
                            }),
                            _jsx("span", {
                              className:
                                "font-medium text-stone-900 text-right",
                              children: value,
                            }),
                          ],
                        },
                        label,
                      ),
                    ),
                  }),
                  _jsx("div", {
                    className: "border-t border-stone-100 mt-4 pt-4",
                    children: _jsx("p", {
                      className: "text-xs text-stone-500",
                      children:
                        "Role and account access are controlled through the backend authorization system. Contact your system administrator to modify user roles.",
                    }),
                  }),
                ],
              })
            : _jsxs("div", {
                className:
                  "bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm",
                children: [
                  _jsx("div", {
                    className:
                      "w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-3",
                    children: _jsx("svg", {
                      className: "w-5 h-5 text-stone-400",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: "1.75",
                      children: _jsx("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                      }),
                    }),
                  }),
                  "Select a customer to view their details.",
                ],
              }),
        }),
      ],
    }),
  });
}
