import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, CheckCircle, XCircle, Loader, User, Hash } from "lucide-react";

const GREEN = "#4C6740";
const LS_NAME = "sdu_student_name";
const LS_ID   = "sdu_student_id";
const today   = () => new Date().toISOString().slice(0, 10);

export default function BookingPanel({ room }) {
    const [studentName, setStudentName] = useState(() => localStorage.getItem(LS_NAME) || "");
    const [studentId,   setStudentId]   = useState(() => localStorage.getItem(LS_ID)   || "");
    const [date,        setDate]        = useState(today());
    const [avail,       setAvail]       = useState(null);
    const [loading,     setLoading]     = useState(false);
    const [booking,     setBooking]     = useState(false);
    const [selected,    setSelected]    = useState(null);
    const [msg,         setMsg]         = useState(null);

    /* persist student info */
    const saveName = (v) => { setStudentName(v); localStorage.setItem(LS_NAME, v); };
    const saveId   = (v) => { setStudentId(v);   localStorage.setItem(LS_ID,   v); };

    /* load availability */
    useEffect(() => {
        if (!room || !date) return;
        setLoading(true); setSelected(null); setMsg(null);
        axios.get("http://localhost:8000/room-availability", {
            params: { sef: room, date },
        })
            .then(r => setAvail(r.data.data))
            .catch(() => setAvail(null))
            .finally(() => setLoading(false));
    }, [room, date]);

    const handleBook = async () => {
        if (!selected || !studentName.trim() || !studentId.trim()) return;
        setBooking(true); setMsg(null);
        try {
            await axios.post("http://localhost:8000/book-room", {
                sef: room, date, timeSlot: selected,
                studentName: studentName.trim(),
                studentId:   studentId.trim(),
            });
            setMsg({ type: "ok", text: `Место забронировано: ${selected}` });
            setSelected(null);
            const r = await axios.get("http://localhost:8000/room-availability", {
                params: { sef: room, date },
            });
            setAvail(r.data.data);
        } catch (e) {
            setMsg({ type: "err", text: e.response?.data?.error || "Ошибка бронирования" });
        } finally {
            setBooking(false);
        }
    };

    const filled = studentName.trim() && studentId.trim();

    return (
        <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 mb-4">
                <Calendar size={16} style={{ color: GREEN }} />
                <span className="text-white font-semibold text-[15px]">Самостоятельное обучение</span>
            </div>

            {/* Student info inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl px-3 py-2">
                    <User size={14} className="text-white/40 flex-shrink-0" />
                    <input
                        value={studentName}
                        onChange={e => saveName(e.target.value)}
                        placeholder="Ваше имя"
                        className="bg-transparent text-white text-[13px] outline-none w-full placeholder-white/30 font-sans"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-xl px-3 py-2">
                    <Hash size={14} className="text-white/40 flex-shrink-0" />
                    <input
                        value={studentId}
                        onChange={e => saveId(e.target.value)}
                        placeholder="ID студента (напр. 210103001)"
                        className="bg-transparent text-white text-[13px] outline-none w-full placeholder-white/30 font-sans"
                    />
                </div>
            </div>

            {/* Date picker */}
            <div className="flex items-center gap-3 mb-4">
                <label className="text-white/50 text-[12px] font-sans">Дата:</label>
                <input
                    type="date"
                    value={date}
                    min={today()}
                    onChange={e => setDate(e.target.value)}
                    className="bg-white/5 border border-white/15 text-white text-[13px] px-3 py-1.5 rounded-xl outline-none font-sans"
                />
            </div>

            {/* Slots */}
            {loading && (
                <div className="flex items-center gap-2 text-white/40 text-[13px] font-sans">
                    <Loader size={13} className="animate-spin" /> Загрузка...
                </div>
            )}

            {avail && !loading && (
                <>
                    <p className="text-white/40 text-[11px] font-sans mb-3 uppercase tracking-wider">
                        Вместимость: {avail.capacity} мест
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                        {avail.slots.map(slot => {
                            const full  = slot.available === 0;
                            const pct   = Math.round((slot.booked / avail.capacity) * 100);
                            const isSel = selected === slot.slot;

                            return (
                                <button
                                    key={slot.slot}
                                    disabled={full || !filled}
                                    onClick={() => !full && filled && setSelected(isSel ? null : slot.slot)}
                                    className="relative flex flex-col gap-1 p-3 rounded-xl text-left overflow-hidden transition-all duration-150"
                                    style={{
                                        border: isSel
                                            ? `2px solid ${GREEN}`
                                            : "2px solid rgba(255,255,255,0.1)",
                                        backgroundColor: isSel
                                            ? GREEN + "33"
                                            : full ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                                        cursor: full || !filled ? "not-allowed" : "pointer",
                                        opacity: full ? 0.45 : !filled ? 0.6 : 1,
                                    }}
                                    title={!filled ? "Введите имя и ID" : ""}
                                >
                                    {/* fill bar */}
                                    <div className="absolute bottom-0 left-0 h-[3px] transition-all"
                                         style={{
                                             width: `${pct}%`,
                                             backgroundColor: pct >= 100 ? "#ef4444"
                                                 : pct >= 70  ? "#f59e0b" : GREEN,
                                         }} />

                                    <span className="flex items-center gap-1 text-white/70 text-[11px] font-sans">
                                        <Clock size={10} />{slot.slot}
                                    </span>
                                    <span className="font-sans text-[12px] font-semibold"
                                          style={{ color: full ? "#ef4444" : slot.available <= 3 ? "#f59e0b" : "#86efac" }}>
                                        {full ? "Занято" : `${slot.available} мест`}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {!filled && (
                        <p className="text-white/40 font-sans text-[12px] mb-3">
                            ↑ Введите имя и ID студента, чтобы выбрать слот
                        </p>
                    )}

                    {selected && filled && (
                        <button
                            onClick={handleBook}
                            disabled={booking}
                            className="w-full py-2.5 rounded-xl font-sans font-semibold text-white text-[13px] transition-all"
                            style={{ backgroundColor: GREEN, opacity: booking ? 0.7 : 1 }}>
                            {booking ? "Бронирование..." : `Забронировать ${selected}`}
                        </button>
                    )}
                </>
            )}

            {msg && (
                <div className={`mt-3 flex items-center gap-2 text-[13px] p-3 rounded-xl font-sans ${
                    msg.type === "ok"
                        ? "bg-green-900/40 text-green-300"
                        : "bg-red-900/40 text-red-300"
                }`}>
                    {msg.type === "ok" ? <CheckCircle size={15} /> : <XCircle size={15} />}
                    {msg.text}
                </div>
            )}
        </div>
    );
}
