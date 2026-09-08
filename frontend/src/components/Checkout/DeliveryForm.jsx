import React from "react";
import { normalizePhoneInput, normalizeAddress } from "../../lib/formatters";

export default function DeliveryForm({
  user,
  deliveryDetails,
  setDeliveryDetails,
  note,
  setNote,
  errors,
  onNext,
}) {
  const updateField = (field, value) => {
    setDeliveryDetails((current) => ({ ...current, [field]: value }));
  };

  return (
    <div>
      <h2
        className="font-semibold text-stone-900 text-lg mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Delivery information
      </h2>

      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <span className="font-semibold">Lagos only:</span> ordering and delivery
        are currently available in selected LGAs across Lagos State.
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
            Full name
          </label>
          <input
            type="text"
            value={user?.name ?? ""}
            readOnly
            className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
            Street address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={deliveryDetails.address}
            onChange={(e) => updateField("address", e.target.value)}
            onBlur={(e) =>
              updateField("address", normalizeAddress(e.target.value))
            }
            placeholder="e.g. 12B Adeniran Ogunsanya St, Surulere"
            rows={2}
            autoComplete="street-address"
            className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 resize-none transition-colors ${errors.address ? "border-red-300 bg-red-50" : "border-stone-200 bg-stone-50 focus:border-orange-400"}`}
          />
          <p className="text-xs text-stone-500 mt-1">
            Include house/flat number, street and a short landmark.
          </p>
          {errors.address && (
            <p className="text-xs text-red-600 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
            Landmark (optional)
          </label>
          <input
            type="text"
            value={deliveryDetails.landmark || ""}
            onChange={(e) => updateField("landmark", e.target.value)}
            onBlur={(e) =>
              updateField("landmark", normalizeAddress(e.target.value))
            }
            placeholder="E.g. Near Shoprite, behind the mosque"
            className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
            LGA (City) <span className="text-red-500">*</span>
          </label>
          <select
            value={deliveryDetails.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={`w-full h-11 px-4 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-colors ${errors.city ? "border-red-300 bg-red-50" : "border-stone-200 bg-stone-50 focus:border-orange-400"}`}
          >
            <option value="">Select LGA</option>
            {[
              "Agege",
              "Ajeromi-Ifelodun",
              "Alimosho",
              "Amuwo-Odofin",
              "Apapa",
              "Badagry",
              "Epe",
              "Eti-Osa",
              "Ibeju-Lekki",
              "Ifako-Ijaiye",
              "Ikeja",
              "Ikorodu",
              "Kosofe",
              "Lagos Island",
              "Lagos Mainland",
              "Mushin",
              "Oshodi-Isolo",
              "Ojo",
              "Surulere",
              "Somolu",
              "Ikoyi",
              "Lekki",
            ].map((lga) => (
              <option key={lga} value={lga}>
                {lga}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-xs text-red-600 mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={deliveryDetails.phone}
            onChange={(e) =>
              updateField("phone", normalizePhoneInput(e.target.value))
            }
            placeholder="08012345678 or +2348012345678"
            autoComplete="tel"
            className={`w-full h-11 px-4 rounded-xl border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-colors ${errors.phone ? "border-red-300 bg-red-50" : "border-stone-200 bg-stone-50 focus:border-orange-400"}`}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
            Delivery note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Gate code, landmark, special instructions..."
            className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
          />
        </div>

        <button
          onClick={onNext}
          className="mt-6 w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm rounded-xl transition-colors"
        >
          Continue to review
        </button>
      </div>
    </div>
  );
}
