import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/profile", {
                    withCredentials: true
                });

                console.log("Profile Data:", response.data); // Для отладки
                setUser(response.data.data); // Теперь берем данные из data.data

            } catch (error) {
                console.error("Error fetching profile data:", error);
                if (error.response && error.response.status === 401) {
                    navigate("/");
                }
            }
        };

        fetchProfileData();
    }, [navigate]);

    return (
        <div>
            <AppBar />
            <div style={{ display: "flex", flexDirection: "column", marginBottom: "50px" }} className="container mt-4">
                <div style={{ marginLeft: "100px", marginRight: "100px", marginTop: "60px" }}>
                    <h1 style={{ fontSize: "50px", color: "#33437C", fontWeight: "lighter" , textAlign:"center"}}>Личный кабинет</h1>
                    {user && (
                        <div style={{ display: "flex", alignItems: "start", justifyContent: "center", marginTop: "30px" }}>
                            {/* Блок с аватаром */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "100px" }}>
                                <img 
                                    src={user.imageHash ? `http://localhost:8000/image/${user.imageHash}` : "https://via.placeholder.com/250"} 
                                    alt="User" 
                                    style={{ width: "400px", borderRadius: "10%" }} 
                                />
                                {/* Кнопка редактирования */}
                                <button 
                                    onClick={() => navigate("/update-user")}
                                    style={{
                                        marginTop: "15px",
                                        padding: "10px 20px",
                                        fontSize: "18px",
                                        color: "#fff",
                                        backgroundColor: "#33437C",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        transition: "0.3s"
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = "#222E5C"}
                                    onMouseOut={(e) => e.target.style.backgroundColor = "#33437C"}
                                >
                                    Редактировать профиль
                                </button>
                            </div>

                            {/* Блок с данными профиля */}
                            <div style={{ flexDirection: "column", marginRight: "50px" }}>
                                <ProfileField label="Имя" value={user.firstName || "N/A"} />
                                <ProfileField label="Фамилия" value={user.lastName || "N/A"} />
                                <ProfileField label="Никнейм" value={user.username} />
                                <ProfileField label="Почта" value={user.email} />
                                <ProfileField label="Дата регистрации" value={formatDate(user.registrationDate)} />
                                <ProfileField label="Последний вход" value={formatDate(user.lastLogin)} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Компонент для отображения полей профиля
const ProfileField = ({ label, value }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "start", marginBottom: "20px" }}>
        <label style={{ fontSize: "20px", marginBottom: "5px", color: "#33437C" }}>{label}</label>
        <input type="text" value={value} disabled style={{ fontSize: "20px", width: "300px", color: "#33437C" }} />
    </div>
);

// Функция форматирования даты
const formatDate = (isoString) => {
    if (!isoString || isoString === "0001-01-01T00:00:00Z") return "N/A";
    return new Date(isoString).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" });
};

export default ProfilePage;
