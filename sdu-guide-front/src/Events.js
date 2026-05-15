import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Calendar, Clock, MapPin, CalendarPlus } from "lucide-react";
import { useTranslation } from "./LanguageContext";
import { useTheme } from "./ThemeContext";

const GREEN = "#4C6740";

const PLACEHOLDERS = [
    "linear-gradient(135deg,#4C6740,#878F71)",
    "linear-gradient(135deg,#435873,#6A8FAE)",
    "linear-gradient(135deg,#363F78,#6B77C0)",
    "linear-gradient(135deg,#641515,#A45050)",
    "linear-gradient(135deg,#6A3BA4,#9B6FC5)",
    "linear-gradient(135deg,#863383,#C56FAE)",
];
const pickGradient = (name = "") => PLACEHOLDERS[name.charCodeAt(0) % PLACEHOLDERS.length];

/* ── ICS generator ───────────────────────────────────── */
const generateICS = (event) => {
    const date      = new Date(event.date);
    const dateStr   = date.toISOString().slice(0, 10).replace(/-/g, "");
    const startTime = (event.startTime || "00:00:00").replace(/:/g, "").slice(0, 6);
    const endTime   = (event.endTime   || "00:00:00").replace(/:/g, "").slice(0, 6);
    const stamp     = new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";
    const safeName  = event.name.replace(/[,;\\]/g, " ");
    const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SDU Campus Guide//EN",
        "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
        `UID:sdu-event-${event.id}@sdu-guide`, `DTSTAMP:${stamp}`,
        `DTSTART:${dateStr}T${startTime}`, `DTEND:${dateStr}T${endTime}`,
        `SUMMARY:${safeName}`, `LOCATION:${event.place || ""}`,
        "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${event.name.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
};

/* ── helpers ─────────────────────────────────────────── */
const fmtTime = (t) =>
    new Date(`1970-01-01T${t}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const fmtDateLong = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

const fmtDateShort = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();

/* ── image with gradient fallback ────────────────────── */
function EventImg({ event, className, style }) {
    const [failed, setFailed] = useState(false);
    const src = event.hash?.startsWith("http") ? event.hash : null;

    if (!src || failed) {
        return (
            <div className={className} style={{ ...style, background: pickGradient(event.name) }}>
                <span style={{ fontSize: 72, opacity: 0.2, color: "#fff", fontFamily: "Cormorant, serif", userSelect: "none" }}>
                    {event.name?.charAt(0)}
                </span>
            </div>
        );
    }
    return (
        <img src={src} alt={event.name} className={className} style={style}
             referrerPolicy="no-referrer" onError={() => setFailed(true)} />
    );
}

/* ══════════════════════════════════════════════════════ */
export default function Events() {
    const [events, setEvents]     = useState([]);
    const [calendar, setCalendar] = useState([]);
    const { translations }        = useTranslation();
    const { darkMode }            = useTheme();

    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";

    useEffect(() => {
        axios.get("http://localhost:8000/getAll-events", {
            params: { limit: 6, withEnded: false, upcoming: true },
            withCredentials: true,
        }).then(r => setEvents(r.data.data || [])).catch(console.error);
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8000/getAll-events-currentMonth", { withCredentials: true })
            .then(r => buildCalendar(r.data.data))
            .catch(console.error);
    }, []);

    const buildCalendar = (evts = []) => {
        const today       = new Date();
        const year        = today.getFullYear();
        const month       = today.getMonth();
        const firstDay    = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const lastDay     = new Date(year, month, daysInMonth).getDay();
        const days = [];
        for (let i = 0; i < (firstDay + 6) % 7; i++) days.push(null);
        for (let d = 1; d <= daysInMonth; d++) {
            const event = evts.find(e => new Date(e.date).getDate() === d);
            days.push({ day: d, event });
        }
        for (let i = lastDay % 7; i < 6; i++) days.push(null);
        setCalendar(days);
    };

    const featured  = events[0];
    const rest      = events.slice(1);
    const monthName = new Date().toLocaleString("en-US", { month: "long" });

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg, color: darkMode ? "#f9fafb" : "#111827" }}>
            <Navbar />
            <main className="flex-grow">

                {/* ── HERO ──────────────────────────────────────── */}
                <section className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden"
                         style={{ backgroundColor: darkMode ? "#3D4037" : GREEN, minHeight: 380, padding: "72px 24px" }}>
                    <div className="absolute inset-0 pointer-events-none"
                         style={{
                             backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)",
                             backgroundSize: "48px 48px",
                         }} />
                    <div className="absolute inset-0 pointer-events-none"
                         style={{ background: "radial-gradient(ellipse 70% 60% at 50% 110%,rgba(0,0,0,.3),transparent)" }} />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="inline-block text-white/60 font-sans text-xs uppercase tracking-[5px] mb-5">
                            SDU Campus
                        </span>
                        <h1 className="text-white font-normal leading-tight mb-5"
                            style={{ fontSize: "clamp(40px, 6vw, 68px)" }}>
                            {translations["all-events"] || "All Events"}
                        </h1>
                        <p className="text-white/70 font-sans text-[17px] leading-relaxed max-w-lg mx-auto">
                            {translations["events-description"] ||
                                "Don't miss the most interesting events at our university!"}
                        </p>
                    </div>
                </section>

                {/* ── UPCOMING EVENTS ───────────────────────────── */}
                <section className="w-full py-24 px-4 sm:px-8" style={{ backgroundColor: surface }}>
                    <div className="max-w-6xl mx-auto">

                        {/* section label */}
                        <p className="text-center font-sans text-[12px] uppercase tracking-[5px] mb-3" style={{ color: GREEN }}>
                            What's coming
                        </p>
                        <h2 className="text-center font-[Cormorant] font-normal mb-16"
                            style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>
                            {translations["upcoming-events"] || "Upcoming Events"}
                        </h2>

                        {/* ── FEATURED CARD ─────────────────────── */}
                        {featured && (
                            <div className="group rounded-3xl overflow-hidden border mb-8 flex flex-col lg:flex-row transition-shadow duration-300 hover:shadow-2xl"
                                 style={{ borderColor: border, backgroundColor: bg }}>

                                {/* image */}
                                <div className="relative w-full lg:w-[52%] flex-shrink-0 overflow-hidden" style={{ minHeight: 320 }}>
                                    <EventImg
                                        event={featured}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    />
                                    {/* FEATURED badge */}
                                    <span className="absolute top-5 left-5 font-sans text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
                                          style={{ backgroundColor: GREEN }}>
                                        Featured
                                    </span>
                                    {/* date overlay */}
                                    <div className="absolute bottom-5 left-5 text-white">
                                        <div className="font-[Cormorant] text-[42px] leading-none"
                                             style={{ textShadow: "0 2px 12px rgba(0,0,0,.5)" }}>
                                            {new Date(featured.date).getDate()}
                                        </div>
                                        <div className="font-sans text-[13px] uppercase tracking-widest opacity-80">
                                            {new Date(featured.date).toLocaleString("en-US", { month: "long", year: "numeric" })}
                                        </div>
                                    </div>
                                </div>

                                {/* content */}
                                <div className="flex-1 flex flex-col justify-between p-10 lg:p-14">
                                    <div>
                                        <div className="flex flex-wrap gap-3 items-center mb-6">
                                            <MetaPill icon={<Calendar size={14} />} text={fmtDateLong(featured.date)} muted={muted} border={border} />
                                            <MetaPill icon={<Clock size={14} />}
                                                      text={`${fmtTime(featured.startTime)} – ${fmtTime(featured.endTime)}`}
                                                      muted={muted} border={border} />
                                        </div>
                                        <h3 className="font-[Cormorant] font-normal leading-tight mb-4"
                                            style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>
                                            {featured.name}
                                        </h3>
                                        <p className="font-sans text-[14px] flex items-center gap-2 mb-2" style={{ color: muted }}>
                                            <MapPin size={15} style={{ color: GREEN, flexShrink: 0 }} />
                                            {featured.place}
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <ICSButton event={featured} filled />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── GRID CARDS ────────────────────────── */}
                        {rest.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rest.map(event => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        bg={bg}
                                        surface={surface}
                                        border={border}
                                        muted={muted}
                                        darkMode={darkMode}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── CALENDAR ──────────────────────────────────── */}
                <section className="w-full py-24 px-4 sm:px-8" style={{ backgroundColor: bg }}>
                    <div className="max-w-6xl mx-auto">
                        <p className="text-center font-sans text-[12px] uppercase tracking-[5px] mb-3" style={{ color: GREEN }}>
                            Monthly overview
                        </p>
                        <h2 className="text-center font-[Cormorant] font-normal mb-16"
                            style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>
                            {translations["event-program"] || "Events in"}{" "}
                            {translations[monthName] || monthName}
                        </h2>

                        <div className="rounded-3xl overflow-hidden shadow-xl border"
                             style={{ borderColor: border, backgroundColor: surface }}>

                            {/* header row */}
                            <div className="grid grid-cols-7 text-center" style={{ backgroundColor: GREEN }}>
                                {["monday","tuesday","wednesday","thursday","friday","saturday","sunday"].map(d => (
                                    <div key={d} className="py-5 text-white font-sans text-[13px] uppercase tracking-widest">
                                        {(translations[d] || d).slice(0, 3)}
                                    </div>
                                ))}
                            </div>

                            {/* day cells */}
                            <div className="grid grid-cols-7">
                                {calendar.map((cell, idx) => {
                                    const isToday = cell?.day === new Date().getDate();
                                    return (
                                        <div key={idx}
                                             className="relative flex flex-col border-b border-r transition-colors"
                                             style={{
                                                 minHeight: 100,
                                                 borderColor: border,
                                                 backgroundColor: !cell
                                                     ? (darkMode ? "#111" : "#fafafa")
                                                     : cell.event
                                                         ? (darkMode ? "#1e2a1c" : "#f0f5ee")
                                                         : surface,
                                             }}>
                                            {cell && (
                                                <>
                                                    <span className="w-8 h-8 m-2 flex items-center justify-center rounded-full font-sans text-[13px] font-semibold flex-shrink-0"
                                                          style={{
                                                              backgroundColor: isToday ? GREEN : "transparent",
                                                              color: isToday ? "#fff" : (darkMode ? "#d1d5db" : "#374151"),
                                                              outline: isToday ? "none" : `2px solid transparent`,
                                                          }}>
                                                        {cell.day}
                                                    </span>
                                                    {cell.event && (
                                                        <div className="px-2 pb-2 mt-auto">
                                                            <span className="block font-sans text-[10px] rounded-lg px-2 py-1 leading-snug text-center truncate text-white"
                                                                  style={{ backgroundColor: GREEN }}>
                                                                {cell.event.shortName || cell.event.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}

/* ── sub-components ──────────────────────────────────── */

function EventCard({ event, bg, surface, border, muted, darkMode }) {
    return (
        <div className="group rounded-2xl overflow-hidden border flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
             style={{ borderColor: border, backgroundColor: surface }}>

            {/* image */}
            <div className="relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "16/9" }}>
                <EventImg
                    event={event}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* date badge */}
                <div className="absolute bottom-3 left-3 font-sans text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm text-white"
                     style={{ backgroundColor: "rgba(0,0,0,.45)" }}>
                    {fmtDateShort(event.date)}
                </div>
            </div>

            {/* content */}
            <div className="flex flex-col flex-grow p-6 gap-4">
                <h3 className="font-[Cormorant] text-[22px] leading-snug line-clamp-2">
                    {event.name}
                </h3>

                <div className="flex flex-col gap-2 font-sans text-[13px]" style={{ color: muted }}>
                    <span className="flex items-center gap-2">
                        <Clock size={13} style={{ color: GREEN, flexShrink: 0 }} />
                        {fmtTime(event.startTime)} – {fmtTime(event.endTime)}
                    </span>
                    <span className="flex items-center gap-2">
                        <MapPin size={13} style={{ color: GREEN, flexShrink: 0 }} />
                        {event.place}
                    </span>
                </div>

                <div className="mt-auto pt-2">
                    <ICSButton event={event} />
                </div>
            </div>
        </div>
    );
}

function MetaPill({ icon, text, muted, border }) {
    return (
        <span className="inline-flex items-center gap-1.5 font-sans text-[13px] px-3 py-1.5 rounded-full border"
              style={{ color: muted, borderColor: border }}>
            {icon} {text}
        </span>
    );
}

function ICSButton({ event, filled }) {
    const { translations } = useTranslation();
    return (
        <button
            onClick={() => generateICS(event)}
            className="inline-flex items-center gap-2 font-sans font-semibold text-[13px] px-5 py-2.5 rounded-full border-2 transition-all duration-200 cursor-pointer hover:text-white"
            style={{
                borderColor:     GREEN,
                color:           filled ? "#fff"  : GREEN,
                backgroundColor: filled ? GREEN   : "transparent",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = GREEN; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = filled ? GREEN : "transparent";
                e.currentTarget.style.color = filled ? "#fff" : GREEN;
            }}
        >
            <CalendarPlus size={15} />
            {translations["add-to-calendar"] || "Add to Calendar"}
        </button>
    );
}
