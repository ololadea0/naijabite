import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

export default function AuthPage({
  onLoginSuccess,
  onRegisterSuccess,
  initialMode = "login",
}) {
  const [mode, setMode] = useState(initialMode);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {mode === "login" ? (
        <LoginPage
          onLoginSuccess={onLoginSuccess}
          onNavigateRegister={() => setMode("register")}
        />
      ) : (
        <RegisterPage
          onRegisterSuccess={() => {
            setMode("login");
            onRegisterSuccess && onRegisterSuccess();
          }}
          onNavigateLogin={() => setMode("login")}
        />
      )}
    </div>
  );
}
