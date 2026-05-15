import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthCheck from "./useAuthCheck";
import { Input, Button } from "./Elements";

export function SignUp() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await axios.post("http://localhost:8000/sign-up", { login, email, password });
      navigate("/login");
    } catch (error) {
      alert("Ошибка регистрации");
    }
  };

  const isAuthenticated = useAuthCheck();

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(to bottom right, #ebf8ff, #bfdbfe)", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "480px", background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 6px 10px rgba(0, 0, 0, 0.1)", border: "1px solid #e5e7eb" }}>
      <div style={{ background: "#4b5563", color: "white", textAlign: "center", padding: "12px", borderRadius: "6px 6px 0 0", fontWeight: "600" }}>
          Admin area
        </div>
        <h2 style={{ fontSize: "28px", fontWeight: "700", textAlign: "center", color: "#1f2937", marginBottom: "28px" }}>Регистрация</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Input 
            type="text" 
            placeholder="Логин" 
            value={login} 
            onChange={(e) => setLogin(e.target.value)}
            style={{ width: "100%", padding: "16px", border: "1px solid #d1d5db", borderRadius: "10px", outline: "none", fontSize: "18px" }}
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "16px", border: "1px solid #d1d5db", borderRadius: "10px", outline: "none", fontSize: "18px" }}
          />
          <Input 
            type="password" 
            placeholder="Пароль" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "16px", border: "1px solid #d1d5db", borderRadius: "10px", outline: "none", fontSize: "18px" }}
          />
          <Button 
            onClick={handleSignUp} 
            style={{ width: "100%", background: "#ef4444", color: "white", fontWeight: "700", padding: "16px", borderRadius: "10px", fontSize: "18px", cursor: "pointer", transition: "background 0.3s" }}
            onMouseOver={(e) => e.target.style.background = "#dc2626"}
            onMouseOut={(e) => e.target.style.background = "#ef4444"}
          >
            Зарегистрироваться
          </Button>
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "16px" }}>
            Уже есть аккаунт? <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => navigate("/login")}>
              Войти
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}