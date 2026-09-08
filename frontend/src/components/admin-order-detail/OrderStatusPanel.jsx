import React from "react";

export default function OrderStatusPanel({
  selectedOrder,
  newStatus,
  setNewStatus,
  handleUpdateStatus,
  updateSuccess,
  updating,
  STATUS_OPTIONS,
  NEXT_STATUS,
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5">
      <h3 className="font-semibold text-stone-900 mb-4">Update Order Status</h3>
      {updateSuccess && (
        <div className="mb-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
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
          Status updated successfully.
        </div>
      )}

      {NEXT_STATUS[selectedOrder.status] && (
        <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800">
          <span className="font-semibold">Suggested next:</span>{" "}
          {NEXT_STATUS[selectedOrder.status]}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full h-10 pl-3 pr-8 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400/30 appearance-none cursor-pointer"
          >
            <option value="">Select new status…</option>
            {STATUS_OPTIONS.filter((s) => s !== selectedOrder.status).map(
              (s) => (
                <option key={s} value={s}>
                  {s}
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
        <button
          onClick={handleUpdateStatus}
          disabled={!newStatus || updating}
          className="h-10 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {updating ? (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
}
