export const CONFIGURABLE_TYPES = ["RICE", "SWALLOW", "BEANS", "YAM"];
export const FOOD_ROLES = ["main", "side", "protein", "standalone"];

export const getFoodRole = (food = {}) => {
  const role = String(food.role || "").trim().toLowerCase();
  if (FOOD_ROLES.includes(role)) return role;
  if (CONFIGURABLE_TYPES.includes(food.foodType)) return "main";
  if (["SNACK", "DRINK", "SIDE", "SIMPLE"].includes(food.foodType)) return "standalone";
  return "side";
};

export const isMainMealFood = (food = {}) => {
  const role = getFoodRole(food);
  return role === "main" || (CONFIGURABLE_TYPES.includes(food.foodType) && role !== "side" && role !== "protein");
};

export const canOrderStandalone = (food = {}) => {
  const role = getFoodRole(food);
  if (role === "standalone" || food.allowStandalone) return true;
  if (role === "main") return true;
  return ["SNACK", "DRINK", "SIDE", "SIMPLE"].includes(food.foodType);
};

export const isConfigurableFood = (food = {}) =>
  CONFIGURABLE_TYPES.includes(food.foodType) && isMainMealFood(food);

export const isSimpleFood = (food = {}) => !isConfigurableFood(food);

export const getFoodTypeLabel = (food = {}) => {
  const labels = {
    RICE: "Rice plate",
    SWALLOW: "Swallow plate",
    BEANS: "Beans plate",
    YAM: "Yam plate",
    SIDE: "Side",
    SNACK: "Snack",
    DRINK: "Drink",
    SIMPLE: "Menu item",
  };
  return labels[food.foodType] || "Menu item";
};

export const createDefaultConfiguration = (food = {}) => {
  const config = food.configuration || {};
  const defaultQuantity = Number(config.defaultQuantity || 1);

  if (food.foodType === "SWALLOW")
  {
    return {
      wraps: defaultQuantity,
      soup: config.soups?.find((option) => option?.available !== false)?.name || config.soups?.[0]?.name || null,
      proteins: [],
      sides: [],
      extras: [],
    };
  }

  if (isConfigurableFood(food))
  {
    if (food.foodType === "RICE" && config.riceBases?.length)
    {
      return {
        riceBases: [{ name: config.riceBases[0].name, quantity: defaultQuantity }],
        proteins: [],
        sides: [],
        extras: [],
      };
    }

    return {
      portions: defaultQuantity,
      proteins: [],
      sides: [],
      extras: [],
    };
  }

  if (food.foodType === "DRINK" && config.variants?.length)
  {
    return { variant: config.variants[0].name };
  }

  return {};
};

const findOption = (options = [], name) =>
  options.find((option) => option.name === name);

const listTotal = (items = [], options = []) =>
  items.reduce((sum, item) => {
    const option = findOption(options, item.name);
    return sum + Number(option?.price || 0) * Number(item.quantity || 0);
  }, 0);

export const calculateCartItemTotal = (food = {}, quantity = 1, configuration = {}) => {
  const config = food.configuration || {};
  const basePrice = Number(food.price || 0);

  if (food.foodType === "DRINK" && configuration.variant)
  {
    const variant = findOption(config.variants, configuration.variant);
    return Number(variant?.price ?? basePrice) * quantity;
  }

  if (!isConfigurableFood(food)) return basePrice * quantity;

  if (food.foodType === "RICE" && configuration.riceBases?.length)
  {
    return (
      listTotal(configuration.riceBases || [], config.riceBases) +
      listTotal(configuration.proteins || [], config.proteins) +
      listTotal(configuration.sides || [], config.sides) +
      listTotal(configuration.extras || [], config.extras)
    );
  }

  const servingCount = Number(
    food.foodType === "SWALLOW" ? configuration.wraps : configuration.portions,
  ) || Number(config.defaultQuantity || 1);
  const soup = food.foodType === "SWALLOW"
    ? findOption(config.soups, configuration.soup)
    : null;

  if (food.foodType === "SWALLOW")
  {
    return (
      Number(food.price ?? basePrice) * servingCount +
      Number(soup?.price || 0) +
      listTotal(configuration.proteins || [], config.proteins) +
      listTotal(configuration.sides || [], config.sides) +
      listTotal(configuration.extras || [], config.extras)
    );
  }

  return (
    basePrice * servingCount +
    Number(soup?.price || 0) +
    listTotal(configuration.proteins || [], config.proteins) +
    listTotal(configuration.sides || [], config.sides) +
    listTotal(configuration.extras || [], config.extras)
  );
};

export const summarizeConfiguration = (configuration = {}, food = {}) => {
  const parts = [];
  if (configuration.portions)
  {
    const label = food.configuration?.portionLabel || "portion";
    parts.push(`${configuration.portions} ${label}${configuration.portions > 1 ? "s" : ""}`);
  }
  if (configuration.riceBases?.length)
  {
    configuration.riceBases.forEach((item) => {
      const qty = Number(item.quantity || 1);
      parts.push(`${item.name} ${qty} ${qty > 1 ? "portions" : "portion"}`);
    });
  }
  if (configuration.wraps)
  {
    parts.push(`${configuration.wraps} wrap${configuration.wraps > 1 ? "s" : ""}`);
  }
  if (configuration.swallowBases?.length)
  {
    configuration.swallowBases.forEach((item) => {
      parts.push(`${item.name}${Number(item.quantity || 1) > 1 ? ` x ${item.quantity}` : ""}`);
    });
  }
  if (configuration.soup?.name || configuration.soup)
  {
    parts.push(configuration.soup?.name || configuration.soup);
  }
  if (configuration.variant?.name || configuration.variant)
  {
    parts.push(configuration.variant?.name || configuration.variant);
  }

  ["proteins", "sides", "extras"].forEach((key) => {
    (configuration[key] || []).forEach((item) => {
      const qty = Number(item.quantity || 1);
      parts.push(`${item.name}${qty > 1 ? ` x ${qty}` : ""}`);
    });
  });

  return parts;
};

export const makeCartItemId = (food = {}, configuration = {}, quantity = 1) => {
  const foodId = food._id || food.id;
  if (!isConfigurableFood(food) && food.foodType !== "DRINK") return foodId;
  return `${foodId}:${JSON.stringify(configuration)}:${isConfigurableFood(food) ? 1 : quantity}`;
};

export const getFoodOptionPreviews = (food = {}) => {
  const config = food.configuration || {};
  const groups = [
    config.riceBases || [],
    config.proteins || [],
    config.sides || [],
    config.soups || [],
    config.extras || [],
    config.variants || [],
  ];

  const previews = [];
  const seen = new Set();

  groups.forEach((items = []) => {
    (items || []).forEach((option) => {
      if (!option || !option.name || option.available === false) return;
      const image = option.image || option.imageUrl || option.img || "";
      if (!image || seen.has(image)) return;
      seen.add(image);
      previews.push({
        name: option.name,
        image,
      });
    });
  });

  return previews.slice(0, 5);
};

export const getCustomerVisibleMenuItems = (food = []) => {
  const source = Array.isArray(food) ? food : [food];

  return source.flatMap((item) => {
    if (!item) return [item];
    if (item.foodType !== "SWALLOW") return [item];

    return [item];
  });
};
