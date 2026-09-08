import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoods } from "../store/foodSlice";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import Footer from "../components/Footer";

const SORT_OPTIONS = ["Popular", "Price: Low", "Price: High"];

export default function MenuPage({ navigate }) {
  const dispatch = useDispatch();
  const foods = useSelector((s) => s.food.items || []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");

  useEffect(() => {
    if (!foods || foods.length === 0) dispatch(fetchFoods());
  }, [dispatch]);

  const categories = [
    "All",
    ...new Set((foods || []).map((f) => f.category).filter(Boolean)),
  ];

  const filtered = useMemo(() => {
    let items = (foods || []).filter((f) => {
      const matchSearch =
        !search ||
        (f.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (f.description || "").toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || f.category === category;
      return matchSearch && matchCat;
    });

    if (sort === "Price: Low")
      items = [...items].sort((a, b) => a.price - b.price);
    else if (sort === "Price: High")
      items = [...items].sort((a, b) => b.price - a.price);
    else
      items = [...items].sort(
        (a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0),
      );

    return items;
  }, [foods, search, category, sort]);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="menu" navigate={navigate} />

      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1
            className="text-3xl font-medium text-stone-900 mb-1"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Our Menu
          </h1>
          <p className="text-stone-500 text-sm">
            {foods.length} meals available · Updated daily
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 w-full flex-1">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
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
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search meals…"
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 pl-3 pr-8 rounded-xl bg-white border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline
                points="6 9 12 15 18 9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 h-8 px-4 rounded-full text-xs font-semibold border transition-all ${category === cat ? "bg-orange-500 text-white" : "bg-white text-stone-700 border-stone-200 hover:border-orange-300 hover:text-orange-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-xs text-stone-500 mb-4 font-medium">
          {filtered.length === 0
            ? "No results"
            : `${filtered.length} meal${filtered.length !== 1 ? "s" : ""} found`}
          {category !== "All" && ` in ${category}`}
          {search && ` for "${search}"`}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((food) => (
              <FoodCard
                key={food._id || food.id}
                food={food}
                navigate={navigate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
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
            </div>
            <p className="text-stone-900 font-semibold mb-1">No meals found</p>
            <p className="text-stone-500 text-sm mb-4">
              Try adjusting your search or filter.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="h-9 px-5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}
