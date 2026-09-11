const CONFIGURABLE_TYPES = new Set(["RICE", "SWALLOW", "BEANS", "YAM"]);

const clampQuantity = (value, fallback = 1) => {
    const numeric = Number(value ?? fallback);
    if (!Number.isInteger(numeric) || numeric <= 0 || numeric > 100)
    {
        return null;
    }
    return numeric;
};

const optionMap = (options = []) => {
    const map = new Map();
    options
        .filter((option) => option?.available !== false)
        .forEach((option) => map.set(String(option.name).toLowerCase(), option));
    return map;
};

const normalizeNamedList = (items = []) => {
    if (!Array.isArray(items)) return [];
    return items
        .map((item) => {
            if (!item || !item.name) return null;
            const quantity = clampQuantity(item.quantity ?? 1, 1);
            if (!quantity) return null;
            return {
                name: String(item.name).trim(),
                quantity,
                price: Number(item.price || 0),
                totalPrice: Number(item.price || 0) * quantity,
            };
        })
        .filter(Boolean);
};

const normalizeSelections = (selections = [], available = [], label = "option") => {
    if (!Array.isArray(selections)) return [];

    const availableMap = optionMap(available);

    return selections
        .map((selection) => {
            const name = typeof selection === "string" ? selection : selection?.name;
            if (!name) return null;

            const option = availableMap.get(String(name).toLowerCase());
            if (!option)
            {
                throw new Error(`Invalid ${label}: ${name}`);
            }

            const quantity = clampQuantity(
                typeof selection === "string" ? 1 : selection.quantity,
                1
            );
            if (!quantity)
            {
                throw new Error(`Invalid quantity for ${label}: ${name}`);
            }

            return {
                name: option.name,
                quantity,
                price: Number(option.price || 0),
                totalPrice: Number(option.price || 0) * quantity,
            };
        })
        .filter(Boolean);
};

const normalizeSingleSelection = (selection, available = [], label = "option") => {
    if (!selection) return null;
    const name = typeof selection === "string" ? selection : selection.name;
    if (!name) return null;

    const option = optionMap(available).get(String(name).toLowerCase());
    if (!option)
    {
        throw new Error(`Invalid ${label}: ${name}`);
    }

    return {
        name: option.name,
        quantity: 1,
        price: Number(option.price || 0),
        totalPrice: Number(option.price || 0),
    };
};

export const isConfigurableFood = (food) => CONFIGURABLE_TYPES.has(food?.foodType);

export const priceOrderItem = (food, item = {}) => {
    const configuration = food.configuration || {};
    const selected = item.configuration || {};
    const foodType = food.foodType || "SIMPLE";
    const basePrice = Number(food.price || 0);
    const minQuantity = Number(configuration.minQuantity || 1);
    const maxQuantity = Number(configuration.maxQuantity || 100);
    const defaultQuantity = Number(configuration.defaultQuantity || 1);

    let servingQuantity = clampQuantity(item.qty, 1);
    let cartQuantity = servingQuantity;
    let normalizedConfiguration = {};

    if (!servingQuantity)
    {
        throw new Error("Invalid quantity for item. Must be between 1 and 100");
    }

    if (CONFIGURABLE_TYPES.has(foodType))
    {
        const quantityKey = foodType === "SWALLOW" ? "wraps" : "portions";
        const riceBases = foodType === "RICE"
            ? normalizeSelections(selected.riceBases, configuration.riceBases, "rice")
            : [];
        const maxMainBases = Number(configuration.maxMainBases || 1);
        const minMainBases = Number(configuration.minMainBases || 1);

        servingQuantity = foodType === "RICE" && riceBases.length
            ? riceBases.reduce((sum, option) => sum + option.quantity, 0)
            : clampQuantity(selected[quantityKey], defaultQuantity);
        cartQuantity = 1;

        if (!servingQuantity || servingQuantity < minQuantity || servingQuantity > maxQuantity)
        {
            throw new Error(`Invalid ${configuration.portionLabel || quantityKey} quantity`);
        }

        if (foodType === "RICE")
        {
            const selectedRiceBaseCount = riceBases.filter((option) => Number(option.quantity || 0) > 0).length;
            if (configuration.riceBases?.length && !selectedRiceBaseCount)
            {
                throw new Error("Please choose at least one rice portion");
            }
            if (selectedRiceBaseCount < minMainBases)
            {
                throw new Error(`Please choose at least ${minMainBases} rice base${minMainBases > 1 ? "s" : ""}`);
            }
            if (maxMainBases > 0 && selectedRiceBaseCount > maxMainBases)
            {
                throw new Error(`You can choose up to ${maxMainBases} rice base${maxMainBases > 1 ? "s" : ""}`);
            }
            normalizedConfiguration.riceBases = riceBases;
            if (!riceBases.length) normalizedConfiguration.portions = servingQuantity;
        } else
        {
            normalizedConfiguration[quantityKey] = servingQuantity;
        }

        if (foodType === "SWALLOW")
        {
            const soup = normalizeSingleSelection(selected.soup, configuration.soups, "soup");
            if (configuration.soups?.length && !soup)
            {
                throw new Error("Please choose a soup");
            }
            normalizedConfiguration.soup = soup;
        }

        normalizedConfiguration.proteins = normalizeSelections(selected.proteins, configuration.proteins, "protein");
        normalizedConfiguration.sides = normalizeSelections(selected.sides, configuration.sides, "side");
        normalizedConfiguration.extras = normalizeSelections(selected.extras, configuration.extras, "extra");
    } else if (foodType === "DRINK")
    {
        const variant = normalizeSingleSelection(selected.variant, configuration.variants, "size");
        normalizedConfiguration.variant = variant;
    }

    const selectedVariant = normalizedConfiguration.variant;
    const unitPrice = selectedVariant ? selectedVariant.price : basePrice;
    const riceBaseTotal = (normalizedConfiguration.riceBases || [])
        .reduce((sum, option) => sum + Number(option.totalPrice || 0), 0);
    const baseTotal = CONFIGURABLE_TYPES.has(foodType)
        ? (foodType === "RICE" && riceBaseTotal > 0 ? riceBaseTotal : basePrice * servingQuantity)
        : unitPrice * cartQuantity;

    const optionTotal = [
        normalizedConfiguration.soup,
        ...(normalizedConfiguration.proteins || []),
        ...(normalizedConfiguration.sides || []),
        ...(normalizedConfiguration.extras || []),
    ]
        .filter(Boolean)
        .reduce((sum, option) => sum + Number(option.totalPrice || 0), 0);

    const totalPrice = baseTotal + optionTotal;

    return {
        food: food._id,
        qty: cartQuantity,
        configuration: normalizedConfiguration,
        unitPrice,
        price: CONFIGURABLE_TYPES.has(foodType) ? totalPrice : unitPrice,
        totalPrice,
        nameSnapshot: food.name,
        imageSnapshot: food.image,
    };
};

export const summarizeOrderConfiguration = (configuration = {}, food = {}) => {
    if (!food || !configuration) return [];
    const parts = [];
    const config = food.configuration || {};

    if (configuration.portions) parts.push(`${configuration.portions} ${config.portionLabel || "portion"}${configuration.portions > 1 ? "s" : ""}`);
    if (Array.isArray(configuration.riceBases) && configuration.riceBases.length)
    {
        configuration.riceBases.forEach((base) => {
            const qty = Number(base.quantity || 1);
            parts.push(`${base.name}${qty > 1 ? ` × ${qty}` : ""}`);
        });
    }
    if (configuration.wraps) parts.push(`${configuration.wraps} wrap${configuration.wraps > 1 ? "s" : ""}`);
    if (configuration.soup?.name || configuration.soup) parts.push(configuration.soup?.name || configuration.soup);
    if (configuration.variant?.name || configuration.variant) parts.push(configuration.variant?.name || configuration.variant);

    ["proteins", "sides", "extras"].forEach((key) => {
        (configuration[key] || []).forEach((item) => {
            const qty = Number(item.quantity || 1);
            parts.push(`${item.name}${qty > 1 ? ` × ${qty}` : ""}`);
        });
    });

    return parts;
};
