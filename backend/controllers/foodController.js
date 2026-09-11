import Food from "../models/foodModel.js";
import cloudinary, { configureCloudinary } from "../config/cloudinary.js";

const FOOD_TYPES = ["RICE", "SWALLOW", "BEANS", "YAM", "SIDE", "SNACK", "DRINK", "SIMPLE"];
const FOOD_ROLES = ["main", "side", "protein", "standalone"];
const CATEGORY_BY_TYPE = {
    RICE: "Rice & Meals",
    SWALLOW: "Swallows",
    BEANS: "Beans",
    YAM: "Yam & Pottage",
    SIDE: "Sides",
    SNACK: "Snacks",
    DRINK: "Drinks",
    SIMPLE: "Snacks",
};

const deriveFoodRole = (foodType, explicitRole) => {
    const normalizedRole = String(explicitRole || "").trim().toLowerCase();
    if (FOOD_ROLES.includes(normalizedRole)) return normalizedRole;

    const type = String(foodType || "SIMPLE").toUpperCase();
    if (["RICE", "SWALLOW", "BEANS", "YAM"].includes(type)) return "main";
    if (["SNACK", "DRINK"].includes(type)) return "standalone";
    return "side";
};

const parseBoolean = (value, fallback = true) => {
    if (value === undefined || value === null || value === "") return fallback;
    return value === true || value === "true";
};

const normalizeOptions = (options) => {
    if (!Array.isArray(options)) return [];
    return options
        .map((option) => {
            const imageUrl = String(option?.image || option?.imageUrl || option?.img || "").trim();
            return {
                ...option,
                name: String(option?.name || "").trim(),
                price: Number(option?.price || 0),
                image: imageUrl,
                imageUrl,
                img: imageUrl,
                available: parseBoolean(option?.available, true),
            };
        })
        .filter((option) => option.name && !Number.isNaN(option.price) && option.price >= 0);
};

const parseConfiguration = (body) => {
    const raw = typeof body.configuration === "string"
        ? JSON.parse(body.configuration || "{}")
        : body.configuration || {};

    return {
        portionLabel: String(raw.portionLabel || body.portionLabel || "portion").trim(),
        minQuantity: Number(raw.minQuantity || body.minQuantity || 1),
        maxQuantity: Number(raw.maxQuantity || body.maxQuantity || 20),
        defaultQuantity: Number(raw.defaultQuantity || body.defaultQuantity || 1),
        allowMultipleMainBases: parseBoolean(raw.allowMultipleMainBases ?? body.allowMultipleMainBases, false),
        minMainBases: Number(raw.minMainBases || body.minMainBases || 1),
        maxMainBases: Number(raw.maxMainBases || body.maxMainBases || 1),
        proteins: normalizeOptions(raw.proteins),
        riceBases: normalizeOptions(raw.riceBases),
        swallowBases: normalizeOptions(raw.swallowBases),
        sides: normalizeOptions(raw.sides),
        soups: normalizeOptions(raw.soups),
        extras: normalizeOptions(raw.extras),
        variants: normalizeOptions(raw.variants),
    };
};

const getFoodPayload = (body) => {
    const foodType = String(body.foodType || body.type || "SIMPLE").toUpperCase();
    if (!FOOD_TYPES.includes(foodType))
    {
        throw new Error("Invalid food type");
    }

    const role = deriveFoodRole(foodType, body.role);

    return {
        foodType,
        role,
        allowStandalone: parseBoolean(body.allowStandalone, role === "standalone"),
        published: parseBoolean(body.published, true),
        configuration: parseConfiguration(body),
    };
};

const normalizeLegacyFoodRecord = (food) => {
    if (!food) return food;

    const plainFood = food.toObject ? food.toObject() : { ...food };
    const normalizedType = String(plainFood.foodType || plainFood.type || "SIMPLE").toUpperCase();
    const safeType = FOOD_TYPES.includes(normalizedType) ? normalizedType : "SIMPLE";
    const normalizedConfiguration = plainFood.configuration && typeof plainFood.configuration === "object"
        ? plainFood.configuration
        : {};

    const role = deriveFoodRole(safeType, plainFood.role);

    const normalizeOptionList = (list = []) =>
        Array.isArray(list)
            ? list.map((option) => {
                const imageUrl = String(option?.image || option?.imageUrl || option?.img || "").trim();
                return {
                    ...option,
                    image: imageUrl,
                    imageUrl,
                    img: imageUrl,
                };
            })
            : [];

    return {
        ...plainFood,
        foodType: safeType,
        role,
        allowStandalone: plainFood.allowStandalone === true || role === "standalone",
        category: plainFood.category || CATEGORY_BY_TYPE[safeType] || "Snacks",
        published: plainFood.published !== false,
        available: plainFood.available !== false,
        price: Number(plainFood.price || 0),
        configuration: {
            portionLabel: normalizedConfiguration.portionLabel || (safeType === "SWALLOW" ? "wrap" : "portion"),
            minQuantity: Number(normalizedConfiguration.minQuantity || 1),
            maxQuantity: Number(normalizedConfiguration.maxQuantity || 20),
            defaultQuantity: Number(normalizedConfiguration.defaultQuantity || 1),
            allowMultipleMainBases: normalizedConfiguration.allowMultipleMainBases === true,
            minMainBases: Number(normalizedConfiguration.minMainBases || 1),
            maxMainBases: Number(normalizedConfiguration.maxMainBases || 1),
            proteins: normalizeOptionList(normalizedConfiguration.proteins),
            riceBases: normalizeOptionList(normalizedConfiguration.riceBases),
            swallowBases: normalizeOptionList(normalizedConfiguration.swallowBases),
            sides: normalizeOptionList(normalizedConfiguration.sides),
            soups: normalizeOptionList(normalizedConfiguration.soups),
            extras: normalizeOptionList(normalizedConfiguration.extras),
            variants: normalizeOptionList(normalizedConfiguration.variants),
        },
    };
};

const uploadImageIfNeeded = async (req, image) => {
    if (!req.file || image) return image;

    const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    configureCloudinary();
    const result = await cloudinary.uploader.upload(base64String, { folder: "food_app" });
    return result.secure_url;
};

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
    try
    {
        const foods = await Food.find();
        res.json(foods.map(normalizeLegacyFoodRecord));
    } catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single food item by ID
// @route   GET /api/foods/:id
// @access  Public
const getFoodById = async (req, res) => {
    try
    {
        const food = await Food.findById(req.params.id);
        if (!food)
        {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.json(normalizeLegacyFoodRecord(food));
    } catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new food item
// @route   POST /api/foods
// @access  Private (Admin)
const createFood = async (req, res) => {
    try
    {
        const name = req.body.name?.trim();
        const description = req.body.description?.trim();
        const category = req.body.category?.trim();
        const { price, available } = req.body;
        const popular = parseBoolean(req.body.popular, false);
        const preparationTime = Number(req.body.preparationTime || 0);
        let image = req.body.image?.trim();
        const domainPayload = getFoodPayload(req.body);

        const missingFields = [];
        if (!name) missingFields.push("name");
        if (!description) missingFields.push("description");
        if (price === undefined || price === null || price === "") missingFields.push("price");
        if (!image && !req.file) missingFields.push("image");
        if (!category) missingFields.push("category");

        if (missingFields.length > 0)
        {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        const numericPrice = Number(price);
        if (Number.isNaN(numericPrice) || numericPrice < 0)
        {
            return res.status(400).json({ message: "Price must be a valid number" });
        }

        if (Number.isNaN(preparationTime) || preparationTime < 0)
        {
            return res.status(400).json({ message: "Preparation time must be a valid number" });
        }

        try
        {
            image = await uploadImageIfNeeded(req, image);
        } catch (err)
        {
            console.error("Cloudinary upload failed", err);
            return res.status(500).json({ message: "Image upload failed" });
        }

        const ingredients = Array.isArray(req.body.ingredients)
            ? req.body.ingredients.map((s) => String(s).trim()).filter(Boolean)
            : typeof req.body.ingredients === "string"
                ? req.body.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
                : [];

        const createdFood = await Food.create({
            name,
            description,
            price: numericPrice,
            image,
            category: category || CATEGORY_BY_TYPE[domainPayload.foodType] || "Snacks",
            preparationTime,
            available: parseBoolean(available, true),
            additionalInfo: req.body.additionalInfo?.trim() || "",
            ingredients,
            popular,
            ...domainPayload,
        });
        res.status(201).json(normalizeLegacyFoodRecord(createdFood));
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private (Admin)
const updateFood = async (req, res) => {
    try
    {
        const food = await Food.findById(req.params.id);

        if (!food)
        {
            return res.status(404).json({ message: "Food item not found" });
        }

        if (req.body.price !== undefined)
        {
            const numericPrice = Number(req.body.price);
            if (Number.isNaN(numericPrice) || numericPrice < 0)
            {
                return res.status(400).json({ message: "Price must be a valid number" });
            }
            food.price = numericPrice;
        }

        if (req.body.preparationTime !== undefined)
        {
            const numericPreparationTime = Number(req.body.preparationTime);
            if (Number.isNaN(numericPreparationTime) || numericPreparationTime < 0)
            {
                return res.status(400).json({ message: "Preparation time must be a valid number" });
            }
            food.preparationTime = numericPreparationTime;
        }

        let image = req.body.image?.trim();
        try
        {
            image = await uploadImageIfNeeded(req, image);
        } catch (err)
        {
            console.error("Cloudinary upload failed", err);
            return res.status(500).json({ message: "Image upload failed" });
        }

        const ingredients = Array.isArray(req.body.ingredients)
            ? req.body.ingredients.map((s) => String(s).trim()).filter(Boolean)
            : typeof req.body.ingredients === "string"
                ? req.body.ingredients.split(",").map((s) => s.trim()).filter(Boolean)
                : undefined;

        if (req.body.name?.trim()) food.name = req.body.name.trim();
        if (req.body.description?.trim()) food.description = req.body.description.trim();
        if (req.body.category?.trim()) food.category = req.body.category.trim();
        if (image) food.image = image;
        if (ingredients !== undefined) food.ingredients = ingredients;
        if (req.body.additionalInfo !== undefined) food.additionalInfo = req.body.additionalInfo?.trim() || "";
        if (req.body.available !== undefined) food.available = parseBoolean(req.body.available, true);
        if (req.body.popular !== undefined) food.popular = parseBoolean(req.body.popular, false);
        if (req.body.published !== undefined) food.published = parseBoolean(req.body.published, true);

        if (req.body.foodType !== undefined || req.body.configuration !== undefined || req.body.role !== undefined || req.body.allowStandalone !== undefined)
        {
            const domainPayload = getFoodPayload(req.body);
            food.foodType = domainPayload.foodType;
            food.role = domainPayload.role;
            food.allowStandalone = domainPayload.allowStandalone;
            food.configuration = domainPayload.configuration;
            food.published = domainPayload.published;
        }

        await food.save();
        res.status(200).json(normalizeLegacyFoodRecord(food));
    } catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private (Admin)
const deleteFood = async (req, res) => {
    try
    {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood)
        {
            return res.status(404).json({ message: "Food item not found" });
        }
        res.json({ message: "Food item deleted", food: deletedFood });
    } catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export { getFoods, getFoodById, createFood, updateFood, deleteFood };
