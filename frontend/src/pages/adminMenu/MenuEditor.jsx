import {
  ImageField,
  NameCategoryFields,
  DescriptionPriceFields,
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
