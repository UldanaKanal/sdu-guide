import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DetailedCampusMap from "./Components/assets/detailedMapNew.jpg";
import { useTheme } from "./ThemeContext";
import { Plus, Minus, Home, Locate, Info, SlidersHorizontal } from "lucide-react";

const GREEN = "#4C6740";


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

    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg }}>
            <Navbar />

            <div className="flex-grow relative overflow-hidden">
                {/* ── MAP ────────────────────────────────────── */}
                <div className="relative w-full">
                    <img src={DetailedCampusMap} alt="Campus Map" className="w-full block" />
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
            </div>

            <Footer />
        </div>
    );
}
