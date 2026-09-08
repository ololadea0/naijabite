export const FALLBACK_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

export const getFoodId = (food = {}) => food._id || food.id;

export const getFoodImage = (food = {}, size) => {
  const src = food.image || food.imageUrl || FALLBACK_FOOD_IMAGE;
  return size && typeof src === "string"
    ? src.replace("w=600&h=450", size)
    : src;
};

export const formatCurrency = (value = 0) =>
  `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const normalizePhoneInput = (value = "") => {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "").slice(0, hasPlus ? 13 : 11);
  return hasPlus ? `+${digits}` : digits;
};

export const isValidNigerianPhone = (value = "") => {
  const digits = value.replace(/\D/g, "");
  return /^0[789][01]\d{8}$/.test(digits) || /^234[789][01]\d{8}$/.test(digits);
};

export const formatDeliveryAddress = (deliveryAddress = {}) => {
  if (typeof deliveryAddress === "string") return deliveryAddress;
  const addr = deliveryAddress.address
    ? deliveryAddress.address + (deliveryAddress.landmark ? ` (${deliveryAddress.landmark})` : "")
    : "";
  return [
    addr,
    deliveryAddress.city,
    "Nigeria",
  ]
    .filter(Boolean)
    .join(", ");
};

export const normalizeAddress = (value = "") => {
  if (!value) return "";
  let s = String(value || "").trim();
  // remove URLs
  s = s.replace(/https?:\/\/\S+/gi, "");
  // remove control chars
  s = s.replace(/[\x00-\x1F\x7F]/g, "");
  // remove many emoji ranges
  s = s.replace(/[\u{1F300}-\u{1F9FF}]/gu, "");
  // collapse whitespace
  s = s.replace(/\s+/g, " ");
  // trim to reasonable length
  s = s.slice(0, 200).trim();
  // basic title case
  s = s
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
  return s;
};
