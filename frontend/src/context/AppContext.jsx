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
  readCartFromStorage,
  persistCartToStorage,
  serializeStatus,
} from "./appContextHelpers";
import { calculateCartItemTotal, makeCartItemId } from "../lib/mealConfig";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const foodStatus = useSelector((state) => state.food.status);
  const rawOrders = useSelector((state) => state.orders.items || []);
  const orders = useMemo(() => rawOrders.map(normalizeOrder), [rawOrders]);

  const getCartItemId = useCallback(
    (itemOrFood) =>
      itemOrFood?.cartItemId ||
      makeCartItemId(
        itemOrFood?.food || itemOrFood,
        itemOrFood?.configuration || {},
        itemOrFood?.quantity || 1,
      ),
    [],
  );

  const [cart, setCart] = useState(() => readCartFromStorage());

  useEffect(() => {
    persistCartToStorage(cart);
  }, [cart]);
  const [favorites, setFavorites] = useState([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce(
    (s, i) =>
      s +
      Number(
        i.totalPrice ??
          calculateCartItemTotal(i.food, i.quantity, i.configuration || {}),
      ),
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
    (foodOrCartItem, qty = 1) => {
      const nextItem = foodOrCartItem?.food
        ? foodOrCartItem
        : { food: foodOrCartItem, quantity: qty, configuration: {} };

      const cartItem = {
        ...nextItem,
        quantity: nextItem.quantity || qty,
        configuration: nextItem.configuration || {},
      };
      cartItem.totalPrice = calculateCartItemTotal(
        cartItem.food,
        cartItem.quantity,
        cartItem.configuration,
      );
      cartItem.cartItemId = makeCartItemId(
        cartItem.food,
        cartItem.configuration,
        cartItem.quantity,
      );

      const itemId = getCartItemId(cartItem);
      setCart((prev) => {
        const existing = prev.find((i) => getCartItemId(i) === itemId);
        if (existing) {
          return prev.map((i) => {
            if (getCartItemId(i) !== itemId) return i;
            const quantity = i.quantity + cartItem.quantity;
            return {
              ...i,
              quantity,
              totalPrice: calculateCartItemTotal(
                i.food,
                quantity,
                i.configuration || {},
              ),
            };
          });
        }
        return [...prev, cartItem];
      });
    },
    [getCartItemId],
  );

  const removeFromCart = useCallback(
    (cartItemId) => {
      setCart((prev) => prev.filter((i) => getCartItemId(i) !== cartItemId));
    },
    [getCartItemId],
  );

  const updateCartQty = useCallback(
    (cartItemId, qty) => {
      if (qty <= 0) {
        setCart((prev) => prev.filter((i) => getCartItemId(i) !== cartItemId));
        return;
      }

      setCart((prev) =>
        prev.map((i) =>
          getCartItemId(i) === cartItemId
            ? {
                ...i,
                quantity: qty,
                totalPrice: calculateCartItemTotal(
                  i.food,
                  qty,
                  i.configuration || {},
                ),
              }
            : i,
        ),
      );
    },
    [getCartItemId],
  );

  const updateCartItem = useCallback(
    (cartItemId, updates) => {
      setCart((prev) =>
        prev.map((item) => {
          if (getCartItemId(item) !== cartItemId) return item;
          const next = { ...item, ...updates };
          next.totalPrice = calculateCartItemTotal(
            next.food,
            next.quantity,
            next.configuration || {},
          );
          next.cartItemId = makeCartItemId(
            next.food,
            next.configuration || {},
            next.quantity,
          );
          return next;
        }),
      );
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
        orderItems: cart.map(({ food, quantity, configuration }) => ({
          food: food._id || food.id,
          qty: quantity,
          configuration: configuration || {},
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
      updateCartItem,
      clearCart,
      toggleFavorite,
      placeOrder,
      updateOrderStatus,
      cancelOrder,
      confirmDelivery,
      getCartItemId,
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
