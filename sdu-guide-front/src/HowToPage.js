import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import campusMap from "./Components/assets/campus3.png";
import {
    ExternalLink, MapPin, Info, Users,
    SlidersHorizontal, Map, QrCode,
    ChevronRight, CheckCircle, ArrowRight,
} from "lucide-react";
import { useTranslation } from "./LanguageContext";
import { useTheme } from "./ThemeContext";
import { Link } from "react-router-dom";

const GREEN       = "#4C6740";
const GREEN_DARK  = "#3D4037";
const GREEN_MUTED = "#878F71";

export default function HowToPage() {
    const { translations } = useTranslation();
    const { darkMode } = useTheme();

    const bg      = darkMode ? "#0f0f0f" : "#F8F8F8";
    const surface = darkMode ? "#1a1a1a" : "#ffffff";
    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";
    const accent  = darkMode ? GREEN_DARK : GREEN;

    return (
        <div className="min-h-screen flex flex-col font-[Cormorant]"
             style={{ backgroundColor: bg, color: darkMode ? "#f9fafb" : "#111827" }}>
            <Navbar />

            {/* ── HERO ────────────────────────────────────────── */}
            <section
                className="relative w-full flex flex-col items-center justify-center text-center overflow-hidden"
                style={{ backgroundColor: accent, minHeight: 480, padding: "80px 24px" }}
            >
                {/* grid overlay */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{
                         backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)",
                         backgroundSize: "48px 48px",
                     }} />
                {/* soft radial glow */}
                <div className="absolute inset-0 pointer-events-none"
                     style={{ background: "radial-gradient(ellipse 70% 60% at 50% 100%,rgba(0,0,0,.25),transparent)" }} />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="inline-block text-white/60 text-xs font-sans uppercase tracking-[5px] mb-5">
                        SDU Campus Guide
                    </span>
                    <h1 className="text-white font-normal leading-[1.15] mb-6"
                        style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
                        {translations.how_this_portal_helps || "How This Portal Helps"}
                    </h1>
                    <p className="text-white/75 font-sans text-[17px] sm:text-[19px] leading-relaxed max-w-xl mx-auto mb-10">
                        {translations.hero_subtitle ||
                            "Your smart guide to SDU campus — find rooms, check schedules, and never get lost again."}
                    </p>
                    <Link to="/detailed-map"
                          className="inline-flex items-center gap-2 font-sans font-semibold text-[15px] px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-xl"
                          style={{ backgroundColor: "#fff", color: accent }}>
                        Explore the Map <ChevronRight size={17} />
                    </Link>
                </div>
            </section>

            {/* ── HOW IT WORKS — 3 steps ──────────────────────── */}
            <section className="w-full py-28 px-6" style={{ backgroundColor: surface }}>
                <div className="max-w-5xl mx-auto">
                    <Eyebrow>Simple process</Eyebrow>
                    <SectionTitle>Three steps to find anything</SectionTitle>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                        {[
                            { n: "01", title: "Open the map",    desc: "Launch the interactive campus map from the home screen." },
                            { n: "02", title: "Select a block",  desc: "Choose from blocks D–I and tap on the floor plan." },
                            { n: "03", title: "View schedule",   desc: "Tap any room to instantly see the full weekly timetable." },
                        ].map(({ n, title, desc }) => (
                            <div key={n} className="flex flex-col gap-5">
                                <span className="font-[Cormorant] leading-none select-none"
                                      style={{ fontSize: 72, color: accent + "28" }}>{n}</span>
                                <div className="w-10 h-[2px]" style={{ backgroundColor: accent }} />
                                <h3 className="text-[22px] font-medium">{title}</h3>
                                <p className="font-sans text-[15px] leading-relaxed" style={{ color: muted }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── MAP FEATURE ─────────────────────────────────── */}
            <section className="w-full py-28 px-6" style={{ backgroundColor: bg }}>
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                    {/* image */}
                    <div className="w-full lg:w-[52%] flex-shrink-0">
                        <Link to="/detailed-map" className="block group rounded-3xl overflow-hidden shadow-2xl">
                            <img src={campusMap} alt="Campus Map"
                                 className="w-full block transition-transform duration-700 group-hover:scale-[1.03]" />
                        </Link>
                    </div>

                    {/* text */}
                    <div className="w-full lg:w-[48%]">
                        <Eyebrow>Interactive map</Eyebrow>
                        <h2 className="text-[36px] sm:text-[44px] leading-tight mb-6">
                            {translations.navigate_campus || "Navigate the campus easily and quickly!"}
                        </h2>
                        <p className="font-sans text-[16px] leading-relaxed mb-8" style={{ color: muted }}>
                            {translations.interactive_map_help ||
                                "The interactive map helps you quickly find classrooms, libraries, cafes, and more."}
                        </p>
                        <ul className="flex flex-col gap-4 mb-10">
                            {[
                                "6 building blocks with detailed floor plans",
                                "Tap any room to open its weekly schedule",
                                "Scan QR codes placed at room entrances",
                                "Dark mode & 3 language support",
                            ].map(item => (
                                <li key={item} className="flex items-start gap-3 font-sans text-[15px]">
                                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/detailed-map"
                              className="inline-flex items-center gap-2 font-sans font-semibold text-[14px] px-6 py-3 rounded-full border-2 transition-all duration-200 hover:text-white"
                              style={{ borderColor: accent, color: accent }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "#fff"; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = accent; }}>
                            <ExternalLink size={15} />
                            {translations.view_map || "View map"}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ─────────────────────────────────── */}
            <section className="w-full py-20 px-6" style={{ backgroundColor: accent }}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center text-white">
                    {[
                        { value: "6",    label: "Building Blocks" },
                        { value: "90+",  label: "Rooms" },
                        { value: "3",    label: "Languages" },
                        { value: "100%", label: "Free to use" },
                    ].map(({ value, label }) => (
                        <div key={label}>
                            <div className="font-[Cormorant] leading-none mb-2"
                                 style={{ fontSize: "clamp(42px,5vw,60px)" }}>{value}</div>
                            <div className="font-sans text-[12px] uppercase tracking-widest text-white/60">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── ADVANTAGE CARDS ─────────────────────────────── */}
            <section className="w-full py-28 px-6" style={{ backgroundColor: surface }}>
                <div className="max-w-6xl mx-auto">
                    <Eyebrow>Why choose us</Eyebrow>
                    <SectionTitle>{translations.advantages || "Advantages"}</SectionTitle>
                    <p className="text-center font-sans text-[16px] max-w-lg mx-auto mt-4 mb-16"
                       style={{ color: muted }}>
                        Everything you need to navigate SDU campus — in one place.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AdvCard icon={MapPin}           accent={accent} border={border} surface={surface} muted={muted} darkMode={darkMode}
                            title={translations.easy_navigation   || "Easy navigation"}
                            text={translations.easy_navigation_desc || "Find any office, recreation area, or establishment in seconds."} />
                        <AdvCard icon={Info}             accent={accent} border={border} surface={surface} muted={muted} darkMode={darkMode}
                            title={translations.current_info      || "Current information"}
                            text={translations.current_info_desc    || "Always accurate information about classes, teachers, and schedules."} />
                        <AdvCard icon={Users}            accent={accent} border={border} surface={surface} muted={muted} darkMode={darkMode}
                            title={translations.accessibility     || "Accessibility"}
                            text={translations.accessibility_desc   || "Available to students, teachers, and university staff."} />
                        <AdvCard icon={SlidersHorizontal} accent={accent} border={border} surface={surface} muted={muted} darkMode={darkMode}
                            title={translations.smart_filters     || "Smart Filters"}
                            text={translations.smart_filters_desc   || "Quick search for classrooms, labs, cafes, and more."} />
                        <AdvCard icon={Map}              accent={accent} border={border} surface={surface} muted={muted} darkMode={darkMode}
                            title={translations.interactive_map   || "Interactive map"}
                            text={translations.interactive_map_desc || "Routes, floors, convenient campus visualization."} />
                        <AdvCard icon={QrCode}           accent={accent} border={border} surface={surface} muted={muted} darkMode={darkMode}
                            title="QR Code Scanning"
                            text="Scan any room's QR code to instantly open its schedule on your phone." />
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────── */}
            <section className="w-full py-24 px-6" style={{ backgroundColor: bg }}>
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-[36px] sm:text-[48px] leading-tight mb-4">
                        Ready to explore SDU campus?
                    </h2>
                    <p className="font-sans text-[16px] mb-10" style={{ color: muted }}>
                        Start navigating — it's free, fast, and works on any device.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/"
                              className="inline-flex items-center gap-2 font-sans font-semibold text-[14px] px-8 py-3.5 rounded-full text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                              style={{ backgroundColor: accent }}>
                            Start now <ArrowRight size={16} />
                        </Link>
                        <Link to="/event"
                              className="inline-flex items-center gap-2 font-sans font-semibold text-[14px] px-8 py-3.5 rounded-full border-2 transition-all duration-200 hover:opacity-80"
                              style={{ borderColor: accent, color: accent }}>
                            View Events
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

/* ── small reusable pieces ───────────────────────────── */

function Eyebrow({ children }) {
    return (
        <p className="text-center font-sans text-[12px] uppercase tracking-[5px] mb-4"
           style={{ color: GREEN }}>
            {children}
        </p>
    );
}

function SectionTitle({ children }) {
    return (
        <h2 className="text-center font-[Cormorant] font-normal leading-tight"
            style={{ fontSize: "clamp(34px, 4vw, 52px)" }}>
            {children}
        </h2>
    );
}

function AdvCard({ icon: Icon, title, text, accent, border, surface, muted, darkMode }) {
    return (
        <div
            className="group relative flex flex-col gap-5 rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
            style={{ backgroundColor: surface, borderColor: border }}
        >
            {/* top accent line grows on hover */}
            <div className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full transition-all duration-500 group-hover:left-0 group-hover:right-0"
                 style={{ backgroundColor: accent }} />

            {/* icon badge */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ backgroundColor: accent + "1a" }}>
                <Icon size={22} style={{ color: accent }} />
            </div>

            <div>
                <h3 className="text-[20px] font-medium mb-3">{title}</h3>
                <p className="font-sans text-[14px] leading-relaxed" style={{ color: muted }}>{text}</p>
            </div>

            {/* subtle arrow hint */}
            <div className="mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-6 h-[1.5px]" style={{ backgroundColor: accent }} />
            </div>
        </div>
    );
}
