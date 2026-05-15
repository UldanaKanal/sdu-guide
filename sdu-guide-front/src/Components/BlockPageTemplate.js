import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useTheme } from "../ThemeContext";
import { ArrowLeft, ArrowRight, ArrowRight as Arrow } from "lucide-react";

const GREEN = "#4C6740";

export default function BlockPageTemplate({ blockLetter, blockImage, leftRoute, rightRoute }) {
    const navigate     = useNavigate();
    const { darkMode } = useTheme();
    const [hovered, setHovered] = useState(null); // "left" | "right" | null

    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg, color: darkMode ? "#f9fafb" : "#111827" }}>
            <Navbar />

            {/* в”Ђв”Ђ HERO в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
            <section
                className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden"
                style={{ backgroundColor: darkMode ? "#3D4037" : GREEN, minHeight: 300, padding: "56px 24px" }}
            >
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                         backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)",
                         backgroundSize: "48px 48px",
                     }} />
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: "radial-gradient(ellipse 80% 60% at 50% 120%,rgba(0,0,0,.2),transparent)" }} />

                <div className="relative z-10">
                    <span className="font-sans text-white/55 text-[11px] uppercase tracking-[6px] mb-4 block">
                        SDU University · Campus
                    </span>
                    <h1 className="text-white font-normal leading-tight mb-5"
                        style={{ fontSize: "clamp(44px, 6vw, 72px)" }}>
                        Block {blockLetter}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { value: "2",   label: "Wings" },
                            { value: "3",   label: "Floors" },
                            { value: blockLetter, label: "Block" },
                        ].map(({ value, label }) => (
                            <div key={label} className="flex items-center gap-2 px-5 py-2 rounded-full"
                                 style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                                <span className="text-white font-[Cormorant] text-[22px] leading-none">{value}</span>
                                <span className="font-sans text-white/55 text-[11px] uppercase tracking-widest">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* в”Ђв”Ђ CONTENT в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */}
            <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-8 py-14">

                {/* instruction */}
                <div className="text-center mb-8">
                    <p className="font-sans text-[11px] uppercase tracking-[5px] mb-2" style={{ color: GREEN }}>
                        Select wing
                    </p>
                    <h2 className="font-[Cormorant] font-normal"
                        style={{ fontSize: "clamp(26px, 3vw, 38px)" }}>
                        Choose a wing to explore the floor plan
                    </h2>
                </div>

                {/* building image with hover overlays */}
                <div className="relative rounded-3xl overflow-hidden border shadow-xl mb-8"
                     style={{ borderColor: border, backgroundColor: surface }}>
                    <img src={blockImage} alt={`Block ${blockLetter}`}
                         className="w-[85%] mx-auto block py-8" />

                    {/* Left wing overlay */}
                    <div
                        className="absolute top-[16%] h-[60%] flex items-center justify-center transition-all duration-200 cursor-pointer"
                        style={{
                            left: "30%", width: "20%",
                            backgroundColor: hovered === "left" ? "rgba(76,103,64,0.28)" : "transparent",
                            border: hovered === "left" ? "2px solid rgba(76,103,64,0.55)" : "2px solid transparent",
                            borderRadius: 12,
                        }}
                        onClick={() => navigate(leftRoute)}
                        onMouseEnter={() => setHovered("left")}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {hovered === "left" && (
                            <span className="font-sans text-[13px] font-bold text-white px-3 py-1.5 rounded-xl"
                                  style={{ backgroundColor: GREEN }}>
                                Left Wing
                            </span>
                        )}
                    </div>

                    {/* Right wing overlay */}
                    <div
                        className="absolute top-[16%] h-[60%] flex items-center justify-center transition-all duration-200 cursor-pointer"
                        style={{
                            right: "30%", width: "17%",
                            backgroundColor: hovered === "right" ? "rgba(76,103,64,0.28)" : "transparent",
                            border: hovered === "right" ? "2px solid rgba(76,103,64,0.55)" : "2px solid transparent",
                            borderRadius: 12,
                        }}
                        onClick={() => navigate(rightRoute)}
                        onMouseEnter={() => setHovered("right")}
                        onMouseLeave={() => setHovered(null)}
                    >
                        {hovered === "right" && (
                            <span className="font-sans text-[13px] font-bold text-white px-3 py-1.5 rounded-xl"
                                  style={{ backgroundColor: GREEN }}>
                                Right Wing
                            </span>
                        )}
                    </div>
                </div>

                {/* Wing cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <WingCard
                        label="Left Wing"
                        description={`Rooms ${blockLetter}-101 вЂ“ ${blockLetter}-305`}
                        icon={<ArrowLeft size={20} />}
                        onClick={() => navigate(leftRoute)}
                        hovered={hovered === "left"}
                        onHover={() => setHovered("left")}
                        onLeave={() => setHovered(null)}
                        border={border}
                        surface={surface}
                        muted={muted}
                    />
                    <WingCard
                        label="Right Wing"
                        description={`Rooms ${blockLetter}-107 вЂ“ ${blockLetter}-412`}
                        icon={<ArrowRight size={20} />}
                        onClick={() => navigate(rightRoute)}
                        hovered={hovered === "right"}
                        onHover={() => setHovered("right")}
                        onLeave={() => setHovered(null)}
                        border={border}
                        surface={surface}
                        muted={muted}
                        right
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}

function WingCard({ label, description, icon, onClick, hovered, onHover, onLeave, border, surface, muted, right }) {
    return (
        <button
            onClick={onClick}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className="group relative flex items-center gap-5 p-7 rounded-2xl border-2 text-left w-full transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            style={{
                borderColor: hovered ? GREEN : border,
                backgroundColor: hovered ? GREEN + "0e" : surface,
            }}
        >
            {/* accent line */}
            <div className={`absolute top-0 ${right ? "right-6" : "left-6"} w-12 h-[3px] rounded-b-full transition-all duration-300 group-hover:w-20`}
                 style={{ backgroundColor: GREEN }} />

            {/* icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                 style={{ backgroundColor: hovered ? GREEN : GREEN + "18", color: hovered ? "#fff" : GREEN }}>
                {icon}
            </div>

            <div className="flex-1">
                <div className="font-[Cormorant] text-[24px] leading-tight mb-1"
                     style={{ color: hovered ? GREEN : "inherit" }}>
                    {label}
                </div>
                <div className="font-sans text-[13px]" style={{ color: muted }}>
                    {description}
                </div>
            </div>

            <div className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                 style={{ color: GREEN }}>
                <Arrow size={18} />
            </div>
        </button>
    );
}

