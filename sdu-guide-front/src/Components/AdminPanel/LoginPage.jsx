import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthCheck from "./useAuthCheck";
import { Input, Button } from "./Elements";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await axios.post("http://localhost:8000/sign-in", { email, password }, { withCredentials: true });
      navigate("/admin");
    } catch (error) {
      alert("Ошибка входа");
    }
  };

  const isAuthenticated = useAuthCheck();
  if (!isAuthenticated) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(to bottom right, #ebf8ff, #bfdbfe)", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "white", padding: "32px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" }}>
        <div style={{ background: "#4b5563", color: "white", textAlign: "center", padding: "12px", borderRadius: "6px 6px 0 0", fontWeight: "600" }}>
          Admin area
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", color: "#1f2937", marginBottom: "28px" }}>Авторизация</h2>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input 
            type="email" 
            placeholder="Логин" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "16px", background: "#e0edff" }}
          />
          <Input 
            type="password" 
            placeholder="••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "16px", background: "#e0edff" }}
          />
          <Button 
            onClick={handleSignIn} 
            style={{ width: "100%", background: "#f87171", color: "white", fontWeight: "600", padding: "12px", borderRadius: "6px", cursor: "pointer", transition: "background 0.3s" }}
            onMouseOver={(e) => e.target.style.background = "#ef4444"}
            onMouseOut={(e) => e.target.style.background = "#f87171"}
          >
            Log in
          </Button>
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px" }}>
            Нет аккаунта? <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => navigate("/register")}>
              Регистрация
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
