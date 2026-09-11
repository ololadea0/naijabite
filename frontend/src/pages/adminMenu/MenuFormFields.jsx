import { CATEGORIES } from "../../data/categories";
import api from "../../lib/api";
import { FIELD_LABEL, INPUT_CLASS } from "./menuStyles";

export function ImageField({ form, setForm }) {
  return (
    <div>
      <label className={FIELD_LABEL}>Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          setForm((current) => ({ ...current, imageFile: selectedFile }));
          if (selectedFile) {
            setForm((current) => ({
              ...current,
              imageUrl: URL.createObjectURL(selectedFile),
            }));
          }
        }}
        className={INPUT_CLASS}
      />
      {form.imageUrl && (
        <img
          src={form.imageUrl}
          alt="Preview"
          className="mt-2 w-32 h-24 rounded-xl object-cover bg-stone-100 border border-stone-200"
          onError={(event) => {
            event.target.style.display = "none";
          }}
        />
      )}
      <p className="text-xs text-stone-400 mt-1">
        Upload an image file. The image will be uploaded to Cloudinary.
      </p>
    </div>
  );
}

export function NameCategoryFields({ form, setForm, formErrors }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div>
        <label className={FIELD_LABEL}>Food name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="e.g. Jollof Rice"
          className={`${INPUT_CLASS} ${
            formErrors.name ? "border-red-300 bg-red-50" : ""
          }`}
        />
        {formErrors.name && (
          <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>
        )}
      </div>

      <div>
        <label className={FIELD_LABEL}>Category</label>
        <div className="relative">
          <select
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            className={`${INPUT_CLASS} pr-8 appearance-none cursor-pointer`}
          >
            {CATEGORIES.filter((category) => category !== "All").map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ),
            )}
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

      <div>
        <label className={FIELD_LABEL}>Food type</label>
        <div className="relative">
          <select
            value={form.foodType}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                foodType: event.target.value,
                role: ["RICE", "SWALLOW", "BEANS", "YAM"].includes(
                  event.target.value,
                )
                  ? "main"
                  : ["SNACK", "DRINK"].includes(event.target.value)
                    ? "standalone"
                    : current.role === "main"
                      ? "main"
                      : current.role,
              }))
            }
            className={`${INPUT_CLASS} pr-8 appearance-none cursor-pointer`}
          >
            {[
              "SIMPLE",
              "RICE",
              "SWALLOW",
              "BEANS",
              "YAM",
              "SIDE",
              "SNACK",
              "DRINK",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={FIELD_LABEL}>Meal role</label>
        <div className="relative">
          <select
            value={form.role}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                role: event.target.value,
                allowStandalone:
                  event.target.value === "standalone"
                    ? true
                    : current.allowStandalone,
              }))
            }
            className={`${INPUT_CLASS} pr-8 appearance-none cursor-pointer`}
          >
            {[
              ["main", "Main meal"],
              ["side", "Side / complement"],
              ["protein", "Protein / add-on"],
              ["standalone", "Standalone item"],
            ].map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function DescriptionPriceFields({ form, setForm, formErrors }) {
  return (
    <>
      <div>
        <label className={FIELD_LABEL}>Description *</label>
        <textarea
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          rows={3}
          placeholder="Describe the meal…"
          className={`${INPUT_CLASS} h-auto py-3 ${
            formErrors.description ? "border-red-300 bg-red-50" : ""
          }`}
        />
        {formErrors.description && (
          <p className="text-xs text-red-600 mt-1">{formErrors.description}</p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={FIELD_LABEL}>Price (₦) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price || ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                price: parseFloat(event.target.value) || 0,
              }))
            }
            placeholder="0.00"
            className={`${INPUT_CLASS} ${
              formErrors.price ? "border-red-300 bg-red-50" : ""
            }`}
          />
          {formErrors.price && (
            <p className="text-xs text-red-600 mt-1">{formErrors.price}</p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <label className={FIELD_LABEL}>Options</label>
          {[
            ["available", "Available for order"],
            ["published", "Published on menu"],
            ["popular", "Mark as popular"],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={form[key]}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    [key]: !current[key],
                  }))
                }
                className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                  form[key]
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-stone-300"
                }`}
              >
                {form[key] && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span className="text-sm text-stone-700">{label}</span>
            </label>
          ))}
          {form.role !== "main" && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <button
                type="button"
                role="checkbox"
                aria-checked={form.allowStandalone}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    allowStandalone: !current.allowStandalone,
                  }))
                }
                className={`w-4.5 h-4.5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                  form.allowStandalone
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-stone-300"
                }`}
              >
                {form.allowStandalone && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span className="text-sm text-stone-700">
                Allow as standalone item
              </span>
            </label>
          )}
        </div>
      </div>
    </>
  );
}

const configGroupsByType = {
  RICE: [
    ["riceBases", "Rice selection"],
    ["proteins", "Protein"],
    ["sides", "Sides"],
    ["extras", "Extras"],
  ],
  SWALLOW: [
    ["proteins", "Protein"],
    ["soups", "Soup options"],
    ["extras", "Extra options"],
  ],
  BEANS: [
    ["proteins", "Protein"],
    ["sides", "Sides"],
    ["extras", "Extras"],
  ],
  YAM: [
    ["proteins", "Protein"],
    ["sides", "Sides"],
    ["extras", "Extras"],
  ],
  DRINK: [["variants", "Sizes / variants"]],
};

const emptyOption = () => ({
  name: "",
  price: 0,
  image: "",
  imageUrl: "",
  available: true,
});

function OptionRows({ title, items = [], onChange }) {
  const uploadOptionImage = async (file, index) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/uploads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const next = [...items];
      const uploadedImage = response.data?.imageUrl || "";
      next[index] = {
        ...next[index],
        image: uploadedImage,
        imageUrl: uploadedImage,
        img: uploadedImage,
      };
      onChange([...next]);
    } catch (error) {
      console.error("Option image upload failed", error);
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-stone-900">{title}</h4>
        <button
          type="button"
          onClick={() => onChange([...items, emptyOption()])}
          className="h-8 px-3 rounded-lg bg-white border border-stone-200 text-xs font-medium text-orange-600"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_100px_1.2fr_auto_auto] gap-2"
          >
            <input
              value={item.name}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, name: event.target.value };
                onChange(next);
              }}
              placeholder="Name"
              className={INPUT_CLASS}
            />
            <input
              type="number"
              min="0"
              value={item.price || ""}
              onChange={(event) => {
                const next = [...items];
                next[index] = {
                  ...item,
                  price: parseFloat(event.target.value) || 0,
                };
                onChange(next);
              }}
              placeholder="Price"
              className={INPUT_CLASS}
            />
            <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-2 py-1.5 min-h-[44px]">
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  const selectedFile = event.target.files?.[0];
                  if (!selectedFile) return;
                  await uploadOptionImage(selectedFile, index);
                  event.target.value = "";
                }}
                className="max-w-[120px] text-[10px] text-stone-600 file:mr-2 file:rounded-md file:border-0 file:bg-orange-50 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-orange-600"
              />
              {(item.image || item.imageUrl || item.img) && (
                <img
                  src={item.image || item.imageUrl || item.img}
                  alt={item.name || "Option image"}
                  className="w-9 h-9 rounded-md object-cover border border-stone-200 bg-stone-100"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                const next = [...items];
                next[index] = {
                  ...item,
                  available: item.available === false ? true : false,
                };
                onChange(next);
              }}
              className={`h-11 rounded-lg border text-[10px] font-semibold px-2 transition-colors ${
                item.available === false
                  ? "border-stone-200 bg-stone-100 text-stone-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {item.available === false ? "Not available" : "Available"}
            </button>
            <button
              type="button"
              onClick={() =>
                onChange(items.filter((_, itemIndex) => itemIndex !== index))
              }
              className="h-11 px-3 rounded-lg border border-stone-200 text-xs text-red-600 bg-white"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConfigurationFields({ form, setForm }) {
  const groups = configGroupsByType[form.foodType] || [];
  if (!groups.length) return null;

  const setConfig = (updates) =>
    setForm((current) => ({
      ...current,
      configuration: { ...current.configuration, ...updates },
    }));

  const minMainBases = Math.max(
    1,
    Number(form.configuration.minMainBases || 1),
  );
  const maxMainBases = Math.max(
    1,
    Number(form.configuration.maxMainBases || 1),
  );
  const riceBasePreview = (form.configuration.riceBases || [])
    .filter((item) => item?.name)
    .map((item) => item.name);

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2">
          <label className={FIELD_LABEL}>Serving label</label>
          <select
            value={form.configuration.portionLabel || "portion"}
            onChange={(event) =>
              setConfig({ portionLabel: event.target.value })
            }
            className={INPUT_CLASS}
          >
            <option value="portion">portion</option>
            <option value="wrap">wrap</option>
            <option value="serving">serving</option>
            <option value="plate">plate</option>
            <option value="pack">pack</option>
          </select>
        </div>
        <div>
          <label className={FIELD_LABEL}>Default qty</label>
          <input
            type="number"
            min="1"
            value={form.configuration.defaultQuantity || 1}
            onChange={(event) =>
              setConfig({
                defaultQuantity: parseInt(event.target.value, 10) || 1,
              })
            }
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label className={FIELD_LABEL}>Max qty</label>
          <input
            type="number"
            min="1"
            value={form.configuration.maxQuantity || 20}
            onChange={(event) =>
              setConfig({ maxQuantity: parseInt(event.target.value, 10) || 20 })
            }
            className={INPUT_CLASS}
          />
        </div>
      </div>

      {form.foodType === "RICE" && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 space-y-3">
          <label className="flex items-center justify-between gap-3 text-sm text-stone-700">
            <span>Allow mixed rice bases</span>
            <button
              type="button"
              role="checkbox"
              aria-checked={Boolean(form.configuration.allowMultipleMainBases)}
              onClick={() =>
                setConfig({
                  allowMultipleMainBases: !Boolean(
                    form.configuration.allowMultipleMainBases,
                  ),
                  maxMainBases: !Boolean(
                    form.configuration.allowMultipleMainBases,
                  )
                    ? Math.max(2, Number(form.configuration.maxMainBases || 1))
                    : 1,
                })
              }
              className={`w-11 h-6 rounded-full border transition-all ${
                form.configuration.allowMultipleMainBases
                  ? "bg-orange-500 border-orange-500"
                  : "bg-stone-200 border-stone-300"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                  form.configuration.allowMultipleMainBases
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={FIELD_LABEL}>Min main bases</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.configuration.minMainBases || 1}
                onChange={(event) =>
                  setConfig({
                    minMainBases: Math.max(
                      1,
                      parseInt(event.target.value, 10) || 1,
                    ),
                  })
                }
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={FIELD_LABEL}>Max main bases</label>
              <input
                type="number"
                min="1"
                max="10"
                value={form.configuration.maxMainBases || 1}
                onChange={(event) =>
                  setConfig({
                    maxMainBases: Math.max(
                      1,
                      parseInt(event.target.value, 10) || 1,
                    ),
                    allowMultipleMainBases:
                      Number(parseInt(event.target.value, 10) || 1) > 1,
                  })
                }
                className={INPUT_CLASS}
              />
            </div>
          </div>

          <div className="rounded-xl border border-orange-200 bg-white p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-600">
              Customer preview
            </p>
            <p className="mt-2 text-sm text-stone-700">
              {form.configuration.allowMultipleMainBases
                ? `Customer can choose ${minMainBases} to ${maxMainBases} rice bases.`
                : "Customer must choose one rice base only."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {riceBasePreview.length > 0 ? (
                riceBasePreview.map((baseName) => (
                  <span
                    key={baseName}
                    className="rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
                  >
                    {baseName}
                  </span>
                ))
              ) : (
                <span className="text-xs text-stone-500">
                  Add rice base options to preview the customer selection.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {form.foodType === "SWALLOW" && (
        <div className="rounded-xl border border-orange-200 bg-white p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-600">
            Customer preview
          </p>
          <p className="mt-2 text-sm text-stone-700">
            This swallow food is itself the main item. The customer will choose
            from the available proteins, soups, and extras under it.
          </p>
        </div>
      )}

      {groups.map(([key, title]) => (
        <OptionRows
          key={key}
          title={title}
          items={form.configuration[key] || []}
          onChange={(items) => setConfig({ [key]: items })}
        />
      ))}
    </div>
  );
}

export function IngredientsField({
  form,
  setForm,
  ingredientInput,
  setIngredientInput,
}) {
  const addIngredient = () => {
    const value = ingredientInput.trim();
    if (!value) return;

    setForm((current) => ({
      ...current,
      ingredients: [...current.ingredients, value],
    }));
    setIngredientInput("");
  };

  return (
    <div>
      <label className={FIELD_LABEL}>Ingredients</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={ingredientInput}
          onChange={(event) => setIngredientInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && ingredientInput.trim()) {
              setForm((current) => ({
                ...current,
                ingredients: [...current.ingredients, ingredientInput.trim()],
              }));
              setIngredientInput("");
            }
          }}
          placeholder="Type an ingredient and press Enter"
          className={`${INPUT_CLASS} flex-1`}
        />
        <button
          type="button"
          onClick={addIngredient}
          className="h-10 px-3 bg-orange-50 border border-orange-200 text-orange-600 text-sm font-medium rounded-xl hover:bg-orange-100 transition-colors"
        >
          Add
        </button>
      </div>
      {form.ingredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {form.ingredients.map((ingredient) => (
            <span
              key={ingredient}
              className="flex items-center gap-1.5 bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-lg"
            >
              {ingredient}
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    ingredients: current.ingredients.filter(
                      (item) => item !== ingredient,
                    ),
                  }))
                }
                className="text-stone-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
