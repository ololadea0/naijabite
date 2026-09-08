import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../store/authSlice";
import NotificationBell from "./NotificationBell";
import {
  FiMenu,
  FiUser,
  FiHome,
  FiBox,
  FiShoppingBag,
  FiList,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Dashboard", page: "admin", Icon: FiHome },
  { label: "Orders", page: "admin-orders", Icon: FiShoppingBag },
  { label: "Menu", page: "admin-menu", Icon: FiList },
  { label: "Customers", page: "admin-customers", Icon: FiUsers },
  { label: "Analytics", page: "admin-analytics", Icon: FiBarChart2 },
  { label: "Settings", page: "admin-settings", Icon: FiSettings },
  { label: "View site", page: "/", Icon: FiHome },
];

export default function AdminLayout({
  activeNav,
  navigate: navigateProp,
  onLogout,
  pageTitle,
  title,
  children,
}) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const go = navigateProp || navigate;

  const user = useSelector((s) => s.auth.user);
  const orders = useSelector((s) => s.orders.items || []);
  const users = useSelector((s) => s.auth.users || []);
  const foods = useSelector((s) => s.food.items || []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (e) {
      // ignore
    } finally {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {open && (
        <div
          className="fixed inset-0 bg-stone-950/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:sticky top-0 left-0 h-screen w-60 bg-stone-950 flex flex-col z-40 transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-stone-800 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm shadow-orange-500/20">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M9 6.5V16.5M7.7 7.8H10.3M7.7 10.2H10.3M7.7 12.6H10.3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M14.5 7.25C15.25 7.25 15.9 8 15.9 8.8C15.9 9.87 15.15 10.7 14.5 11.2V17.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.7 8.7C16.8 8.7 17.7 9.6 17.7 10.7C17.7 12 16.9 13 15.7 13.2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p
              className="text-white text-sm font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              NaijaBite
            </p>
            <p className="text-stone-500 text-[10px] uppercase tracking-wide font-medium">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeNav === item.page ||
              (item.page === "admin-orders" &&
                activeNav === "admin-order-detail") ||
              (item.page === "admin-menu" && activeNav === "admin-menu-form");
            return (
              <button
                key={item.page}
                onClick={() => {
                  go(item.page);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                    : "text-stone-400 hover:text-white hover:bg-stone-800/70"
                }`}
              >
                <item.Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <span>{item.label}</span>
                  {item.page === "admin-orders" && orders.length > 0 ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-orange-600 text-white">
                      {orders.length > 99 ? "99+" : orders.length}
                    </span>
                  ) : null}
                  {item.page === "admin-customers" && users.length > 0 ? (
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-700 text-white">
                      {users.length > 99 ? "99+" : users.length}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-stone-800 space-y-2">
          <button
            onClick={() => go("/profile")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left border border-stone-700 bg-stone-900/60 hover:bg-stone-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-700 text-xs font-bold">
                {(user?.name || "A").slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white leading-tight truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[11px] text-stone-400 leading-tight truncate">
                {user?.email || "admin@naijabite.com"}
              </p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-5 sticky top-0 z-20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
              aria-label="Open navigation"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-stone-900">
              {pageTitle || title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationBell navigate={go} adminMode />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
}
