import { getFoodId, getFoodImage, formatCurrency } from "../../lib/formatters";
import { INPUT_CLASS, SECONDARY_BUTTON } from "./menuStyles";

export function MenuSearchBar({ search, onSearchChange }) {
  return (
    <div className="relative flex-1 max-w-xs">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search menu…"
        className={`${INPUT_CLASS} pl-9 pr-4 bg-white`}
      />
    </div>
  );
}

export function SuccessBanner({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <polyline
          points="20 6 9 17 4 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {message}
    </div>
  );
}

export function DeleteConfirmModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-stone-950/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 w-full max-w-sm shadow-xl">
        <h3 className="font-semibold text-stone-900 mb-2">Delete item?</h3>
        <p className="text-sm text-stone-600 mb-5">
          This will remove the item from your menu. This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className={`${SECONDARY_BUTTON} flex-1`}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function MenuTable({ foods, search, openEdit, onDelete }) {
  const filteredFoods = foods.filter(
    (food) =>
      !search ||
      food.name.toLowerCase().includes(search.toLowerCase()) ||
      food.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50">
              {"Item,Category,Price,Status,Actions"
                .split(",")
                .map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-xs font-semibold text-stone-500 whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredFoods.map((food) => (
              <tr
                key={getFoodId(food)}
                className="hover:bg-stone-50 transition-colors"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={getFoodImage(food, "w=80&h=80")}
                      alt={food.name}
                      className="w-10 h-10 rounded-lg object-cover bg-stone-100 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium text-stone-900">{food.name}</p>
                      <p className="text-xs text-stone-500 line-clamp-1 max-w-[180px]">
                        {food.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-stone-600 whitespace-nowrap">
                  {food.category}
                </td>
                <td className="px-4 py-3.5 font-semibold text-stone-900 whitespace-nowrap">
                  {formatCurrency(food.price)}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      food.available
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {food.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(food)}
                      className="text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Edit
                    </button>
                    <span className="text-stone-300">·</span>
                    <button
                      onClick={() => onDelete(getFoodId(food))}
                      className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
