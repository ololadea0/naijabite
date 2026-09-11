export const INPUT_CLASS =
    "w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400";
export const FIELD_LABEL =
    "block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide";
export const PRIMARY_BUTTON =
    "h-11 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors";
export const SECONDARY_BUTTON =
    "h-11 px-5 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors";
export const createBlankFoodForm = () => ({
    name: "",
    category: "Rice & Meals",
    foodType: "SIMPLE",
    role: "main",
    allowStandalone: false,
    price: 0,
    description: "",
    ingredients: [],
    imageUrl: "",
    imageFile: null,
    available: true,
    popular: false,
    published: true,
    configuration: {
        portionLabel: "portion",
        minQuantity: 1,
        maxQuantity: 20,
        defaultQuantity: 1,
        allowMultipleMainBases: false,
        minMainBases: 1,
        maxMainBases: 1,
        riceBases: [],
        swallowBases: [],
        proteins: [],
        sides: [],
        soups: [],
        extras: [],
        variants: [],
    },
});
