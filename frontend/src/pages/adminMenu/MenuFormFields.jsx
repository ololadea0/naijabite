import { CATEGORIES } from "../../data/categories";
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
    <div className="grid sm:grid-cols-2 gap-4">
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
        </div>
      </div>
    </>
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
