import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatCurrency } from "../lib/formatters";
import {
  calculateCartItemTotal,
  createDefaultConfiguration,
  getFoodRole,
  isMainMealFood,
  summarizeConfiguration,
} from "../lib/mealConfig";

const QuantityControl = ({ value, onChange, min = 1, max = 20 }) => (
  <div className="inline-flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      className="h-11 w-11 text-xl font-medium text-stone-700 hover:bg-stone-100"
    >
      -
    </button>
    <span className="w-12 text-center text-base font-semibold text-stone-800">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onChange(Math.min(max, value + 1))}
      className="h-11 w-11 text-xl font-medium text-stone-700 hover:bg-stone-100"
    >
      +
    </button>
  </div>
);

const OptionStepper = ({ option, value, onChange, fallbackImage }) => {
  const optionImage =
    option.image || option.imageUrl || option.img || fallbackImage;

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2">
      <div className="flex items-center gap-3 min-w-0">
        {optionImage ? (
          <img
            src={optionImage}
            alt={option.name}
            className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-stone-100"
          />
        ) : (
          <img
            src={"https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
            alt={option.name}
            className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-stone-100"
          />
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-stone-900 truncate">
            {option.name}
          </p>
          <p className="text-xs text-stone-500">
            +{formatCurrency(option.price)}
          </p>
        </div>
      </div>
      <QuantityControl value={value} onChange={onChange} min={0} max={20} />
    </div>
  );
};

const selectedQuantity = (items = [], name) =>
  items.find((item) => item.name === name)?.quantity || 0;

export default function MealConfigurator({
  food,
  initialQuantity = 1,
  initialConfiguration,
  onCancel,
  onAdd,
}) {
  const allFoods = useSelector((state) => state.food.items || []);
  const role = getFoodRole(food);

  const sharedRiceBases = useMemo(() => {
    if (food.foodType !== "RICE")
      return (food.configuration?.riceBases || []).map((option) => ({
        ...option,
        price: Number(option?.price || 0),
        available: option?.available !== false,
      }));

    const merged = new Map();
    for (const option of food.configuration?.riceBases || []) {
      if (!option?.name) continue;
      merged.set(option.name, {
        name: option.name,
        price: Number(option.price || 0),
        image: option.image || option.imageUrl || "",
        available: option.available !== false,
      });
    }

    for (const menuItem of allFoods) {
      if (
        !menuItem ||
        menuItem.foodType !== "RICE" ||
        menuItem._id === (food._id || food.id)
      )
        continue;
      const candidate = menuItem.configuration?.riceBases || [];
      for (const option of candidate) {
        if (!option?.name) continue;
        if (!merged.has(option.name)) {
          merged.set(option.name, {
            name: option.name,
            price: Number(option.price || menuItem.price || 0),
            image: option.image || option.imageUrl || menuItem.image || "",
            available:
              option.available !== false && menuItem.available !== false,
          });
        }
      }
    }

    return Array.from(merged.values());
  }, [allFoods, food]);

  const displayFood = useMemo(
    () => ({
      ...food,
      configuration: {
        ...(food.configuration || {}),
        riceBases: sharedRiceBases,
      },
    }),
    [food, sharedRiceBases],
  );

  const config = displayFood.configuration || {};
  const [quantity, setQuantity] = useState(initialQuantity);
  const [mealConfig, setMealConfig] = useState(
    initialConfiguration || createDefaultConfiguration(displayFood),
  );

  const total = useMemo(
    () => calculateCartItemTotal(displayFood, quantity, mealConfig),
    [displayFood, quantity, mealConfig],
  );
  const summary = summarizeConfiguration(mealConfig, displayFood);
  const isSwallow = displayFood.foodType === "SWALLOW";
  const isRice = displayFood.foodType === "RICE";
  const usesRiceBases = isRice && config.riceBases?.length > 0;
  const quantityKey = isSwallow ? "wraps" : "portions";
  const quantityLabel = isSwallow ? "Number of wraps" : "Portions";
  const maxMainBases = Math.max(1, Number(config.maxMainBases || 1));
  const ricePortionCount = (mealConfig.riceBases || []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const selectedRiceBaseCount = (mealConfig.riceBases || []).filter(
    (item) => Number(item.quantity || 0) > 0,
  ).length;

  const setListQuantity = (key, option, nextQuantity) => {
    setMealConfig((current) => {
      const currentList = current[key] || [];
      const currentSelection = currentList.find(
        (item) => item.name === option.name,
      );
      const hasExistingSelection = Boolean(
        currentSelection && Number(currentSelection.quantity || 0) > 0,
      );
      const countWithoutThisOption = currentList.filter(
        (item) => item.name !== option.name,
      ).length;

      if (
        nextQuantity > 0 &&
        key === "riceBases" &&
        !hasExistingSelection &&
        countWithoutThisOption >= maxMainBases
      ) {
        return current;
      }

      const without = currentList.filter((item) => item.name !== option.name);
      return {
        ...current,
        [key]:
          nextQuantity > 0
            ? [...without, { name: option.name, quantity: nextQuantity }]
            : without,
      };
    });
  };

  if (!isMainMealFood(food) && food.foodType !== "DRINK") {
    return (
      <div className="fixed inset-0 z-50 bg-stone-950/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-stone-200 shadow-xl p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
            Plate rule
          </p>
          <h3 className="mt-2 text-xl font-semibold text-stone-900">
            Choose a main meal first
          </h3>
          <p className="mt-3 text-sm text-stone-600">
            {food.name} is marked as a {role || "side"} item. It can only be
            used as part of a main plate unless explicitly allowed as a
            standalone item.
          </p>
          <button
            type="button"
            onClick={onCancel}
            className="mt-5 w-full h-11 rounded-xl bg-orange-500 text-white font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-stone-50 w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-stone-200 shadow-xl">
        <div className="sticky top-0 z-10 bg-white border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-orange-600 uppercase">
              {isRice
                ? "Build your rice plate"
                : isSwallow
                  ? "Build your swallow plate"
                  : "Customize your plate"}
            </p>
            <h2 className="text-xl font-semibold text-stone-900">
              {isRice ? "Create your perfect plate" : food.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="h-10 w-10 rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50"
          >
            x
          </button>
        </div>

        <div className="p-5 space-y-5">
          {food.foodType === "DRINK" && config.variants?.length > 0 ? (
            <section>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Choose size
              </h3>
              <div className="grid gap-2">
                {config.variants.map((variant) => (
                  <button
                    key={variant.name}
                    type="button"
                    onClick={() => setMealConfig({ variant: variant.name })}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${
                      mealConfig.variant === variant.name
                        ? "border-orange-400 bg-orange-50"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    <span className="text-sm font-medium text-stone-900">
                      {variant.name}
                    </span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(variant.price)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {usesRiceBases && (
            <section>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Rice selection
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                Mix your rice plate with other rice options available on the
                menu.
              </p>
              <div className="grid gap-2">
                {config.riceBases.map((option) => (
                  <OptionStepper
                    key={option.name}
                    option={option}
                    fallbackImage={displayFood.image}
                    value={selectedQuantity(mealConfig.riceBases, option.name)}
                    onChange={(value) =>
                      setListQuantity("riceBases", option, value)
                    }
                  />
                ))}
              </div>
              {ricePortionCount < 1 && (
                <p className="text-xs text-red-600 mt-2">
                  Choose at least one rice portion.
                </p>
              )}
            </section>
          )}

          {["RICE", "SWALLOW", "BEANS", "YAM"].includes(food.foodType) &&
          !usesRiceBases ? (
            <section className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">
                  {quantityLabel}
                </h3>
                <p className="text-xs text-stone-500">
                  Base price {formatCurrency(food.price)} per{" "}
                  {config.portionLabel || "serving"}
                </p>
              </div>
              <QuantityControl
                value={mealConfig[quantityKey] || 1}
                min={Number(config.minQuantity || 1)}
                max={Number(config.maxQuantity || 20)}
                onChange={(value) =>
                  setMealConfig((current) => ({
                    ...current,
                    [quantityKey]: value,
                  }))
                }
              />
            </section>
          ) : (
            <section className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-stone-900">Quantity</h3>
              <QuantityControl value={quantity} onChange={setQuantity} />
            </section>
          )}

          {isSwallow && config.proteins?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Protein options
              </h3>
              <div className="grid gap-2">
                {config.proteins
                  .filter((option) => option.available !== false)
                  .map((option) => (
                    <OptionStepper
                      key={option.name}
                      option={option}
                      fallbackImage={food.image}
                      value={selectedQuantity(mealConfig.proteins, option.name)}
                      onChange={(value) =>
                        setListQuantity("proteins", option, value)
                      }
                    />
                  ))}
              </div>
            </section>
          )}

          {isSwallow && config.soups?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Soup options
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {config.soups
                  .filter((soup) => soup.available !== false)
                  .map((soup) => {
                    const soupImage =
                      soup.image || soup.imageUrl || soup.img || food.image;
                    return (
                      <button
                        key={soup.name}
                        type="button"
                        onClick={() =>
                          setMealConfig((current) => ({
                            ...current,
                            soup: soup.name,
                          }))
                        }
                        className={`rounded-xl border px-4 py-3 text-left ${
                          mealConfig.soup === soup.name
                            ? "border-orange-400 bg-orange-50"
                            : "border-stone-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {soupImage ? (
                            <img
                              src={soupImage}
                              alt={soup.name}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-stone-100"
                            />
                          ) : (
                            <img
                              src={
                                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                              }
                              alt={soup.name}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-stone-100"
                            />
                          )}
                          <div>
                            <span className="block text-sm font-medium text-stone-900">
                              {soup.name}
                            </span>
                            {soup.price > 0 && (
                              <span className="block text-xs text-stone-500">
                                +{formatCurrency(soup.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </section>
          )}

          {isSwallow && config.extras?.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-stone-900 mb-3">
                Extra options
              </h3>
              <div className="grid gap-2">
                {config.extras
                  .filter((option) => option.available !== false)
                  .map((option) => (
                    <OptionStepper
                      key={option.name}
                      option={option}
                      fallbackImage={food.image}
                      value={selectedQuantity(mealConfig.extras, option.name)}
                      onChange={(value) =>
                        setListQuantity("extras", option, value)
                      }
                    />
                  ))}
              </div>
            </section>
          )}

          {!isSwallow &&
            [
              ["proteins", "Protein"],
              ["sides", "Sides"],
              ["extras", "Extras"],
            ].map(([key, label]) =>
              config[key]?.length ? (
                <section key={key}>
                  <h3 className="text-sm font-semibold text-stone-900 mb-3">
                    {label}
                  </h3>
                  <div className="grid gap-2">
                    {config[key].map((option) => (
                      <OptionStepper
                        key={option.name}
                        option={option}
                        fallbackImage={food.image}
                        value={selectedQuantity(mealConfig[key], option.name)}
                        onChange={(value) =>
                          setListQuantity(key, option, value)
                        }
                      />
                    ))}
                  </div>
                </section>
              ) : null,
            )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-stone-200 p-4">
          {summary.length > 0 && (
            <p className="text-xs text-stone-500 mb-2">{summary.join(" · ")}</p>
          )}
          <button
            type="button"
            disabled={
              !food.available ||
              (usesRiceBases &&
                (ricePortionCount < 1 || selectedRiceBaseCount > maxMainBases))
            }
            onClick={() =>
              onAdd({
                food: displayFood,
                quantity,
                configuration: mealConfig,
                totalPrice: total,
              })
            }
            className="w-full h-12 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50"
          >
            Add Plate to Order · {formatCurrency(total)}
          </button>
        </div>
      </div>
    </div>
  );
}
