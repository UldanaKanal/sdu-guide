import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "./ThemeContext";
import { Calendar, Clock, MapPin, X, BookOpen, Hash, Search } from "lucide-react";

const GREEN  = "#4C6740";
const LS_ID  = "sdu_student_id";

export default function MyBookingsPage() {
    const { darkMode }  = useTheme();
    const [studentId,   setStudentId]  = useState(localStorage.getItem(LS_ID) || "");
    const [bookings,    setBookings]   = useState(null); // null = not searched yet
    const [loading,     setLoading]    = useState(false);
    const [error,       setError]      = useState("");

    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";

    const load = async (id = studentId) => {
        const sid = id.trim();
        if (!sid) return;
        localStorage.setItem(LS_ID, sid);
        setLoading(true); setError("");
        try {
            const r = await axios.get("http://localhost:8000/my-bookings", {
                params: { studentId: sid },
            });
            setBookings(r.data.data || []);
        } catch {
            setError("Не удалось загрузить бронирования");
        } finally {
            setLoading(false);
        }
    };

    const cancel = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/cancel-booking/${id}`, {
                params: { studentId: studentId.trim() },
            });
            setBookings(prev => prev.filter(b => b.id !== id));
        } catch {}
    };

    const fmtDate = (d) =>
        new Date(d).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg, color: darkMode ? "#f9fafb" : "#111827" }}>
            <Navbar />

            {/* Hero */}
            <section className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden"
                     style={{ backgroundColor: darkMode ? "#3D4037" : GREEN, minHeight: 260, padding: "52px 24px" }}>
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                         backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)",
                         backgroundSize: "48px 48px",
                     }} />
                <div className="relative z-10">
                    <BookOpen size={32} className="text-white/60 mx-auto mb-3" />
                    <span className="font-sans text-white/55 text-[11px] uppercase tracking-[5px] mb-3 block">
                        Самостоятельное обучение
                    </span>
                    <h1 className="text-white font-normal" style={{ fontSize: "clamp(34px,5vw,56px)" }}>
                        Мои бронирования
                    </h1>
                </div>
            </section>

            <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-8 py-12">

                {/* Student ID search */}
                <div className="rounded-2xl border p-6 mb-8"
                     style={{ backgroundColor: surface, borderColor: border }}>
                    <p className="font-[Cormorant] text-[20px] mb-4">Введите ваш ID студента</p>
                    <div className="flex gap-3">
                        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border"
                             style={{ borderColor: border }}>
                            <Hash size={15} style={{ color: muted }} />
                            <input
                                value={studentId}
                                onChange={e => setStudentId(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && load()}
                                placeholder="например: 210103001"
                                className="flex-1 bg-transparent outline-none font-sans text-[14px]"
                                style={{ color: darkMode ? "#f9fafb" : "#111827" }}
                            />
                        </div>
                        <button
                            onClick={() => load()}
                            disabled={!studentId.trim() || loading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-[13px] font-semibold text-white transition-all"
                            style={{ backgroundColor: GREEN, opacity: loading ? 0.7 : 1 }}>
                            <Search size={15} />
                            {loading ? "Поиск..." : "Найти"}
                        </button>
                    </div>
                    {error && <p className="mt-3 font-sans text-[13px] text-red-500">{error}</p>}
                </div>

                {/* Results */}
                {bookings === null && !loading && (
                    <div className="text-center py-16">
                        <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-[Cormorant] text-[22px]" style={{ color: muted }}>
                            Введите ID студента для поиска бронирований
                        </p>
                    </div>
                )}

                {bookings !== null && bookings.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-[Cormorant] text-[22px] mb-2">Нет активных бронирований</p>
                        <p className="font-sans text-[14px]" style={{ color: muted }}>
                            Откройте план аудитории и выберите свободный слот
                        </p>
                    </div>
                )}

                {bookings !== null && bookings.length > 0 && (
                    <div className="space-y-4">
                        <p className="font-sans text-[11px] uppercase tracking-[4px] mb-2"
                           style={{ color: GREEN }}>
                            Активных: {bookings.length}
                        </p>
                        {bookings.map(b => (
                            <div key={b.id}
                                 className="flex items-center justify-between gap-4 p-5 rounded-2xl border transition-all hover:shadow-md"
                                 style={{ backgroundColor: surface, borderColor: border }}>
                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={15} style={{ color: GREEN, flexShrink: 0 }} />
                                        <span className="font-[Cormorant] text-[22px] leading-tight">
                                            Аудитория {b.roomSef?.toUpperCase().replace("-", " ")}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="flex items-center gap-1.5 font-sans text-[13px]" style={{ color: muted }}>
                                            <Calendar size={13} />{fmtDate(b.date)}
                                        </span>
                                        <span className="flex items-center gap-1.5 font-sans text-[13px]" style={{ color: muted }}>
                                            <Clock size={13} />{b.timeSlot}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => cancel(b.id)}
                                    className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[12px] border-2 transition-all hover:bg-red-50"
                                    style={{ borderColor: "#ef4444", color: "#ef4444" }}>
                                    <X size={13} /> Отменить
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
