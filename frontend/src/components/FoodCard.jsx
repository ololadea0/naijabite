import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useApp } from "../context/AppContext";
import { formatCurrency, getFoodId, getFoodImage } from "../lib/formatters";

export default function FoodCard({ food, navigate }) {
  const { addToCart, toggleFavorite, favorites } = useApp();
  const itemId = getFoodId(food);
  const imageSrc = getFoodImage(food);
  const isFav = favorites.includes(itemId);

  return _jsxs("div", {
    className:
      "group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md hover:border-stone-300 transition-all duration-200",
    children: [
      _jsxs("div", {
        className: "relative overflow-hidden bg-stone-100 cursor-pointer",
        onClick: () => navigate("food-detail", { foodId: itemId }),
        children: [
          _jsx("img", {
            src: imageSrc,
            alt: food.name,
            className:
              "w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300",
            loading: "lazy",
          }),
          _jsx("button", {
            onClick: (e) => {
              e.stopPropagation();
              toggleFavorite(itemId);
            },
            "aria-label": isFav
              ? "Remove from favourites"
              : "Add to favourites",
            className: `absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFav
                ? "bg-red-500 text-white shadow-sm"
                : "bg-white/80 text-stone-400 hover:text-red-500 hover:bg-white backdrop-blur-sm"
            }`,
            children: _jsx("svg", {
              className: "w-4 h-4",
              viewBox: "0 0 24 24",
              fill: isFav ? "currentColor" : "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: _jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
              }),
            }),
          }),
          _jsx("span", {
            className:
              "absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-full",
            children: food.category || "Our menu",
          }),
        ],
      }),
      _jsxs("div", {
        className: "p-4",
        children: [
          _jsxs("div", {
            className: "flex items-start justify-between gap-2 cursor-pointer",
            onClick: () => navigate("food-detail", { foodId: itemId }),
            children: [
              _jsx("h3", {
                className:
                  "font-semibold text-stone-900 text-sm leading-snug line-clamp-1 group-hover:text-orange-600 transition-colors",
                children: food.name,
              }),
              _jsx("span", {
                className: "text-stone-900 font-bold text-sm flex-shrink-0",
                children: formatCurrency(food.price),
              }),
            ],
          }),
          _jsx("p", {
            className:
              "text-stone-500 text-xs mt-1 mb-3 line-clamp-2 leading-relaxed",
            children: food.description,
          }),
          _jsxs("div", {
            className: "flex items-center justify-end",
            children: [
              _jsxs("button", {
                onClick: () => addToCart(food),
                disabled: !food.available,
                className:
                  "flex items-center gap-1.5 h-8 px-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                children: [
                  _jsxs("svg", {
                    className: "w-3.5 h-3.5",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    strokeWidth: "2.5",
                    children: [
                      _jsx("line", {
                        x1: "12",
                        y1: "5",
                        x2: "12",
                        y2: "19",
                        strokeLinecap: "round",
                      }),
                      _jsx("line", {
                        x1: "5",
                        y1: "12",
                        x2: "19",
                        y2: "12",
                        strokeLinecap: "round",
                      }),
                    ],
                  }),
                  "Add",
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
