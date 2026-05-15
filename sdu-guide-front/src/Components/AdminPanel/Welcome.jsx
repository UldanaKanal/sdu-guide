import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppBar from "./AppBar";

function Card({ children, className }) {
  return <div className={`bg-white p-6 rounded-lg shadow ${className}`}>{children}</div>;
}

function CardHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

function CardTitle({ children }) {
  return <h2 className="text-center text-2xl font-bold">{children}</h2>;
}

function CardContent({ children }) {
  return <div className="text-center">{children}</div>;
}

function Button({ children, onClick }) {
  return (
    <button
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function AdminWelcome() {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/profile", { withCredentials: true })
      .then(response => {
        if (response.status !== 200) {
          navigate("/login");
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  return (
    <div className="">
       <AppBar/>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Добро пожаловать в Админ Панель</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="">Управляйте системой с удобным интерфейсом.</p>
          <Button onClick={() => navigate("/admin/rooms")}>Перейти в панель управления</Button>
        </CardContent>
      </Card>
    </div>
  );
}