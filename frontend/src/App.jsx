import React from "react";
import {
  BrowserRouter as BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { AppProvider } from "./context/AppContext";
import { fetchCurrentUser } from "./store/authSlice";

import CustomerHome from "./pages/CustomerHome";
import MenuPage from "./pages/MenuPage";
import FoodDetailPage from "./pages/FoodDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentProcessingPage from "./pages/PaymentProcessingPage";
import PaymentResultPage from "./pages/PaymentResultPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminMenu from "./pages/AdminMenu";
import AdminCustomers from "./pages/AdminCustomers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RequireAuth({ children }) {
  const user = useSelector((s) => s.auth?.user);
  const status = useSelector((s) => s.auth?.status);

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-600">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const user = useSelector((s) => s.auth?.user);
  const status = useSelector((s) => s.auth?.status);

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-600">
        Loading...
      </div>
    );
  }

  if (user?.role?.toLowerCase() !== "admin")
    return <Navigate to="/auth" replace />;
  return children;
}

function withNavigation(Component) {
  return function WrappedComponent(props) {
    const routerNavigate = useNavigate();

    const navigateTo = (target, options = {}) => {
      const routeMap = {
        home: "/",
        menu: "/menu",
        cart: "/cart",
        checkout: "/checkout",
        orders: "/orders",
        profile: "/profile",
        auth: "/auth",
        login: "/auth",
        register: "/auth/register",
        admin: "/admin/dashboard",
        "admin-dashboard": "/admin/dashboard",
        "admin-orders": "/admin/orders",
        "admin-menu": "/admin/menu",
        "admin-customers": "/admin/customers",
        "admin-analytics": "/admin/analytics",
        "admin-settings": "/admin/settings",
      };

      if (typeof target === "string") {
        const path = routeMap[target] || target;
        routerNavigate(path.startsWith("/") ? path : `/${path}`);
        return;
      }

      if (target && typeof target === "object") {
        const nextPath = target.path || target.route || target.page;
        const mappedPath = nextPath ? routeMap[nextPath] : null;

        if (mappedPath) {
          routerNavigate(mappedPath);
          return;
        }
      }

      if (
        target &&
        typeof target === "object" &&
        typeof target.path === "string"
      ) {
        routerNavigate(
          target.path.startsWith("/") ? target.path : `/${target.path}`,
        );
        return;
      }

      routerNavigate("/");
    };

    return <Component {...props} navigate={navigateTo} />;
  };
}

const WrappedCustomerHome = withNavigation(CustomerHome);
const WrappedMenuPage = withNavigation(MenuPage);
const WrappedFoodDetailPage = withNavigation(FoodDetailPage);
const WrappedCartPage = withNavigation(CartPage);
const WrappedCheckoutPage = withNavigation(CheckoutPage);
const WrappedPaymentProcessingPage = withNavigation(PaymentProcessingPage);
const WrappedPaymentResultPage = withNavigation(PaymentResultPage);
const WrappedPaymentSuccessPage = withNavigation(PaymentSuccessPage);
const WrappedOrdersPage = withNavigation(OrdersPage);
const WrappedOrderTrackingPage = withNavigation(OrderTrackingPage);
const WrappedProfilePage = withNavigation(ProfilePage);
const WrappedAuthPage = withNavigation(AuthPage);
const WrappedAdminDashboard = withNavigation(AdminDashboard);
const WrappedAdminOrders = withNavigation(AdminOrders);
const WrappedAdminMenu = withNavigation(AdminMenu);
const WrappedAdminCustomers = withNavigation(AdminCustomers);
const WrappedAdminAnalytics = withNavigation(AdminAnalytics);
const WrappedAdminSettings = withNavigation(AdminSettings);

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div id="app-root">
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<WrappedCustomerHome />} />
          <Route path="/menu" element={<WrappedMenuPage />} />
          <Route path="/food/:id" element={<WrappedFoodDetailPage />} />
          <Route path="/cart" element={<WrappedCartPage />} />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <WrappedCheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/payment-success"
            element={<WrappedPaymentSuccessPage />}
          />
          <Route
            path="/payment/success"
            element={<WrappedPaymentSuccessPage />}
          />
          <Route
            path="/payment-processing"
            element={<WrappedPaymentProcessingPage />}
          />
          <Route
            path="/payment-result"
            element={<WrappedPaymentResultPage />}
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <WrappedOrdersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <RequireAuth>
                <WrappedOrderTrackingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <WrappedProfilePage />
              </RequireAuth>
            }
          />
          <Route path="/auth/*" element={<WrappedAuthPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin>
                <WrappedAdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RequireAdmin>
                <WrappedAdminOrders />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <RequireAdmin>
                <WrappedAdminMenu />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <RequireAdmin>
                <WrappedAdminCustomers />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <RequireAdmin>
                <WrappedAdminAnalytics />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RequireAdmin>
                <WrappedAdminSettings />
              </RequireAdmin>
            }
          />

          <Route
            path="*"
            element={<div className="p-8 text-center">Page Not Found</div>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
