import mongoose from "mongoose";

const pricedOptionSchema = mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, default: 0 },
        image: { type: String, default: "" },
        imageUrl: { type: String, default: "" },
        img: { type: String, default: "" },
        available: { type: Boolean, default: true },
    },
    { _id: false }
);

const foodConfigurationSchema = mongoose.Schema(
    {
        portionLabel: { type: String, default: "portion" },
        minQuantity: { type: Number, default: 1 },
        maxQuantity: { type: Number, default: 20 },
        defaultQuantity: { type: Number, default: 1 },
        allowMultipleMainBases: { type: Boolean, default: false },
        minMainBases: { type: Number, default: 1 },
        maxMainBases: { type: Number, default: 1 },
        proteins: { type: [pricedOptionSchema], default: [] },
        riceBases: { type: [pricedOptionSchema], default: [] },
        swallowBases: { type: [pricedOptionSchema], default: [] },
        sides: { type: [pricedOptionSchema], default: [] },
        soups: { type: [pricedOptionSchema], default: [] },
        extras: { type: [pricedOptionSchema], default: [] },
        variants: { type: [pricedOptionSchema], default: [] },
    },
    { _id: false }
);

const foodSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        popular: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            required: true,
            default: "Rice & Meals"
        },
        foodType: {
            type: String,
            enum: ["RICE", "SWALLOW", "BEANS", "YAM", "SIDE", "SNACK", "DRINK", "SIMPLE"],
            default: "SIMPLE",
        },
        role: {
            type: String,
            enum: ["main", "side", "protein", "standalone"],
            default: function () {
                const type = String(this.foodType || "SIMPLE").toUpperCase();
                if (["RICE", "SWALLOW", "BEANS", "YAM"].includes(type)) return "main";
                if (["SNACK", "DRINK"].includes(type)) return "standalone";
                return "side";
            },
        },
        allowStandalone: {
            type: Boolean,
            default: false,
        },
        published: {
            type: Boolean,
            default: true,
        },
        configuration: {
            type: foodConfigurationSchema,
            default: () => ({}),
        },
        preparationTime: {
            type: Number,
            default: 0
        },

        available: {
            type: Boolean,
            default: true
        },
        ingredients: {
            type: [String],
            default: [],
        },
        additionalInfo: {
            type: String,
            default: ""
        }
    }, {
    timestamps: true
}
);
const Food = mongoose.model("Food", foodSchema);
export default Food;
