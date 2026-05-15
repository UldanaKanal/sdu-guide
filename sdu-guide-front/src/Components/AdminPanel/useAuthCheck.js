import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function useAuthCheck() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  const checkAuth = useCallback(() => {
    const login = window.prompt("Введите логин:");
    const password = window.prompt("Введите пароль:");
    
    if (login === "admin" && password === "password") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
    } else {
      alert("Неверные учетные данные");
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(checkAuth, 4);
      return () => clearTimeout(timer);
    }
  }, [checkAuth, isAuthenticated]);

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/");
  };

  return { isAuthenticated, logout };
}

export default useAuthCheck;
