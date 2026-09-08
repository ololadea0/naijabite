import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../lib/api";
import { setAuthUser } from "../store/authSlice";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  LAGOS_LGAS,
  ProfileHeader,
  TabButton,
  ProfileDetailsForm,
  OrderHistoryPanel,
  SecurityPanel,
} from "./ProfilePageSections";
import { normalizePhoneInput, normalizeAddress } from "../lib/formatters";

export default function ProfilePage({ navigate, onLogout }) {
  const { user, orders } = useApp();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lga, setLga] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(
      normalizePhoneInput(user.deliveryAddress?.phone || user.phone || ""),
    );
    setAddress(user.deliveryAddress?.address || user.address || "");
    setLandmark(user.deliveryAddress?.landmark || "");
    setLga(user.deliveryAddress?.city || user.city || "");
  }, [user]);

  const recentOrders = (orders || [])
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleSaveProfile = async () => {
    setProfileError("");

    if (
      address.trim() &&
      !LAGOS_LGAS.map((location) => location.toLowerCase()).includes(
        (lga || "").toLowerCase(),
      )
    ) {
      setProfileError("Delivery address must be in Lagos (select a valid LGA)");
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        deliveryAddress: {
          address: normalizeAddress(address.trim()),
          landmark: normalizeAddress(landmark.trim()),
          city: lga.trim() || "",
          phone: phone.trim(),
        },
      };

      const response = await api.put("/users/profile", payload);
      dispatch(setAuthUser(response.data));
      setSaved(true);
      setEditMode(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Failed to save profile", error);
      setProfileError(
        error.response?.data?.message || "Failed to save profile",
      );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Navbar currentPage="profile" navigate={navigate} />

      <div className="max-w-3xl mx-auto px-6 py-8 w-full flex-1">
        <ProfileHeader user={user} onLogout={onLogout} />

        <div className="flex border-b border-stone-200 mb-5 bg-white rounded-t-2xl overflow-hidden">
          <TabButton
            tab="profile"
            activeTab={tab}
            onClick={() => setTab("profile")}
            label="Profile"
          />
          <TabButton
            tab="orders"
            activeTab={tab}
            onClick={() => setTab("orders")}
            label="Order history"
          />
          <TabButton
            tab="security"
            activeTab={tab}
            onClick={() => setTab("security")}
            label="Security"
          />
        </div>

        {tab === "profile" && (
          <ProfileDetailsForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            lga={lga}
            setLga={setLga}
            address={address}
            setAddress={setAddress}
            landmark={landmark}
            setLandmark={setLandmark}
            editMode={editMode}
            profileError={profileError}
            saved={saved}
            onSaveProfile={handleSaveProfile}
            onCancelEdit={() => setEditMode(false)}
            onStartEdit={() => setEditMode(true)}
          />
        )}

        {tab === "orders" && (
          <OrderHistoryPanel recentOrders={recentOrders} navigate={navigate} />
        )}
        {tab === "security" && <SecurityPanel />}
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}
