import { formatDeliveryAddress, getFoodImage } from "../lib/formatters";

export const normalizeStatus = (status) => {
    const value = (status || "pending").toString().trim();
    const map = {
        pending: "Pending",
        ontheway: "Out for Delivery",
        availableforpickup: "Available for Pickup",
        preparing: "Preparing",
        delivered: "Delivered",
        cancelled: "Cancelled",
        confirmed: "Confirmed",
    };

    return (
        map[value.toLowerCase()] ||
        value.charAt(0).toUpperCase() + value.slice(1)
    );
};

export const serializeStatus = (status) => {
    const map = {
        Pending: "pending",
        Confirmed: "confirmed",
        Preparing: "preparing",
        "Out for Delivery": "onTheWay",
        "Available for Pickup": "availableForPickup",
        Delivered: "delivered",
        Cancelled: "cancelled",
    };

    return map[status] || status;
};

export const normalizeOrder = (order = {}) => {
    const id = order._id || order.id;
    const status = normalizeStatus(order.status);
    const total = Number(order.totalPrice ?? order.total ?? 0);
    const orderItems = Array.isArray(order.orderItems)
        ? order.orderItems
        : Array.isArray(order.items)
            ? order.items
            : [];
    const rawDeliveryAddress =
        order.deliveryAddress ||
        order.deliveryAddressDetails ||
        order.user?.deliveryAddress ||
        order.customer?.deliveryAddress ||
        {};
    const customerPhone =
        order.user?.phone ||
        order.user?.deliveryAddress?.phone ||
        order.customer?.phone ||
        order.customer?.deliveryAddress?.phone ||
        rawDeliveryAddress.phone ||
        "";
    const customer =
        order.user && typeof order.user === "object"
            ? {
                name: order.user.name || "Customer",
                email: order.user.email || "",
                phone: customerPhone,
            }
            : {
                name: order.customer?.name || "Customer",
                email: order.customer?.email || "",
                phone: customerPhone,
            };

    return {
        ...order,
        id,
        status,
        total,
        subtotal: Number(
            order.subtotal ?? Math.max(0, total - Number(order.deliveryFee ?? 0)),
        ),
        deliveryFee: Number(order.deliveryFee ?? 0),
        paymentStatus: order.isPaid ? "Paid" : "Pending",
        deliveryAddress: formatDeliveryAddress(rawDeliveryAddress),
        deliveryAddressDetails: rawDeliveryAddress,
        customer,
        items: orderItems.map((item) => {
            const food = item.food || {};
            const foodId = food._id || food.id || item.foodId || item.id;
            const hasFoodImage = Boolean(food.image || food.imageUrl);

            return {
                ...item,
                id: foodId,
                name: food.name || item.name || "Menu item",
                imageUrl: hasFoodImage
                    ? getFoodImage(food, "w=120&h=120")
                    : item.imageUrl || null,
                price: Number(item.price ?? food.price ?? item.totalPrice ?? 0),
                quantity: item.qty ?? item.quantity ?? 1,
            };
        }),
    };
};

export const readCartFromStorage = () => {
    try
    {
        const raw = localStorage.getItem("cart");
        return raw ? JSON.parse(raw) : [];
    } catch (error)
    {
        return [];
    }
};

export const persistCartToStorage = (cart) => {
    try
    {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error)
    {
        // ignore storage errors
    }
};
