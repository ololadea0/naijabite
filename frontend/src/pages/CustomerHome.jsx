import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/foodSlice";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import Footer from "../components/Footer";
import { CATEGORIES } from "../data/categories";

export default function CustomerHome({ navigate }) {
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.food.items || []);
  const { addToCart } = useApp();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  const categories = CATEGORIES;
  const popular = foods.filter((food) => food.popular).slice(0, 8);
  const categoryFoods =
    activeCategory === "All"
      ? foods.slice(0, 8)
      : foods.filter((food) => food.category === activeCategory);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar currentPage="home" navigate={navigate} />

      <section className="relative bg-stone-950 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1692197275441-40c874f40385?w=1400&h=600&fit=crop&auto=format"
          alt="Delicious food"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-3.5 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="text-orange-300 text-xs font-semibold tracking-wide">
                Fast delivery - 30 min
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-white font-medium leading-[1.1] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Good food,
              <br />
              <em className="text-orange-400 not-italic">delivered fast.</em>
            </h1>

            <p className="text-stone-300 text-base sm:text-lg mb-8 max-w-sm leading-relaxed">
              Order from the city's finest restaurants and track your meal every
              step of the way.
            </p>

            <div className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line
                    x1="21"
                    y1="21"
                    x2="16.65"
                    y2="16.65"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search meals..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                />
              </div>
              <button
                onClick={() => navigate("menu")}
                className="h-11 px-5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Order now
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-2 w-full">
        <h2
          className="text-xl font-semibold text-stone-900 mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Browse by category
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center justify-center h-10 px-4 rounded-full text-sm font-medium border transition-all ${activeCategory === cat ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-500/20" : "bg-white text-stone-700 border-stone-200 hover:border-orange-300 hover:text-orange-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {activeCategory !== "All" && (
        <section className="max-w-7xl mx-auto px-6 py-6 w-full">
          {categoryFoods.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p className="text-lg mb-1">No meals in this category yet.</p>
              <button
                onClick={() => navigate("menu")}
                className="text-orange-600 text-sm font-medium hover:underline"
              >
                Browse all meals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryFoods.map((food) => (
                <FoodCard
                  key={food._id || food.id}
                  food={food}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeCategory === "All" && (
        <section className="max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Most popular
            </h2>
            <button
              onClick={() => navigate("menu")}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              See all
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
                <polyline
                  points="12 5 19 12 12 19"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popular.map((food) => (
              <FoodCard
                key={food._id || food.id}
                food={food}
                navigate={navigate}
              />
            ))}
          </div>
        </section>
      )}

      <Footer navigate={navigate} />
    </div>
  );
}
