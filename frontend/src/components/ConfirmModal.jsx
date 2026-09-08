import React from "react";

export default function ConfirmModal({
  open,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Yes",
  cancelLabel = "No",
  loading = false,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-2">{title}</h3>
        {message && <p className="text-sm text-stone-600 mb-4">{message}</p>}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="h-10 px-4 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 hover:bg-stone-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="h-10 px-4 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
