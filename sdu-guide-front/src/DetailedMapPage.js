import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DetailedCampusMap from "./Components/assets/DetailedCampusMap.png";
import { useTheme } from "./ThemeContext";
import InteractiveMapOverlay from "./InteractiveMapOverlay";
import { Plus, Minus, Home, Locate, Info, SlidersHorizontal, X, ArrowRight } from "lucide-react";

const GREEN = "#4C6740";

const ZONE_INFO = {
    "Zone A":     { location: "Main Campus", floors: 1, desc: "Main entrance zone" },
    "Eat Zone":   { location: "Main Campus", floors: 1, desc: "Food court & cafeteria area" },
    "Red Cantin": { location: "Main Campus", floors: 1, desc: "Red canteen — snacks & drinks" },
    "Bochka A":   { location: "Main Campus", floors: 2, desc: "Student lounge area" },
    "Bochka B":   { location: "Main Campus", floors: 2, desc: "Student lounge area" },
    "Bochka C":   { location: "Main Campus", floors: 2, desc: "Student lounge area" },
    "Bochka D":   { location: "Main Campus", floors: 2, desc: "Student lounge area" },
    "Zone H":     { location: "Block H",     floors: 3, desc: "Academic block" },
    "WIFI Zone":  { location: "Main Campus", floors: 1, desc: "Open Wi-Fi lounge" },
    "Hall":       { location: "Main Campus", floors: 1, desc: "Exhibition & events hall" },
    "Lab":        { location: "Main Campus", floors: 2, desc: "Computer laboratory" },
    "Game Zone":  { location: "Main Campus", floors: 1, desc: "Recreation & games area" },
};

const CONTROL_BTNS = [
    { icon: Plus,              label: "Zoom in"  },
    { icon: Minus,             label: "Zoom out" },
    { icon: Home,              label: "Home"     },
    { icon: Locate,            label: "Locate"   },
    { icon: Info,              label: "Info"     },
    { icon: SlidersHorizontal, label: "Filter"   },
];

export default function DetailedMapPage() {
    const { darkMode } = useTheme();
    const [selectedZone, setSelectedZone] = useState(null);

    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";
    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";

    const info = selectedZone ? ZONE_INFO[selectedZone] : null;

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg }}>
            <Navbar />

            <div className="flex-grow relative overflow-hidden">
                {/* ── MAP ────────────────────────────────────── */}
                <div className="relative w-full"
                     onClick={(e) => { if (e.target === e.currentTarget) setSelectedZone(null); }}>
                    <img src={DetailedCampusMap} alt="Campus Map" className="w-full block" />
                    <InteractiveMapOverlay
                        selectedZone={selectedZone}
                        onZoneClick={(id) => setSelectedZone(prev => prev === id ? null : id)}
                    />
                </div>

                {/* ── LEFT CONTROLS ──────────────────────────── */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 rounded-2xl overflow-hidden shadow-xl"
                     style={{ backgroundColor: surface, border: `1px solid ${border}` }}>
                    {CONTROL_BTNS.map(({ icon: Icon, label }) => (
                        <button
                            key={label}
                            title={label}
                            className="w-11 h-11 flex items-center justify-center transition-colors hover:opacity-80"
                            style={{ color: darkMode ? "#d1d5db" : "#374151" }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = GREEN + "22"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <Icon size={18} />
                        </button>
                    ))}
                </div>

                {/* ── INFO CARD ──────────────────────────────── */}
                {selectedZone && info && (
                    <div className="absolute top-4 right-4 rounded-2xl shadow-2xl p-6 w-64 transition-all duration-200"
                         style={{ backgroundColor: surface, border: `1px solid ${border}` }}>

                        {/* close */}
                        <button
                            onClick={() => setSelectedZone(null)}
                            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                            style={{ color: muted }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = border}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <X size={14} />
                        </button>

                        {/* zone name */}
                        <h2 className="font-[Cormorant] font-normal leading-tight mb-4 pr-6"
                            style={{ fontSize: 28, color: darkMode ? "#f9fafb" : "#111827" }}>
                            {selectedZone}
                        </h2>

                        {/* details */}
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex justify-between font-sans text-[13px]">
                                <span style={{ color: muted }}>Location</span>
                                <span style={{ color: darkMode ? "#f9fafb" : "#111827", fontWeight: 500 }}>
                                    {info.location}
                                </span>
                            </div>
                            <div className="flex justify-between font-sans text-[13px]">
                                <span style={{ color: muted }}>Floors</span>
                                <span style={{ color: darkMode ? "#f9fafb" : "#111827", fontWeight: 500 }}>
                                    {info.floors}
                                </span>
                            </div>
                            {info.desc && (
                                <p className="font-sans text-[12px] mt-1" style={{ color: muted }}>
                                    {info.desc}
                                </p>
                            )}
                        </div>

                        {/* button */}
                        <button
                            className="w-full flex items-center justify-center gap-2 font-sans text-[13px] font-semibold py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: GREEN }}
                        >
                            Get Direction <ArrowRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
