import OrderStatusBadge from "../components/OrderStatusBadge";
import { normalizePhoneInput, normalizeAddress } from "../lib/formatters";

export const LAGOS_LGAS = [
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
];

export const LABEL =
  "block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide";
export const INPUT =
  "w-full h-11 px-4 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-900";
export const PRIMARY =
  "h-11 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors";
export const SECONDARY =
  "h-10 px-5 border border-stone-200 text-stone-700 text-sm font-medium rounded-xl hover:bg-stone-50 transition-colors";

export function ProfileHeader({ user, onLogout }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center flex-shrink-0">
        <span className="text-orange-600 text-xl font-bold">
          {(user?.name ?? "U").charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h1
          className="text-lg font-semibold text-stone-900 truncate"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {user?.name ?? "Guest"}
        </h1>
        <p className="text-stone-500 text-sm truncate">{user?.email}</p>
        <p className="text-xs text-stone-400 mt-0.5">
          Member since{" "}
          {user?.joinedAt
            ? new Date(user.joinedAt).toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })
            : "—"}
        </p>
      </div>

      <button
        onClick={onLogout}
        className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
      >
        Sign out
      </button>
    </div>
  );
}

export function TabButton({ tab, activeTab, onClick, label }) {
  const isActive = tab === activeTab;

  return (
    <button
      className={
        "flex-1 h-12 text-sm font-medium border-b-2 " +
        (isActive
          ? "border-orange-500 text-orange-600 bg-orange-50/50"
          : "border-transparent text-stone-500 hover:text-stone-900 hover:bg-stone-50")
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function ProfileField({ label, children, error }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

export function ProfileDetailsForm({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  lga,
  setLga,
  address,
  setAddress,
  landmark,
  setLandmark,
  editMode,
  profileError,
  saved,
  onSaveProfile,
  onCancelEdit,
  onStartEdit,
}) {
  const fieldClass = editMode
    ? "bg-white border-stone-200 text-stone-900"
    : "bg-stone-50 border-stone-200 text-stone-600 cursor-default";

  return (
    <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-stone-200 p-6 shadow-sm">
      {saved && (
        <div className="mb-5 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <ProfileField label="Full name">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              readOnly={!editMode}
              className={`w-full h-11 px-4 rounded-xl border text-sm transition-colors ${fieldClass}`}
            />
          </ProfileField>

          <ProfileField label="Email address">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              readOnly={!editMode}
              className={`w-full h-11 px-4 rounded-xl border text-sm transition-colors ${fieldClass}`}
            />
          </ProfileField>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <ProfileField label="Phone number">
            <input
              value={phone}
              onChange={(event) =>
                setPhone(normalizePhoneInput(event.target.value))
              }
              readOnly={!editMode}
              className={`w-full h-11 px-4 rounded-xl border text-sm transition-colors ${fieldClass}`}
              placeholder="08012345678"
            />
          </ProfileField>

          <ProfileField label="LGA (City)">
            <select
              value={lga}
              onChange={(event) => setLga(event.target.value)}
              disabled={!editMode}
              className={`w-full h-11 px-4 rounded-xl border text-sm transition-colors ${fieldClass}`}
            >
              <option value="">Select LGA</option>
              {LAGOS_LGAS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </ProfileField>
        </div>

        <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50/70 p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3
                className="text-sm font-semibold text-stone-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Delivery address
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Add the exact place your order should be delivered.
              </p>
            </div>
          </div>

          <ProfileField label="Street address">
            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onBlur={(event) =>
                setAddress(normalizeAddress(event.target.value))
              }
              rows={3}
              readOnly={!editMode}
              className={`w-full px-4 py-3 rounded-xl border text-sm resize-none transition-colors ${fieldClass}`}
              placeholder="House number, street, and building name"
            />
          </ProfileField>

          <ProfileField label="Landmark (optional)">
            <input
              value={landmark}
              onChange={(event) => setLandmark(event.target.value)}
              onBlur={(event) =>
                setLandmark(normalizeAddress(event.target.value))
              }
              readOnly={!editMode}
              className={`w-full h-11 px-4 rounded-xl border text-sm transition-colors ${fieldClass}`}
              placeholder="Nearest landmark"
            />
          </ProfileField>
        </div>

        {profileError && <p className="text-sm text-red-600">{profileError}</p>}

        <div className="flex gap-3 pt-2">
          {editMode ? (
            <>
              <button onClick={onSaveProfile} className={`${PRIMARY} flex-1`}>
                Save changes
              </button>
              <button onClick={onCancelEdit} className={SECONDARY}>
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onStartEdit}
              className="h-10 px-5 border border-orange-200 text-orange-600 text-sm font-medium rounded-xl hover:bg-orange-50 transition-colors"
            >
              Edit profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function OrderHistoryPanel({ recentOrders, navigate }) {
  if (recentOrders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
        <p className="font-semibold text-stone-900 mb-1">No orders yet</p>
        <p className="text-stone-500 text-sm mb-4">
          You haven't placed an order yet.
        </p>
        <button onClick={() => navigate("menu")} className={`${PRIMARY} px-5`}>
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentOrders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-4"
        >
          <div className="flex -space-x-2 flex-shrink-0">
            {order.items.slice(0, 2).map((item, index) => (
              <img
                key={`${item.name}-${index}`}
                src={item.imageUrl}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover bg-stone-100 border-2 border-white"
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-xs text-stone-500">
                #{order.id}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-stone-500">
              {new Date(order.createdAt).toLocaleDateString()} ·{" "}
              {order.total && order.total.toLocaleString
                ? `₦${order.total.toLocaleString()}`
                : ""}
            </p>
          </div>

          <button
            onClick={() => navigate("order-tracking", { orderId: order.id })}
            className="flex-shrink-0 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            View
          </button>
        </div>
      ))}

      <button
        onClick={() => navigate("orders")}
        className="w-full text-sm font-medium text-orange-600 hover:text-orange-700 py-2 text-center"
      >
        View all orders →
      </button>
    </div>
  );
}

export function SecurityPanel() {
  const handleChangePassword = (event) => event.preventDefault();

  return (
    <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-stone-200 p-6">
      <h2 className="font-semibold text-stone-900 mb-4">Change password</h2>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className={LABEL}>Current password</label>
          <input type="password" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>New password</label>
          <input type="password" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Confirm new password</label>
          <input type="password" className={INPUT} />
        </div>
        <button type="submit" className={`${PRIMARY} w-full mt-2`}>
          Update password
        </button>
      </form>
    </div>
  );
}
