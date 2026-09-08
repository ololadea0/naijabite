import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearAuthError } from "../store/authSlice";

export default function LoginPage({ onLoginSuccess, onNavigateRegister }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    if (!email.trim()) {
      emailRef.current?.focus();
      return;
    }

    if (!password) return;

    try {
      const payload = await dispatch(loginUser({ email, password })).unwrap();
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess(payload);
      } else {
        navigate("/");
      }
    } catch (loginError) {
      console.error("Login failed:", loginError);
    }
  };

  const loading = status === "loading";

  return (
    <div className="min-h-screen flex bg-stone-50">
      <div className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden bg-stone-950">
        <img
          src="https://images.unsplash.com/photo-1692197275441-40c874f40385?w=900&h=1200&fit=crop&auto=format"
          alt="Premium restaurant food"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20" />
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

          <div className="space-y-6">
            <blockquote className="space-y-3">
              <p
                className="text-white text-3xl xl:text-4xl font-medium leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Good food,
                <br />
                <em className="text-orange-400 not-italic">in Lagos.</em>
              </p>
              <p className="text-stone-400 text-base leading-relaxed max-w-xs">
                We currently offer food delivery and ordering for eligible areas
                across Lagos State only.
              </p>
            </blockquote>

            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-300 mb-1">
                Service area
              </p>
              <p className="text-sm text-stone-200">
                Delivery is available only within select LGAs in Lagos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600 mb-2">
              Welcome back
            </p>
            <h1
              className="text-3xl font-semibold text-stone-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Sign in to continue
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
                Email address
              </label>
              <input
                type="email"
                ref={emailRef}
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm rounded-xl transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 hover:shadow-orange-500/30"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-stone-500 mt-6">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-orange-600 font-semibold hover:text-orange-700"
              >
                Create one
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
