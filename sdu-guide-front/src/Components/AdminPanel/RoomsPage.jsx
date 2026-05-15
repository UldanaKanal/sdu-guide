import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, FolderOpenDot, PlusCircle } from "lucide-react";
import AppBar from "./AppBar";
import styles from "./RoomsPage.module.css"; // Подключаем стили

export default function RoomsList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const fileInputRef = useRef(null); 
  const [blockFilter, setBlockFilter] = useState("");
  const [numberFilter, setNumberFilter] = useState("");

  const numberOptions = [
    ...Array.from({ length: 8 }, (_, i) => 101 + i),
    ...Array.from({ length: 8 }, (_, i) => 201 + i),
    ...Array.from({ length: 8 }, (_, i) => 301 + i),
    401, 402, 403,
  ];

  const handleClearHash = () => {
    setNewRoom({ ...newRoom, hash: "" });
  
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Очистить файл в uploader'е
    }
  };
  const [newRoom, setNewRoom] = useState({ block: "D", number: 101, sef: "", hash: "" });

  useEffect(() => {
    axios.get("http://localhost:8000/getAll-rooms", { withCredentials: true })
      .then(response => {
        setRooms(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        } else {
          setError("Ошибка загрузки данных");
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getAll-rooms", {
          params: {
            block: blockFilter,
            number: numberFilter,
          },
          withCredentials: true,
        });
        setRooms(response.data.data);
      } catch (error) {
        setError("Ошибка загрузки данных");
      }
    };
  
    fetchRooms();
  }, [blockFilter, numberFilter]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editMode ? `http://localhost:8000/update-room` : "http://localhost:8000/create-room";
    const method = editMode ? axios.put : axios.post;
    
    method(url, newRoom, { withCredentials: true })
      .then(() => {
        setShowForm(false);
        setRooms(editMode
          ? rooms.map(room => (room.id === selectedRoom.id ? { ...room, ...newRoom } : room))
          : [...rooms, { ...newRoom }]
        );
        setEditMode(false);
      })
      .catch(() => alert("Ошибка при сохранении комнаты"));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту комнату?")) return;
  
    try {
      await axios.delete(`http://localhost:8000/delete-room/${id}`, { withCredentials: true });
      setRooms(rooms.filter(room => room.id !== id));
    } catch (error) {
      alert("Ошибка при удалении комнаты");
    }
  };
  

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("xlsx", file);
    
    try {
      const response = await axios.post("http://localhost:8000/upload-XLSX", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setNewRoom((prev) => ({ ...prev, hash: response.data.hash }));
    } catch {
      alert("Ошибка загрузки файла");
    }
  };

  const handleEdit = (room) => {
    setNewRoom(room);
    setSelectedRoom(room);
    setEditMode(true);
    setShowForm(true);
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <AppBar />
      <div className={styles.container}>
        {/* Начало фильтра */}
        <div className={styles.filterContainer} style={{ display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "300px" }}>
  {/* Блок */}
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>Блок:</label>
    <div style={{ position: "relative", width: "100%" }}>
      <select
        onChange={(e) => setBlockFilter(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          fontSize: "14px",
          backgroundColor: "white",
          appearance: "none",
          cursor: "pointer",
          transition: "border-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.borderColor = "#888")}
        onMouseLeave={(e) => (e.target.style.borderColor = "#ccc")}
        onFocus={(e) => {
          e.target.style.borderColor = "#007bff";
          e.target.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#ccc";
          e.target.style.boxShadow = "none";
        }}
      >
        <option value="">Все блоки</option>
        {["D", "E", "F", "G", "H", "I"].map((blk) => (
          <option key={blk} value={blk}>{blk}</option>
        ))}
      </select>
      <span
        style={{
          content: "▼",
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          color: "#666",
          pointerEvents: "none",
        }}
      >
        ▼
      </span>
    </div>
  </div>

  {/* Номер */}
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <label style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>Номер:</label>
    <div style={{ position: "relative", width: "100%" }}>
      <select
      onChange={(e) => setNumberFilter(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 12px",
          border: "2px solid #ccc",
          borderRadius: "8px",
          fontSize: "14px",
          backgroundColor: "white",
          appearance: "none",
          cursor: "pointer",
          transition: "border-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.borderColor = "#888")}
        onMouseLeave={(e) => (e.target.style.borderColor = "#ccc")}
        onFocus={(e) => {
          e.target.style.borderColor = "#007bff";
          e.target.style.boxShadow = "0 0 5px rgba(0, 123, 255, 0.5)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#ccc";
          e.target.style.boxShadow = "none";
        }}
      >
        <option value="">Все номера</option>
        {numberOptions.map((num) => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      <span
        style={{
          content: "▼",
          position: "absolute",
          top: "50%",
          right: "12px",
          transform: "translateY(-50%)",
          color: "#666",
          pointerEvents: "none",
        }}
      >
        ▼
      </span>
    </div>
  </div>
</div>


          <button className={styles.addButton} onClick={() => { 
            setShowForm(true); 
            setEditMode(false); 
          }} style={{height:"40px", alignSelf:'end'}}
          >
            <PlusCircle className={styles.icon} /> Добавить комнату
          </button>
        </div>
        {/* Конец фильтра */}

        {showForm && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              width: "350px",
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <h3 style={{ textAlign: "center", color: "#333", marginBottom: "10px" }}>
              {editMode ? "Редактировать комнату" : "Создать новую комнату"}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Блок:</label>
              <select
                value={newRoom.block}
                onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              >
                {["D", "E", "F", "G", "H", "I"].map((blk) => (
                  <option key={blk} value={blk}>{blk}</option>
                ))}
              </select>
              
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Номер:</label>
              <select
                value={newRoom.number}
                onChange={(e) => setNewRoom({ ...newRoom, number: parseInt(e.target.value, 10) })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              >
                {numberOptions.map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>SEF:</label>
              <input
                type="text"
                value={newRoom.sef}
                onChange={(e) => setNewRoom({ ...newRoom, sef: e.target.value })}
                onFocus={() => {
                  if (!newRoom.sef.trim()) {
                    const generatedSEF = `${newRoom.block}-${newRoom.number}`.toLowerCase();
                    setNewRoom({ ...newRoom, sef: generatedSEF });
                  }
                }}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />
              
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Загрузить XLSX:</label>
              <input type="file" accept=".xlsx" onChange={handleFileUpload} style={{ marginBottom: "10px" }} />
              
              {newRoom.hash && (
                <button
                  type="button"
                  onClick={handleClearHash}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#333",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background 0.3s",
                    marginBottom: "10px",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#e0a800")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#ffc107")}
                >
                  Очистить hash
                </button>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
                >
                  {editMode ? "Сохранить" : "Создать"}
                </button>

                <button
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    transition: "background 0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}


        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Блок</th>
              <th>Номер</th>
              <th>SEF</th>
              <th>Hash</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.block}</td>
                <td>{room.number}</td>
                <td>{room.sef}</td>
                <td>{room.hash}</td>
                <td className={styles.actions}>
                  <button onClick={() => handleEdit(room)}><Edit /></button>
                  <button onClick={() => handleDelete(room.id)}>
                    <Trash2 />
                  </button>
                  {room.hash && (
                    <button onClick={() => navigate("/xlsxViewer/" + room.hash)}>
                      <FolderOpenDot />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
