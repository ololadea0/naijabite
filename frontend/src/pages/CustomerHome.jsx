import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/foodSlice";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import Footer from "../components/Footer";
import { CATEGORIES } from "../data/categories";
import { formatCurrency, getFoodId, getFoodImage } from "../lib/formatters";
import {
  calculateCartItemTotal,
  createDefaultConfiguration,
  summarizeConfiguration,
} from "../lib/mealConfig";
import { useApp } from "../context/AppContext";

const getFirstAvailable = (options = []) =>
  (options || []).find(
    (option) => option && option.name && option.available !== false,
  ) || null;

const buildSuggestedConfig = (food) => {
  if (!food) return {};
  const config = food.configuration || {};
  const suggested = createDefaultConfiguration(food);

  if (food.foodType === "RICE") {
    const riceBase = getFirstAvailable(config.riceBases);
    const protein = getFirstAvailable(config.proteins);
    const side = getFirstAvailable(config.sides);
    const extra = getFirstAvailable(config.extras);

    return {
      ...suggested,
      riceBases: riceBase
        ? [{ name: riceBase.name, quantity: 1 }]
        : suggested.riceBases || [],
      proteins: protein ? [{ name: protein.name, quantity: 1 }] : [],
      sides: side ? [{ name: side.name, quantity: 1 }] : [],
      extras: extra ? [{ name: extra.name, quantity: 1 }] : [],
    };
  }

  if (food.foodType === "SWALLOW") {
    const soup = getFirstAvailable(config.soups);
    const protein = getFirstAvailable(config.proteins);
    const extra = getFirstAvailable(config.extras);

    return {
      ...suggested,
      wraps: Number(config.defaultQuantity || suggested.wraps || 1),
      soup: soup?.name || suggested.soup || null,
      proteins: protein ? [{ name: protein.name, quantity: 1 }] : [],
      extras: extra ? [{ name: extra.name, quantity: 1 }] : [],
    };
  }

  if (food.foodType === "BEANS" || food.foodType === "YAM") {
    const protein = getFirstAvailable(config.proteins);
    const side = getFirstAvailable(config.sides);
    const extra = getFirstAvailable(config.extras);

    return {
      ...suggested,
      proteins: protein ? [{ name: protein.name, quantity: 1 }] : [],
      sides: side ? [{ name: side.name, quantity: 1 }] : [],
      extras: extra ? [{ name: extra.name, quantity: 1 }] : [],
    };
  }

  return suggested;
};

export default function CustomerHome({ navigate }) {
  const dispatch = useDispatch();
  const { addToCart } = useApp();
  const foods = useSelector((state) => state.food.items || []);
  const [activeCategory, setActiveCategory] = useState("Rice & Meals");

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const popularCombos = useMemo(() => {
    return (foods || [])
      .filter((food) => food.published !== false && food.popular)
      .slice(0, 3)
      .map((food) => {
        const configuration = buildSuggestedConfig(food);
        const summary = summarizeConfiguration(configuration, food).slice(0, 3);

        return {
          food,
          configuration,
          price: calculateCartItemTotal(food, 1, configuration),
          summary: summary.join(" • ") || "Custom plate",
        };
      });
  }, [foods]);

  const visibleFoods = foods.filter((food) => food.published !== false);
  const categoryFoods = visibleFoods
    .filter((food) => food.category === activeCategory)
    .slice(0, 4);
  const extras = visibleFoods
    .filter((food) => ["Snacks", "Drinks"].includes(food.category))
    .slice(0, 4);

  const handleQuickCombo = (food, configuration) => {
    addToCart({ food, quantity: 1, configuration });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar currentPage="home" navigate={navigate} />

      <section className="relative bg-stone-950 overflow-hidden min-h-[560px] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=1600&h=900&fit=crop&auto=format"
          alt="Nigerian rice meal"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/55 to-stone-950/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-2xl">
            <p className="text-orange-300 text-xs font-semibold tracking-wide uppercase mb-4">
              FeastFlow by NaijaBite
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.1] mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Good Food, Made Your Way.
            </h1>
            <p className="text-stone-200 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              Build your plate with your favourite rice, swallow, protein, sides
              and drinks. One order, exactly how you like it.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("menu")}
                className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Explore Menu
              </button>
              <button
                onClick={() => navigate("menu")}
                className="h-12 px-6 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Build My Plate
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Popular Meals
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Ready-made favourites from the menu, with a quick custom option.
            </p>
          </div>
          <button
            onClick={() => navigate("menu")}
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Full menu
          </button>
        </div>

        {popularCombos.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {popularCombos.map(({ food, configuration, price, summary }) => (
              <div
                key={getFoodId(food)}
                className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden"
              >
                <img
                  src={getFoodImage(food, "w=720&h=480")}
                  alt={food.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-600 mb-1">
                    {food.category}
                  </p>
                  <h3 className="font-semibold text-stone-900 text-lg leading-snug">
                    {food.name}
                  </h3>
                  <p className="text-sm text-stone-500 mt-2 line-clamp-2">
                    {summary}
                  </p>

                  <div className="flex items-center justify-between mt-5">
                    <span className="text-sm font-semibold text-stone-900">
                      From {formatCurrency(price)}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickCombo(food, configuration)}
                      className="flex-1 h-10 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Use combo
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/food/${getFoodId(food)}`)}
                      className="flex-1 h-10 rounded-xl border border-stone-200 bg-white text-stone-700 text-sm font-semibold hover:border-stone-300 transition-colors"
                    >
                      Customise
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 text-sm text-stone-500">
            Popular meals will appear here once your menu includes marked
            favourites.
          </div>
        )}
      </section>

      <section className="bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-stone-900">
              Create your perfect plate
            </h2>
            <p className="text-stone-600 mt-3 leading-7">
              Choose your base, pick your protein, add sides, then checkout with
              secure payment and order tracking.
            </p>
            <button
              onClick={() => navigate("menu")}
              className="mt-6 h-11 px-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl"
            >
              Build My Plate
            </button>
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            {["Choose base", "Pick protein", "Add sides", "Order"].map(
              (step, index) => (
                <div
                  key={step}
                  className="rounded-2xl bg-white border border-stone-200 p-4"
                >
                  <span className="text-xs font-semibold text-orange-600">
                    0{index + 1}
                  </span>
                  <p className="font-semibold text-stone-900 mt-2">{step}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="text-2xl font-semibold text-stone-900 mb-5">
          Browse by Category
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-3">
          {CATEGORIES.filter((cat) => cat !== "All").map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 h-10 px-4 rounded-full text-sm font-medium border transition-all ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-stone-700 border-stone-200 hover:border-orange-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {categoryFoods.map((food) => (
            <FoodCard
              key={food._id || food.id}
              food={food}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      {extras.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-12 w-full">
          <h2 className="text-2xl font-semibold text-stone-900 mb-5">
            Something extra?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {extras.map((food) => (
              <FoodCard
                key={food._id || food.id}
                food={food}
                navigate={navigate}
              />
            ))}
          </div>
        </section>
      )}

      <section className="bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            "Freshly prepared meals",
            "Build your plate your way",
            "Easy ordering",
            "Secure payment",
            "Order tracking",
          ].map((benefit) => (
            <div
              key={benefit}
              className="rounded-2xl border border-white/10 p-4"
            >
              <p className="text-sm font-semibold">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer navigate={navigate} />
    </div>
  );
}
