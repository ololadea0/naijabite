import {
  ImageField,
  NameCategoryFields,
  DescriptionPriceFields,
  ConfigurationFields,
  IngredientsField,
} from "./MenuFormFields";
import { MenuSectionHeader } from "./MenuSectionHeader";
import { MenuSaveActions } from "./MenuSaveActions";

export function MenuForm({
  form,
  setForm,
  ingredientInput,
  setIngredientInput,
  formErrors,
  editing,
  saving,
  onSave,
  onCancel,
}) {
  return (
    <div className="max-w-2xl space-y-4">
      <MenuSectionHeader title="Back to menu" onBack={onCancel} />

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2
          className="font-semibold text-stone-900 text-lg mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {editing ? "Edit item" : "Add new item"}
        </h2>

        <div className="space-y-4">
          <ImageField form={form} setForm={setForm} />
          <NameCategoryFields
            form={form}
            setForm={setForm}
            formErrors={formErrors}
          />
          <DescriptionPriceFields
            form={form}
            setForm={setForm}
            formErrors={formErrors}
          />
          {form.role === "main" && (
            <ConfigurationFields form={form} setForm={setForm} />
          )}
          {form.role !== "main" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              This item is marked as a {form.role || "side"}. It can only be
              used as a plate complement unless you allow standalone ordering.
            </div>
          )}
          <IngredientsField
            form={form}
            setForm={setForm}
            ingredientInput={ingredientInput}
            setIngredientInput={setIngredientInput}
          />
        </div>

        <MenuSaveActions
          saving={saving}
          editing={editing}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
