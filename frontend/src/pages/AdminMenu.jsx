import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createFoodThunk,
  deleteFoodThunk,
  fetchFoods,
  updateFoodThunk,
} from "../store/foodSlice";
import { getFoodId } from "../lib/formatters";
import AdminLayout from "../components/AdminLayout";
import {
  createBlankFoodForm,
  MenuSearchBar,
  SuccessBanner,
  DeleteConfirmModal,
  MenuTable,
  MenuForm,
} from "./AdminMenuSections";

export default function AdminMenu({ navigate, onLogout }) {
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.food.items || []);
  const foodStatus = useSelector((state) => state.food.status);
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState(createBlankFoodForm());
  const [ingredientInput, setIngredientInput] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (foodStatus === "idle") dispatch(fetchFoods());
  }, [dispatch, foodStatus]);

  const openAdd = () => {
    setEditing(null);
    setForm(createBlankFoodForm());
    setIngredientInput("");
    setFormErrors({});
    setView("form");
  };

  const openEdit = (food) => {
    setEditing(food);
    setForm({
      name: food.name,
      category: food.category,
      price: food.price,
      description: food.description,
      ingredients: [...(food.ingredients || [])],
      imageUrl: food.image || food.imageUrl || "",
      imageFile: null,
      available: food.available,
      popular: food.popular,
    });
    setIngredientInput("");
    setFormErrors({});
    setView("form");
  };

  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.description.trim()) errors.description = "Description is required.";
    if (form.price <= 0) errors.price = "Price must be greater than 0.";
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      if (form.imageFile) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("category", form.category);
        fd.append("price", String(form.price));
        fd.append("description", form.description);
        fd.append("image", form.imageFile);
        fd.append("available", String(form.available));
        fd.append("popular", String(form.popular));
        fd.append("additionalInfo", form.ingredients.join(", "));
        fd.append("ingredients", form.ingredients.join(", "));
        fd.append("preparationTime", form.category === "Fast Food" ? "30" : "0");

        if (editing) {
          await dispatch(updateFoodThunk({ id: getFoodId(editing), payload: fd })).unwrap();
          setSuccessMsg(`"${form.name}" updated successfully.`);
        } else {
          await dispatch(createFoodThunk(fd)).unwrap();
          setSuccessMsg(`"${form.name}" added to the menu.`);
        }
      } else {
        const payload = {
          name: form.name,
          category: form.category,
          price: form.price,
          description: form.description,
          image: form.imageUrl,
          available: form.available,
          popular: form.popular,
          additionalInfo: form.ingredients.join(", "),
          ingredients: form.ingredients,
          preparationTime: form.category === "Fast Food" ? 30 : 0,
        };

        if (editing) {
          await dispatch(updateFoodThunk({ id: getFoodId(editing), payload })).unwrap();
          setSuccessMsg(`"${form.name}" updated successfully.`);
        } else {
          await dispatch(createFoodThunk(payload)).unwrap();
          setSuccessMsg(`"${form.name}" added to the menu.`);
        }
      }

      setView("list");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (error) {
      setFormErrors({ submit: error || "Unable to save menu item." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await dispatch(deleteFoodThunk(id)).unwrap();
    setDeleteId(null);
    setSuccessMsg("Item removed from menu.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <AdminLayout activeNav="admin-menu" navigate={navigate} onLogout={onLogout} pageTitle="Menu Management">
      {deleteId && (
        <DeleteConfirmModal onCancel={() => setDeleteId(null)} onConfirm={() => handleDelete(deleteId)} />
      )}

      {view === "list" ? (
        <div className="space-y-4">
          <SuccessBanner message={successMsg} />
          <div className="flex gap-3 justify-between">
            <MenuSearchBar search={search} onSearchChange={setSearch} />
            <button
              onClick={openAdd}
              className="h-10 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" />
                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" />
              </svg>
              Add item
            </button>
          </div>
          <MenuTable foods={foods} search={search} openEdit={openEdit} onDelete={setDeleteId} />
        </div>
      ) : (
        <MenuForm
          form={form}
          setForm={setForm}
          ingredientInput={ingredientInput}
          setIngredientInput={setIngredientInput}
          formErrors={formErrors}
          editing={editing}
          saving={saving}
          onSave={handleSave}
          onCancel={() => setView("list")}
        />
      )}
    </AdminLayout>
  );
}
