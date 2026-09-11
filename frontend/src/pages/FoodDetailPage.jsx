import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchFoods } from "../store/foodSlice";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FoodCard from "../components/FoodCard";
import MealConfigurator from "../components/MealConfigurator";
import { formatCurrency, getFoodId, getFoodImage } from "../lib/formatters";
import {
  canOrderStandalone,
  getFoodRole,
  isConfigurableFood,
} from "../lib/mealConfig";

export default function FoodDetailPage({ foodId, navigate }) {
  const { id } = useParams();
  const resolvedFoodId = id || foodId;
  const { addToCart, toggleFavorite, favorites } = useApp();
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.food.items || []);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [configuring, setConfiguring] = useState(false);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const food = foods.find((f) => getFoodId(f) === resolvedFoodId);
  const itemId = food ? getFoodId(food) : null;
  const isFav = itemId ? favorites.includes(itemId) : false;
  const relatedFoods = foods.filter(
    (item) => getFoodId(item) !== itemId && item.category === food?.category,
  );
  const role = getFoodRole(food);
  const needsConfiguration =
    isConfigurableFood(food) ||
    (food?.foodType === "DRINK" && food.configuration?.variants?.length > 0);
  const canStandaloneOrder = canOrderStandalone(food);
  const isComplementOnly =
    !canStandaloneOrder && !needsConfiguration && role !== "main";

  if (!food) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar currentPage="menu" navigate={navigate} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <p className="font-semibold text-stone-900">Meal not found</p>
          <button
            onClick={() => navigate("menu")}
            className="text-orange-600 text-sm font-medium hover:underline"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(food, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Navbar currentPage="menu" navigate={navigate} />

      <div className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-start">
          <div className="rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
            <img
              src={getFoodImage(food, "w=900&h=700")}
              alt={food.name}
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </div>

          <div className="pt-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block bg-orange-50 text-orange-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                  {food.category}
                </span>
                <h1
                  className="text-[2.2rem] leading-tight font-semibold text-stone-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {food.name}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(itemId)}
                aria-label={
                  isFav ? "Remove from favorites" : "Add to favorites"
                }
                className={`h-11 w-11 rounded-full border flex items-center justify-center transition-colors ${
                  isFav
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                }`}
              >
                {isFav ? "♥" : "♡"}
              </button>
            </div>

            <div className="mt-5 text-[2.2rem] font-bold text-stone-900">
              {needsConfiguration ? "From " : ""}
              {formatCurrency(food.price)}
            </div>

            <p className="mt-5 text-base text-stone-600 leading-7">
              {food.description}
            </p>

            {food.ingredients && food.ingredients.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[1.05rem] font-semibold text-stone-900 mb-3">
                  Ingredients
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {food.ingredients.map((ingredient, index) => (
                    <span
                      key={`${ingredient}-${index}`}
                      className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-100 px-3 py-1.5 text-sm text-stone-700"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {needsConfiguration ? (
              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => setConfiguring(true)}
                  disabled={!food.available || food.published === false}
                  className="w-full h-14 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold transition-colors disabled:opacity-50"
                >
                  Customize Your Plate
                </button>
              </div>
            ) : isComplementOnly ? (
              <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                This item is a side or protein option. Select a main meal to
                build a plate.
              </div>
            ) : (
              <div className="mt-10 flex items-center justify-between gap-4">
                <div className="flex items-center rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-14 w-14 text-2xl font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-stone-800">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty(qty + 1)}
                    className="h-14 w-14 text-2xl font-medium text-stone-700 hover:bg-stone-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 h-14 rounded-xl text-base font-semibold transition-colors ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {added
                    ? "Added to order"
                    : `Add to Order - ${formatCurrency(food.price * qty)}`}
                </button>
              </div>
            )}
          </div>
        </div>

        {relatedFoods.length > 0 && (
          <div className="mt-12">
            <h2
              className="text-[1.6rem] font-semibold text-stone-900 mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More from {food.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {relatedFoods.slice(0, 4).map((item) => (
                <FoodCard
                  key={getFoodId(item)}
                  food={item}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {configuring && (
        <MealConfigurator
          food={food}
          onCancel={() => setConfiguring(false)}
          onAdd={(item) => {
            addToCart(item);
            setConfiguring(false);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
        />
      )}

      <Footer navigate={navigate} />
    </div>
  );
}
