import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import LeftBuildingPlan from "../Components/AdminPanel/LeftBuildingPlan";
import { useTheme } from "../ThemeContext";

const GREEN = "#4C6740";

export default function BlockGLeftSide() {
    const { darkMode } = useTheme();
    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg, color: darkMode ? "#f9fafb" : "#111827" }}>
            <Navbar />

            <section
                className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden"
                style={{ backgroundColor: darkMode ? "#3D4037" : GREEN, minHeight: 320, padding: "64px 24px" }}
            >
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                         backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)",
                         backgroundSize: "48px 48px",
                     }} />
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: "radial-gradient(ellipse 70% 60% at 50% 110%,rgba(0,0,0,.2),transparent)" }} />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="font-sans text-white/55 text-[11px] uppercase tracking-[6px] mb-5 block">
                        Block G · Left Wing
                    </span>
                    <h1 className="text-white font-normal leading-tight mb-6"
                        style={{ fontSize: "clamp(38px, 5vw, 62px)" }}>
                        Floor Plan
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { value: "15", label: "Rooms" },
                            { value: "3",  label: "Floors" },
                            { value: "G",  label: "Block"  },
                        ].map(({ value, label }) => (
                            <div key={label}
                                 className="flex items-center gap-2 px-5 py-2 rounded-full"
                                 style={{ backgroundColor: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                                <span className="text-white font-[Cormorant] text-[24px] leading-none">{value}</span>
                                <span className="font-sans text-white/55 text-[11px] uppercase tracking-widest">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
                <div className="rounded-3xl border shadow-xl p-6 sm:p-10"
                     style={{ backgroundColor: surface, borderColor: border }}>
                    <LeftBuildingPlan svgPath="/left-g.svg" roomPrefix="g" />
                </div>
            </main>

            <Footer />
        </div>
    );
}

