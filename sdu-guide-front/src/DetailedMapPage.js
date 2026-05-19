import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "./ThemeContext";
import { X, ArrowRight } from "lucide-react";

import mapPhoto from "./Components/assets/detailedMapNew.jpg";

// SVG previews for the info panel
import svgLeft     from "./Components/assets/map-parts/Group 11.svg";
import svgBlockD   from "./Components/assets/map-parts/Group 2.svg";
import svgBlockE   from "./Components/assets/map-parts/Group 3.svg";
import svgBlockF   from "./Components/assets/map-parts/Group 4.svg";
import svgBlockG   from "./Components/assets/map-parts/Group 5.svg";
import svgBlockH   from "./Components/assets/map-parts/Group 6.svg";
import svgCorridor from "./Components/assets/map-parts/Group 23.svg";
import svgBochkas  from "./Components/assets/map-parts/Group 52.svg";
import svgEntrance from "./Components/assets/map-parts/Group 27.svg";

const GREEN = "#4C6740";

// All zones: positions as % of the photo width/height
// Calibrated by direct pixel measurement on photo_2026-05-19_00-08-28.jpg
const ZONES = [
    // ── Left complex ──────────────────────────────────────────────────
    { id: "Library",       x:  16, y:  9, w: 10, h: 17, color: "#E8734A" }, // pink building
    { id: "Library Block", x: 11, y: 27, w:  9, h: 21, color: "#4CAA44" }, // teal building
    { id: "Wi-fi Zone",    x: 17, y: 52, w:  9, h: 11, color: "#4CAA44" }, // purple dome

    // ── Academic blocks — top row (left → right) ──────────────────────
    { id: "Block D",       x: 30, y: 27, w: 10, h: 22, color: "#3D7AC9" }, // dark navy
    { id: "Block E",       x: 41, y: 26, w: 10, h: 23, color: "#C94040" }, // red
    { id: "Block F",       x: 52, y: 26, w: 10, h: 24, color: "#4C9E7A" }, // light blue
    { id: "Block G",       x: 64, y: 26, w: 10, h: 23, color: "#C97A2A" }, // green
    { id: "Block H",       x: 75, y: 26, w: 10, h: 23, color: "#4AA8E8" }, // teal-blue
    { id: "Block I",       x: 85, y: 27, w: 10, h: 23, color: "#9874B3" }, // purple

    // ── Bochkas — bottom centre (left → right) ────────────────────────
    { id: "Bochka D",      x: 27, y: 54, w:  6, h: 16, color: "#4C9E7A", round: true },
    { id: "Bochka C",      x: 31, y: 49, w:  7, h: 15, color: "#7A6CC9", round: true },
    { id: "Bochka B",      x: 36, y: 53, w:  6, h: 16, color: "#C97A2A", round: true },
    { id: "Bochka A",      x: 42, y: 49, w:  6, h: 16, color: "#3D7AC9", round: true },

    // ── Other facilities ──────────────────────────────────────────────
    { id: "Eat Zone",      x: 53, y: 54, w: 11, h: 20, color: "#4AA8E8" }, // cyan building
    { id: "Red Cantin",    x: 47, y: 53, w:  6, h: 16, color: "#C94040" }, // coral building
    { id: "Hall",          x: 69, y: 51, w: 15, h: 20, color: "#C9A020" }, // grey structures right
];

const ZONE_INFO = {
    "Library":       { floors: 4, loc: "Left Campus",  svg: svgLeft,     desc: "Main university library — study rooms, books and digital resources." },
    "Library Block": { floors: 3, loc: "Left Campus",  svg: svgLeft,     desc: "Library academic block — reading halls, periodicals and research rooms." },
    "Wi-fi Zone":    { floors: 1, loc: "Left Campus",  svg: svgLeft,     desc: "Open Wi-Fi lounge — high-speed internet, charging stations and comfortable seating." },
    "Block D":       { floors: 4, loc: "Block D",      svg: svgBlockD,   desc: "Block D — first academic building with main entrance corridor and lecture halls." },
    "Block E":       { floors: 4, loc: "Block E",      svg: svgBlockE,   desc: "Block E — engineering and computer science departments." },
    "Block F":       { floors: 4, loc: "Block F",      svg: svgBlockF,   desc: "Block F — science laboratories and research centres." },
    "Block G":       { floors: 4, loc: "Block G",      svg: svgBlockG,   desc: "Block G — business, economics and management faculty." },
    "Block H":       { floors: 4, loc: "Block H",      svg: svgBlockH,   desc: "Block H — humanities, arts and social sciences faculty." },
    "Block I":       { floors: 4, loc: "Block I",      svg: svgLeft,     desc: "Block I — law, international relations and political science." },
    "Bochka D":      { floors: 2, loc: "Central Zone", svg: svgBochkas,  desc: "Bochka D — student lounge, relaxation and group study space." },
    "Bochka C":      { floors: 2, loc: "Central Zone", svg: svgBochkas,  desc: "Bochka C — meeting rooms, creative zone and coffee corner." },
    "Bochka B":      { floors: 2, loc: "Central Zone", svg: svgBochkas,  desc: "Bochka B — social hub, events space and collaborative area." },
    "Bochka A":      { floors: 2, loc: "Central Zone", svg: svgBochkas,  desc: "Bochka A — student creative hub with workshops and exhibitions." },
    "Eat Zone":      { floors: 1, loc: "Central Zone", svg: svgCorridor, desc: "Eat Zone — food court with multiple dining options for students and staff." },
    "Red Cantin":    { floors: 1, loc: "Central Zone", svg: svgCorridor, desc: "Red Canteen — fast snacks, hot meals and beverages." },
    "Hall":          { floors: 1, loc: "Central Zone", svg: svgCorridor, desc: "Main Hall — exhibitions, graduation ceremonies and campus events." },
};

export default function DetailedMapPage() {
    const { darkMode } = useTheme();
    const [selected, setSelected] = useState(null);

    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";
    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const text    = darkMode ? "#f9fafb" : "#111827";

    const info      = selected ? ZONE_INFO[selected] : null;
    const zoneColor = selected ? (ZONES.find(z => z.id === selected)?.color ?? GREEN) : GREEN;

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg }}>
            <Navbar />

            <div className="flex-grow relative">

                {/* ── MAP + CLICK ZONES ───────────────────────── */}
                <div
                    className="relative w-full"
                    onClick={() => setSelected(null)}
                >
                    {/* photo background */}
                    <img
                        src={mapPhoto}
                        alt="Campus Map"
                        className="w-full block"
                        draggable={false}
                    />

                    {/* transparent clickable areas, exactly over buildings */}
                    {ZONES.map(z => {
                        const active = z.id === selected;
                        return (
                            <div
                                key={z.id}
                                title={z.id}
                                onClick={e => { e.stopPropagation(); setSelected(p => p === z.id ? null : z.id); }}
                                style={{
                                    position:        "absolute",
                                    left:            `${z.x}%`,
                                    top:             `${z.y}%`,
                                    width:           `${z.w}%`,
                                    height:          `${z.h}%`,
                                    cursor:          "pointer",
                                    border:          `2px solid ${active ? z.color : "transparent"}`,
                                    borderRadius:    z.round ? "50%" : 6,
                                    backgroundColor: active ? z.color + "40" : "transparent",
                                    transition:      "all 0.18s",
                                    boxSizing:       "border-box",
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = z.color + "28"; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                            />
                        );
                    })}
                </div>

                {/* ── INFO PANEL ──────────────────────────────── */}
                {selected && info && (
                    <div
                        className="absolute top-4 right-4 rounded-2xl shadow-2xl p-6 w-72"
                        style={{ backgroundColor: surface, border: `1px solid ${border}`, zIndex: 30 }}
                    >
                        {/* close */}
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors"
                            style={{ color: muted }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = border}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <X size={14} />
                        </button>

                        {/* SVG preview */}
                        <div className="w-full rounded-xl overflow-hidden mb-4"
                             style={{ height: 90, backgroundColor: zoneColor + "14" }}>
                            <img src={info.svg} alt={selected}
                                 style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>

                        {/* title */}
                        <h2 className="font-[Cormorant] font-normal leading-tight mb-3 pr-5"
                            style={{ fontSize: 26, color: text }}>
                            {selected}
                        </h2>

                        {/* meta */}
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex justify-between font-sans text-[13px]">
                                <span style={{ color: muted }}>Location</span>
                                <span style={{ color: text, fontWeight: 500 }}>{info.loc}</span>
                            </div>
                            <div className="flex justify-between font-sans text-[13px]">
                                <span style={{ color: muted }}>Floors</span>
                                <span style={{ color: text, fontWeight: 500 }}>{info.floors}</span>
                            </div>
                            <p className="font-sans text-[12px] mt-1 leading-relaxed" style={{ color: muted }}>
                                {info.desc}
                            </p>
                        </div>

                        <div className="w-8 h-[2px] mb-4 rounded-full" style={{ backgroundColor: zoneColor }} />

                        <button
                            className="w-full flex items-center justify-center gap-2 font-sans text-[13px] font-semibold py-2.5 rounded-xl text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: zoneColor }}
                        >
                            Get Directions <ArrowRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
