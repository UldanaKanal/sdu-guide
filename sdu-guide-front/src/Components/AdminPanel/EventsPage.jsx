import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import AppBar from "./AppBar";
import styles from "./RoomsPage.module.css"; // Подключаем стили

export default function EventsList() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); 

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);






  const [newEvent, setNewEvent] = useState({ name: "", place: "", date:"", startTime: "", endTime: "", hash:"",shortName:"" });

  useEffect(() => {
    axios.get("http://localhost:8000/getAll-events", { withCredentials: true, params:{withEnded: true} })
      .then(response => {
        setEvents(response.data.data);
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


  const handleClearHash = () => {
    setNewEvent({ ...newEvent, hash: "" });
  
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Очистить файл в uploader'е
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editMode ? `http://localhost:8000/update-event` : "http://localhost:8000/create-event";
    const method = editMode ? axios.put : axios.post;
  
    // Преобразование даты в формат RFC3339
    const formattedEvent = {
      ...newEvent,
      date: newEvent.date ? new Date(newEvent.date).toISOString() : "", 
    };
  
    method(url, formattedEvent, { withCredentials: true })
      .then(() => {
        setShowForm(false);
        setEvents(editMode
          ? events.map(event => (event.id === selectedEvent.id ? { ...event, ...formattedEvent } : event))
          : [...events, { ...formattedEvent }]
        );
        setEditMode(false);
      })
      .catch(() => alert("Ошибка при сохранении события"));
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту комнату?")) return;
  
    try {
      await axios.delete(`http://localhost:8000/delete-event/${id}`, { withCredentials: true });
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      alert("Ошибка при удалении комнаты");
    }
  };
  



  const handleEdit = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      id: event.id,
      name: event.name,
      place: event.place,
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      startTime: event.startTime,
      endTime: event.endTime,
      ended: event.ended || false, // Если ended нет, по умолчанию false 
      hash: event.hash,
      shortName: event.shortName
    });
    setEditMode(true);
    setShowForm(true);
  };
  

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      const response = await axios.post("http://localhost:8000/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setNewEvent((prev) => ({ ...prev, hash: response.data.hash }));
    } catch {
      alert("Ошибка загрузки файла");
    }
  };



  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <AppBar />
      <div className={styles.container} style={{}}>
        {/* Начало фильтра */}
        <div className={styles.filterContainer} style={{ display:"flex", flexDirection:"row", justifyContent:"end"}}>
          <button className={styles.addButton} onClick={() => { 
            setShowForm(true); 
            setEditMode(false); 
          }} style={{height:"40px", alignSelf:'end'}}
          >
            <PlusCircle className={styles.icon} /> Добавить ивент
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
              {editMode ? "Редактировать ивент" : "Создать новый ивент"}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
            
                
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Название:</label>
              <input
                type="text"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />

               <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Краткое название(для календаря):</label>
              <input
                type="text"
                value={newEvent.shortName}
                onChange={(e) => setNewEvent({ ...newEvent, shortName: e.target.value })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />

              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Место:</label>
              <input
                type="text"
                value={newEvent.place}
                onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />
               <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Дата:</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />
              
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Начало:</label>
              <input
                type="time"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />
              
              <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Конец:</label>
              <input
                type="time"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                required
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  outline: "none",
                  transition: "border 0.2s",
                }}
              />

                <label style={{ fontWeight: "bold", marginBottom: "5px", color: "#555" }}>Завершено:</label>
                <input
                type="checkbox"
                checked={newEvent.ended}
                onChange={(e) => setNewEvent({ ...newEvent, ended: e.target.checked })}
                />

              
                <input type="file" id="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor="file" style={{ padding: '10px 20px', backgroundColor: '#33437C', color: '#fff', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', fontWeight: "bold" }}>Выберите файл</label>
              
                {newEvent.hash && (
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
              <th>Название</th>
              <th>Кратко название</th>
              <th>Место</th>
              <th>Фото</th>
              <th>Дата</th>
              <th>Начало</th>
              <th>Конец</th>
              <th>Завершено</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.name}</td>
                <td>{event.shortName}</td>
                <td>{event.place}</td>
                <td>
                    {event.hash ? (
                        <img
                        src={`http://localhost:8000/image/${event.hash}`}
                        alt="Event"
                        style={{ width: "150px" }}
                        />
                    ) : (
                        <span>-</span>
                    )}
                </td>

                <td>{new Date(event.date).toLocaleDateString("ru-RU").replace(/\//g, '.')}</td>
                <td>{event.startTime}</td>
                <td>{event.endTime}</td>
                <td>{event.ended ? "✅ Да" : "❌ Нет"}</td>
                <td className={styles.actions}>
                  <button onClick={() => handleEdit(event)}><Edit /></button>
                  <button onClick={() => handleDelete(event.id)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
