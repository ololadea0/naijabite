import { isValidNigerianPhone, normalizeAddress, normalizePhoneInput } from "../../lib/formatters";

export const DEFAULT_DELIVERY_FEE = 2.5;

export const buildDeliveryDetailsFromUser = (user) => ({
    address: normalizeAddress(user?.deliveryAddress?.address || user?.address || ""),
    landmark: normalizeAddress(user?.deliveryAddress?.landmark || ""),
    city: user?.deliveryAddress?.city || user?.city || "",
    state: user?.deliveryAddress?.state || user?.state || "",
    phone: normalizePhoneInput(user?.deliveryAddress?.phone || user?.phone || ""),
});

export const validateDeliveryDetails = (deliveryDetails) => {
    const errors = {};

    if (!deliveryDetails.address.trim())
    {
        errors.address = "Street address is required.";
    }

    if (!deliveryDetails.city.trim())
    {
        errors.city = "LGA is required.";
    }

    if (!deliveryDetails.phone.trim())
    {
        errors.phone = "Phone number is required.";
    } else if (!isValidNigerianPhone(deliveryDetails.phone))
    {
        errors.phone = "Enter a valid Nigerian phone number.";
    }

    return errors;
};
