import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu } from "lucide-react";
import useAuthCheck from "./useAuthCheck";


export default function AppBar() {
  const navigate = useNavigate();
   const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
    const { isAuthenticated, logout } = useAuthCheck();


  useEffect(() => {
    axios
      .get("http://localhost:8000/profile", { withCredentials: true })
      .then((response) => {
        if (response.status !== 200) {
          console.log("HEHEHE")
          navigate("/login");
        }
        const userData = response.data.data;
        setUser(userData);
      })
      .catch(() => {
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    axios
      .get("http://localhost:8000/logout", { withCredentials: true })
      .then(() => {
        logout();
      })
      .catch(() => {
        alert("Ошибка при выходе");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        background: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
        borderBottom: "2px solid #f0f0f0",
      }}
    >
      {/* Логотип */}
      <img
        src="/icons/logoDark.svg"
        alt="Logo"
        width="100"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      />

      {/* Навигация */}
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div
          style={{
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            color: "#333",
            transition: "color 0.3s",
          }}
          onClick={() => navigate("/admin")}
          onMouseEnter={(e) => (e.target.style.color = "#007bff")}
          onMouseLeave={(e) => (e.target.style.color = "#333")}
        >
          Home
        </div>

        <div
          style={{
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            color: "#333",
            transition: "color 0.3s",
          }}
          onClick={() => navigate("/admin/rooms")}
          onMouseEnter={(e) => (e.target.style.color = "#007bff")}
          onMouseLeave={(e) => (e.target.style.color = "#333")}
        >
          Rooms
        </div>

        <div
          style={{
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            color: "#333",
            transition: "color 0.3s",
          }}
          onClick={() => navigate("/admin/events")}
          onMouseEnter={(e) => (e.target.style.color = "#007bff")}
          onMouseLeave={(e) => (e.target.style.color = "#333")}
        >
          Events
        </div>
      </div>

      {/* Профиль */}
      <div style={{ position: "relative" }}>
      <div
        style={{
          width: "42px",
          height: "42px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "#007bff",
          color: "white",
          fontWeight: "bold",
          fontSize: "18px",
          cursor: "pointer",
          transition: "background 0.3s",
          overflow: "hidden", // Обеспечивает правильное отображение изображения
        }}
        onClick={() => setShowMenu(!showMenu)}
        onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.background = "#007bff")}
      >
        {user?.imageHash ? (
          <img
            src={`http://localhost:8000/image/${user.imageHash}`}
            alt="User Avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <span style={{ color: "white", fontSize: "18px", fontWeight: "bold" }}>U</span>
        )}
      </div>



        {/* Выпадающее меню */}
        {showMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50px",
              background: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              overflow: "hidden",
              width: "160px",
              zIndex: 1000,
            }}
          >
            <button
              onClick={() => navigate("/profile")}
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                textAlign: "left",
                background: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
            >
              Профиль
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                textAlign: "left",
                background: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "red",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f8d7da")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
