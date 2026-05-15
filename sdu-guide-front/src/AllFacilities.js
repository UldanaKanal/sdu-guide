import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "./ThemeContext";
import { ArrowRight } from "lucide-react";

import BlockD from "./Components/assets/blockspng/BlockDimages/BlockD.png";
import BlockE from "./Components/assets/blockspng/BlockEimages/BlockE.png";
import BlockF from "./Components/assets/blockspng/BlockFimages/BlockF.png";
import BlockG from "./Components/assets/blockspng/BlockGimages/BlockG.png";
import BlockH from "./Components/assets/blockspng/BlockHimages/BlockH.png";
import BlockI from "./Components/assets/blockspng/BlockIimages/BlockI.png";

const GREEN = "#4C6740";

const BLOCKS = [
    { letter: "D", image: BlockD, color: "#863383" },
    { letter: "E", image: BlockE, color: "#641515" },
    { letter: "F", image: BlockF, color: "#363F78" },
    { letter: "G", image: BlockG, color: "#5E7745" },
    { letter: "H", image: BlockH, color: "#3B70A4" },
    { letter: "I", image: BlockI, color: "#6A3BA4" },
];

export default function AllFacilities() {
    const navigate     = useNavigate();
    const { darkMode } = useTheme();

    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg, color: darkMode ? "#f9fafb" : "#111827" }}>
            <Navbar />

            {/* ── HERO ────────────────────────────────────────── */}
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
                     style={{ background: "radial-gradient(ellipse 80% 60% at 50% 120%,rgba(0,0,0,.2),transparent)" }} />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="font-sans text-white/55 text-[11px] uppercase tracking-[6px] mb-5 block">
                        SDU University · Campus
                    </span>
                    <h1 className="text-white font-normal leading-tight mb-5"
                        style={{ fontSize: "clamp(38px, 5vw, 64px)" }}>
                        All Facilities
                    </h1>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { value: "6",   label: "Blocks" },
                            { value: "12",  label: "Wings" },
                            { value: "90+", label: "Rooms" },
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

            {/* ── GRID ────────────────────────────────────────── */}
            <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-8 py-16">
                <div className="text-center mb-12">
                    <p className="font-sans text-[11px] uppercase tracking-[5px] mb-2" style={{ color: GREEN }}>
                        Campus buildings
                    </p>
                    <h2 className="font-[Cormorant] font-normal"
                        style={{ fontSize: "clamp(28px, 3.5vw, 44px)" }}>
                        Select a building block
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BLOCKS.map(({ letter, image, color }) => (
                        <BlockCard
                            key={letter}
                            letter={letter}
                            image={image}
                            color={color}
                            surface={surface}
                            border={border}
                            muted={muted}
                            onBlock={() => navigate(`/Block${letter}`)}
                            onLeft={() => navigate(`/Block${letter}LeftSide`)}
                            onRight={() => navigate(`/Block${letter}RightSide`)}
                        />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function BlockCard({ letter, image, color, surface, border, muted, onBlock, onLeft, onRight }) {
    const [imgHover, setImgHover] = React.useState(false);

    return (
        <div className="group rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col"
             style={{ borderColor: border, backgroundColor: surface }}>

            {/* image */}
            <div className="relative overflow-hidden cursor-pointer flex-shrink-0"
                 style={{ aspectRatio: "16/9" }}
                 onClick={onBlock}
                 onMouseEnter={() => setImgHover(true)}
                 onMouseLeave={() => setImgHover(false)}>
                <img src={image} alt={`Block ${letter}`}
                     className="w-full h-full object-cover transition-transform duration-500"
                     style={{ transform: imgHover ? "scale(1.05)" : "scale(1)" }} />

                {/* block letter badge */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center text-white font-[Cormorant] text-[22px] font-bold shadow-lg"
                     style={{ backgroundColor: color }}>
                    {letter}
                </div>

                {/* hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
                     style={{ backgroundColor: "rgba(0,0,0,0.35)", opacity: imgHover ? 1 : 0 }}>
                    <span className="font-sans text-white text-[14px] font-semibold px-4 py-2 rounded-full"
                          style={{ backgroundColor: "rgba(76,103,64,0.85)" }}>
                        View Block {letter}
                    </span>
                </div>
            </div>

            {/* content */}
            <div className="p-6 flex flex-col gap-4">
                <div>
                    <h3 className="font-[Cormorant] text-[28px] leading-tight">Block {letter}</h3>
                    <p className="font-sans text-[12px] uppercase tracking-widest mt-0.5" style={{ color: muted }}>
                        2 Wings · 3 Floors · 15 Rooms
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button onClick={onLeft}
                            className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 font-sans text-[13px] font-medium transition-all duration-200 hover:text-white group/btn"
                            style={{ borderColor: GREEN, color: GREEN }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = GREEN; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = GREEN; }}>
                        <span>Left Wing</span>
                        <ArrowRight size={14} />
                    </button>
                    <button onClick={onRight}
                            className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 font-sans text-[13px] font-medium transition-all duration-200 hover:text-white"
                            style={{ borderColor: GREEN, color: GREEN }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = GREEN; e.currentTarget.style.color = "#fff"; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = GREEN; }}>
                        <span>Right Wing</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
