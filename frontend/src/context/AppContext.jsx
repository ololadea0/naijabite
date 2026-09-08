import { jsx as _jsx } from "react/jsx-runtime";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/authSlice";
import { fetchFoods } from "../store/foodSlice";
import {
  createOrderThunk,
  fetchAllOrders,
  fetchUserOrders,
  updateOrderStatusThunk,
  cancelOrderThunk,
  confirmDeliveryThunk,
} from "../store/orderSlice";
import {
  normalizeOrder,
  normalizeStatus,
  readCartFromStorage,
  persistCartToStorage,
  serializeStatus,
} from "./appContextHelpers";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const foodStatus = useSelector((state) => state.food.status);
  const rawOrders = useSelector((state) => state.orders.items || []);
  const orders = useMemo(() => rawOrders.map(normalizeOrder), [rawOrders]);
  const getCartItemId = useCallback((food) => food?._id || food?.id, []);

  const [cart, setCart] = useState(() => readCartFromStorage());

  useEffect(() => {
    persistCartToStorage(cart);
  }, [cart]);
  const [favorites, setFavorites] = useState([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce(
    (s, i) => s + Number(i.food.price || 0) * i.quantity,
    0,
  );

  useEffect(() => {
    if (foodStatus === "idle") dispatch(fetchFoods());
  }, [dispatch, foodStatus]);

  useEffect(() => {
    if (!user) return;
    const role = user.role?.toLowerCase?.();
    if (role === "admin") {
      dispatch(fetchAllOrders());
      dispatch(fetchUsers());
      return;
    }
    dispatch(fetchUserOrders());
  }, [dispatch, user]);

  const addToCart = useCallback(
    (food, qty = 1) => {
      const itemId = getCartItemId(food);
      setCart((prev) => {
        const existing = prev.find((i) => getCartItemId(i.food) === itemId);
        if (existing) {
          return prev.map((i) =>
            getCartItemId(i.food) === itemId
              ? { ...i, quantity: i.quantity + qty }
              : i,
          );
        }
        return [...prev, { food, quantity: qty }];
      });
    },
    [getCartItemId],
  );

  const removeFromCart = useCallback(
    (foodId) => {
      setCart((prev) => prev.filter((i) => getCartItemId(i.food) !== foodId));
    },
    [getCartItemId],
  );

  const updateCartQty = useCallback(
    (foodId, qty) => {
      if (qty <= 0) {
        setCart((prev) => prev.filter((i) => getCartItemId(i.food) !== foodId));
      } else {
        setCart((prev) =>
          prev.map((i) =>
            getCartItemId(i.food) === foodId ? { ...i, quantity: qty } : i,
          ),
        );
      }
    },
    [getCartItemId],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    try {
      localStorage.removeItem("cart");
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleFavorite = useCallback((foodId) => {
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId],
    );
  }, []);

  const placeOrder = useCallback(
    async (
      deliveryDetails,
      orderType = "delivery",
      options = { clearCart: true },
    ) => {
      if (!cart.length) return null;

      const payload = {
        orderType,
        orderItems: cart.map(({ food, quantity }) => ({
          food: food._id || food.id,
          qty: quantity,
        })),
        deliveryAddress: orderType === "delivery" ? deliveryDetails : undefined,
      };

      const result = await dispatch(createOrderThunk(payload)).unwrap();
      if (options?.clearCart !== false) clearCart();
      return normalizeOrder(result);
    },
    [cart, clearCart, dispatch],
  );

  const updateOrderStatus = useCallback(
    async (orderId, nextStatus) => {
      return dispatch(
        updateOrderStatusThunk({
          id: orderId,
          status: serializeStatus(nextStatus),
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const cancelOrder = useCallback(
    async (orderId) => {
      return dispatch(cancelOrderThunk(orderId)).unwrap();
    },
    [dispatch],
  );

  const confirmDelivery = useCallback(
    async (orderId) => {
      return dispatch(confirmDeliveryThunk(orderId)).unwrap();
    },
    [dispatch],
  );

  return _jsx(AppContext.Provider, {
    value: {
      cart,
      favorites,
      user,
      orders,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleFavorite,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      confirmDelivery,
    },
    children: children,
  });
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return ctx;
}
