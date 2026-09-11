import { useState } from "react";
import { useApp } from "../context/AppContext";
import { formatCurrency, getFoodId, getFoodImage } from "../lib/formatters";
import {
  canOrderStandalone,
  getFoodOptionPreviews,
  getFoodRole,
  isConfigurableFood,
} from "../lib/mealConfig";
import MealConfigurator from "./MealConfigurator";

export default function FoodCard({ food, navigate }) {
  const { addToCart, toggleFavorite, favorites } = useApp();
  const [qty, setQty] = useState(1);
  const [configuring, setConfiguring] = useState(false);
  const itemId = getFoodId(food);
  const imageSrc = getFoodImage(food);
  const optionPreviews = getFoodOptionPreviews(food);
  const isFav = favorites.includes(itemId);
  const role = getFoodRole(food);
  const needsConfiguration =
    isConfigurableFood(food) ||
    (food.foodType === "DRINK" && food.configuration?.variants?.length > 0);
  const canStandaloneOrder = canOrderStandalone(food);
  const isComplementOnly =
    !canStandaloneOrder && !needsConfiguration && role !== "main";

  return (
    <>
      <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-200">
        <div
          className="relative overflow-hidden bg-stone-100 cursor-pointer"
          onClick={() => navigate(`/food/${itemId}`)}
        >
          <img
            src={imageSrc}
            alt={food.name}
            className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(itemId);
            }}
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFav
                ? "bg-red-500 text-white shadow-sm"
                : "bg-white/85 text-stone-400 hover:text-red-500 hover:bg-white backdrop-blur-sm"
            }`}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={isFav ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <button
            type="button"
            className="text-left w-full"
            onClick={() => navigate(`/food/${itemId}`)}
          >
            <p className="text-[11px] font-semibold text-orange-600 uppercase mb-1">
              {food.category || "Our menu"}
            </p>
            <h3 className="font-semibold text-stone-900 text-base leading-snug group-hover:text-orange-600 transition-colors">
              {food.name}
            </h3>
          </button>

          <p className="text-stone-500 text-xs mt-1 mb-3 line-clamp-2 leading-relaxed min-h-9">
            {food.description}
          </p>

          {optionPreviews.length > 0 && (
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
              {optionPreviews.map((option) => (
                <img
                  key={`${food._id || food.id || food.name}-${option.name}`}
                  src={
                    option.image ||
                    option.imageUrl ||
                    food.image ||
                    food.imageUrl
                  }
                  alt={option.name}
                  className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-stone-100 shrink-0"
                  title={option.name}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-stone-900 font-bold text-sm">
              {needsConfiguration ? "From " : ""}
              {formatCurrency(food.price)}
            </span>
            {!needsConfiguration && (
              <div className="inline-flex items-center rounded-lg border border-stone-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="h-8 w-8 text-stone-700 hover:bg-stone-100"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="h-8 w-8 text-stone-700 hover:bg-stone-100"
                >
                  +
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (needsConfiguration) setConfiguring(true);
              else if (canStandaloneOrder) addToCart(food, qty);
            }}
            disabled={
              !food.available || food.published === false || isComplementOnly
            }
            className="w-full h-10 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComplementOnly
              ? "Part of a plate"
              : needsConfiguration
                ? "Customize & Order"
                : "Add to Order"}
          </button>
        </div>
      </div>

      {configuring && (
        <MealConfigurator
          food={food}
          onCancel={() => setConfiguring(false)}
          onAdd={(item) => {
            addToCart(item);
            setConfiguring(false);
          }}
        />
      )}
    </>
  );
}
