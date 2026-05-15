import React, { useRef, useState, useEffect } from "react";
import { Search, Heart, X, MapPin, ArrowDown, Navigation } from "lucide-react";
import { useTranslation } from "./LanguageContext";
import { useTheme } from "./ThemeContext";
import { useFavorites } from "./hooks/useFavorites";
import Modal from "./Components/AdminPanel/Modal";
import CampusMap from "./CampusMap";

import heroImage from "./Components/assets/campus2.png";
import Navbar from "./Navbar";
import Footer from "./Footer";

const GREEN = "#4C6740";

const ZONES = [
    { label: "Campus",   zone: "L", href: "/detailed-map" },
    { label: "SDU Life", zone: "K", href: null },
    { label: "Dorm",     zone: "J", href: null },
];

const BLOCKS = ["D", "E", "F", "G", "H", "I"];

const parseRoomCode = (code) => {
    const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const match = clean.match(/^([D-I])(\d{3})$/);
    if (!match) return null;
    const block  = match[1];
    const number = parseInt(match[2], 10);
    const isLeft  = [101,102,103,104,105,201,202,203,204,205,301,302,303,304,305].includes(number);
    const isRight = [107,108,206,207,208,209,210,211,306,307,308,309,310,311,312,406,407,408,409,410,411,412].includes(number);
    const side = isLeft ? "Left" : isRight ? "Right" : null;
    if (!side) return null;
    return { block, room: `${block}-${number}`, link: `Block${block}${side}Side` };
};

export default function HomePage() {
    const { translations }      = useTranslation();
    const { darkMode }          = useTheme();
    const { favorites, toggle } = useFavorites();

    const [searchValue,  setSearchValue]  = useState("");
    const [searchError,  setSearchError]  = useState(false);
    const [favModalRoom, setFavModalRoom] = useState(null);

    const campusRef = useRef(null);
    const mapRef    = useRef(null);

    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";

    const handleSearch = () => {
        const result = parseRoomCode(searchValue);
        if (result) {
            setSearchError(false);
            setTimeout(() => campusRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
            setTimeout(() => { window.location.href = `/${result.link}`; }, 600);
        } else {
            setSearchError(true);
            setTimeout(() => setSearchError(false), 2500);
        }
    };

    const handleZoneClick = (zone) => {
        campusRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => mapRef.current?.flyToZone(zone), 400);
    };

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg, color: darkMode ? "#f9fafb" : "#111827" }}>
            <Navbar />

            {/* ── HERO ──────────────────────────────────────── */}
            <section className="relative overflow-hidden"
                     style={{ height: "clamp(420px, 55vh, 600px)" }}>
                <img src={heroImage} alt="SDU Campus"
                     className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0"
                     style={{ background: "linear-gradient(to bottom,rgba(0,0,0,.45),rgba(0,0,0,.6))" }} />
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                         backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
                         backgroundSize: "48px 48px",
                     }} />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
                    <span className="font-sans text-white/60 text-xs uppercase tracking-[5px] mb-5">
                        SDU University · Almaty, Kazakhstan
                    </span>
                    <h1 className="text-white font-normal leading-tight mb-4"
                        style={{ fontSize: "clamp(42px,6vw,76px)", textShadow: "0 2px 20px rgba(0,0,0,.4)" }}>
                        {translations.maps_and_directions || "Maps & Directions"}
                    </h1>
                    <p className="text-white/75 font-sans text-[16px] sm:text-[18px] max-w-md mb-10 leading-relaxed">
                        {translations.find_locations || "Find classrooms, libraries, and other important locations on campus. Use the interactive map for easy navigation."}
                    </p>

                    {/* search */}
                    <div className="flex items-center rounded-full shadow-2xl overflow-hidden w-full max-w-sm"
                         style={{
                             backgroundColor: "#fff",
                             outline: searchError ? "2px solid #ef4444" : "none",
                         }}>
                        <input
                            value={searchValue}
                            onChange={e => { setSearchValue(e.target.value); setSearchError(false); }}
                            onKeyDown={e => e.key === "Enter" && handleSearch()}
                            placeholder={translations.search || "Search room (e.g. D-301)…"}
                            className="flex-1 px-5 py-3.5 text-gray-800 font-sans text-[14px] bg-transparent outline-none"
                        />
                        <button onClick={handleSearch}
                                className="m-1.5 w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                style={{ backgroundColor: GREEN }}>
                            <Search size={16} />
                        </button>
                    </div>
                    {searchError && (
                        <p className="mt-3 font-sans text-[13px] text-red-300">
                            Invalid room code — try something like D-301
                        </p>
                    )}

                    <button onClick={() => campusRef.current?.scrollIntoView({ behavior: "smooth" })}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors">
                        <ArrowDown size={18} className="animate-bounce" />
                    </button>
                </div>
            </section>

            {/* ── MAP SECTION ───────────────────────────────── */}
            <div ref={campusRef} className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-8">

                {/* header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                    <div>
                        <p className="font-sans text-[11px] uppercase tracking-[5px] mb-1" style={{ color: GREEN }}>
                            Real-time location
                        </p>
                        <h2 className="font-[Cormorant] font-normal" style={{ fontSize: "clamp(26px,3vw,38px)" }}>
                            Campus Map
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {ZONES.map(({ label, zone, href }) =>
                            href ? (
                                <a key={zone} href={href}
                                   className="font-sans text-[13px] font-medium px-4 py-2 rounded-full border-2 transition-colors"
                                   style={{ borderColor: GREEN, color: GREEN }}>
                                    {label}
                                </a>
                            ) : (
                                <button key={zone} onClick={() => handleZoneClick(zone)}
                                        className="font-sans text-[13px] font-medium px-4 py-2 rounded-full border-2 transition-all hover:text-white"
                                        style={{ borderColor: GREEN, color: GREEN }}
                                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = GREEN; e.currentTarget.style.color = "#fff"; }}
                                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = GREEN; }}>
                                    {label}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Leaflet map */}
                <div className="relative z-0 rounded-2xl overflow-hidden border shadow-xl mb-8"
                     style={{ height: 480, borderColor: border }}>
                    <CampusMap ref={mapRef} />
                </div>

                {/* Маршрут в 2GIS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 p-4 rounded-2xl border"
                     style={{ borderColor: border, backgroundColor: surface }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ backgroundColor: GREEN + "18" }}>
                            <MapPin size={18} style={{ color: GREEN }} />
                        </div>
                        <div>
                            <p className="font-[Cormorant] text-[18px] leading-tight">SDU University, Kaskelen</p>
                            <p className="font-sans text-[12px]" style={{ color: muted }}>
                                Almaty region, Karasai district
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://2gis.kz/almaty/directions/points/%7C76.66967%2C43.207176%7C70000001042393451"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg flex-shrink-0"
                        style={{ backgroundColor: GREEN }}
                    >
                        <Navigation size={15} />
                        Построить маршрут
                    </a>
                </div>

                {/* Block navigation grid */}
                <div>
                    <p className="font-sans text-[11px] uppercase tracking-[5px] mb-4" style={{ color: muted }}>
                        Go to building
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {BLOCKS.map(block => (
                            <a key={block} href={`/Block${block}`}
                               className="flex flex-col items-center gap-1 py-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                               style={{ borderColor: GREEN, color: GREEN }}
                               onMouseEnter={e => { e.currentTarget.style.backgroundColor = GREEN; e.currentTarget.style.color = "#fff"; }}
                               onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = GREEN; }}>
                                <span className="font-[Cormorant] text-[13px] leading-none opacity-60">Block</span>
                                <span className="font-[Cormorant] text-[32px] leading-none font-bold">{block}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── FAVORITES ─────────────────────────────────── */}
            {favorites.length > 0 && (
                <section className="w-full pb-16 px-4 sm:px-8" style={{ backgroundColor: bg }}>
                    <div className="max-w-6xl mx-auto">
                        <div className="rounded-2xl border p-5 sm:p-8" style={{ backgroundColor: surface, borderColor: border }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                     style={{ backgroundColor: "#ef444418" }}>
                                    <Heart size={18} className="fill-red-400 text-red-400" />
                                </div>
                                <h3 className="font-[Cormorant] text-[24px]">
                                    {translations["saved-rooms"] || "Saved Rooms"}
                                </h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {favorites.map(roomId => (
                                    <div key={roomId} className="flex items-center gap-1">
                                        <button
                                            onClick={() => setFavModalRoom(roomId)}
                                            className="font-sans text-[13px] font-medium px-4 py-2 rounded-full border-2 transition-all duration-200"
                                            style={{ borderColor: GREEN, color: GREEN }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = GREEN; e.currentTarget.style.color = "#fff"; }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = GREEN; }}>
                                            {roomId.toUpperCase().replace("-", " - ")}
                                        </button>
                                        <button onClick={() => toggle(roomId)}
                                                className="w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-red-50"
                                                style={{ color: muted }} title="Remove">
                                            <X size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {favModalRoom && <Modal room={favModalRoom} onClose={() => setFavModalRoom(null)} />}
                </section>
            )}

            <Footer />
        </div>
    );
}
