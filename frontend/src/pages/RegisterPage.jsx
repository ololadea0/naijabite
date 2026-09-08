import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, clearAuthError } from "../store/authSlice";

export default function RegisterPage({ onRegisterSuccess, onNavigateLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!name.trim() || !email.trim() || password.length < 6 || !agreed) {
      return;
    }

    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      if (typeof onRegisterSuccess === "function") {
        onRegisterSuccess();
      } else {
        navigate("/auth");
      }
    } catch (registerError) {
      console.error("Registration failed:", registerError);
    }
  };

  const loading = status === "loading";

  return (
    <div className="min-h-screen flex bg-stone-50">
      <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden bg-stone-950">
        <img
          src="https://images.unsplash.com/photo-1692197277937-c8d62dc93f18?w=900&h=1200&fit=crop&auto=format"
          alt="Restaurant atmosphere"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/20" />
        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M9 6.5V16.5M7.7 7.8H10.3M7.7 10.2H10.3M7.7 12.6H10.3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M14.5 7.25C15.25 7.25 15.9 8 15.9 8.8C15.9 9.87 15.15 10.7 14.5 11.2V17.2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.7 8.7C16.8 8.7 17.7 9.6 17.7 10.7C17.7 12 16.9 13 15.7 13.2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span
              className="text-white text-xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              NaijaBite
            </span>
          </div>

          <div className="flex-1" />

          <div className="space-y-5">
            <p
              className="text-white text-3xl xl:text-4xl font-medium leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your next favourite
              <br />
              <em className="text-orange-400 not-italic">meal is waiting.</em>
            </p>
            <p className="text-stone-400 text-base leading-relaxed max-w-xs">
              Join thousands of food lovers who order smarter and eat better
              every day.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              {[
                "Free delivery on your first order",
                "Exclusive deals and promotions",
                "Real-time order tracking",
              ].map((text) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  <span className="text-sm text-stone-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600 mb-2">
              Join today
            </p>
            <h1
              className="text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Create your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Alex Johnson"
                className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreed}
                onClick={() => setAgreed((v) => !v)}
                className={`w-4.5 h-4.5 mt-0.5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${agreed ? "bg-orange-500 border-orange-500" : "bg-white border-stone-300"}`}
              >
                {agreed && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                    aria-hidden="true"
                  >
                    <polyline
                      points="20 6 9 17 4 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <span
                className="text-sm text-stone-600 leading-snug cursor-pointer"
                onClick={() => setAgreed((v) => !v)}
              >
                I agree to the{" "}
                <span className="text-orange-600 font-medium hover:text-orange-700">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-orange-600 font-medium hover:text-orange-700">
                  Privacy Policy
                </span>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-orange-600 font-semibold hover:text-orange-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
