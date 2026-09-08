import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

const defaultSettings = {
  restaurantName: "NaijaBite",
  contactEmail: "hello@naijabite.com",
  contactPhone: "+234 800 624 2423",
  address: "Lagos, Nigeria",
  footerDescription:
    "Premium food delivery from the best restaurants in your city — fast, reliable, delicious.",
};

export default function Footer({ navigate }) {
  const go = navigate || useNavigate();
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/settings");
        setSettings({
          ...defaultSettings,
          ...res.data,
        });
      } catch (error) {
        console.error("Failed to load footer settings:", error);
      }
    };

    loadSettings();
  }, []);

  const exploreLinks = [
    ["Home", "/"],
    ["Menu", "/menu"],
    ["Orders", "/orders"],
  ];

  const accountLinks = [
    ["Profile", "/profile"],
    ["Cart", "/cart"],
  ];

  const categories = [
    "Swallows",
    "Rice and Grain Dishes",
    "Street Food and Snacks",
    "Proteins",
  ];

  const goTo = (path) => {
    try {
      go(path);
    } catch (e) {
      try {
        go(path.replace(/^\//, ""));
      } catch (err) {
        window.location.href = path;
      }
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
              >
                <path
                  d="M12 2C8 2 4 5.5 4 10c0 2.5 1.2 4.7 3 6.2V20a1 1 0 001 1h8a1 1 0 001-1v-3.8c1.8-1.5 3-3.7 3-6.2C20 5.5 16 2 12 2z"
                  fill="currentColor"
                  opacity=".9"
                />
                <path
                  d="M9 21v1a1 1 0 001 1h4a1 1 0 001-1v-1H9z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span
              className="text-white font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {settings.restaurantName}
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            {settings.footerDescription}
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">
            Browse by Category
          </h4>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c}>
                <button
                  onClick={() =>
                    goTo(`/menu?category=${encodeURIComponent(c)}`)
                  }
                  className="hover:text-white transition-colors"
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            {exploreLinks.map(([label, path]) => (
              <li key={path}>
                <button
                  onClick={() => goTo(path)}
                  className="hover:text-white transition-colors"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm mb-3">
            {accountLinks.map(([label, path]) => (
              <li key={path}>
                <button
                  onClick={() => goTo(path)}
                  className="hover:text-white transition-colors"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <h4 className="text-white text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>{settings.contactEmail}</li>
            <li>{settings.contactPhone}</li>
            <li>{settings.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800 px-6 py-4">
        <p className="text-center text-xs text-stone-600">
          © {new Date().getFullYear()} {settings.restaurantName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
