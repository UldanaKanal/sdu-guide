import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "./LanguageContext";
import sduLogo from "./Components/assets/SDUlogo.png";
import sduLogoDark from "./Components/assets/SDUlogoDark.png";
import { FaSun, FaMoon } from "react-icons/fa";
import { QrCode, Menu, X, ChevronDown, BookOpen } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function Navbar() {
    const [isDropdownOpen,     setIsDropdownOpen]     = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isMobileMenuOpen,   setIsMobileMenuOpen]   = useState(false);
    const [isMobileFacOpen,    setIsMobileFacOpen]    = useState(false);

    const { translations, setLanguage } = useTranslation();
    const { darkMode, toggleDarkMode }  = useTheme();
    const [currentLang, setCurrentLang] = useState(localStorage.getItem("language") || "ENG");

    const navRef = useRef(null);

    useEffect(() => { setLanguage(currentLang.toLowerCase()); }, [currentLang, setLanguage]);

    /* close all dropdowns on outside click */
    useEffect(() => {
        const handler = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
                setIsLangDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* close mobile menu on resize to desktop */
    useEffect(() => {
        const handler = () => { if (window.innerWidth >= 1024) setIsMobileMenuOpen(false); };
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    const changeLanguage = (lang) => {
        const up = lang.toUpperCase();
        setCurrentLang(up);
        setLanguage(lang.toLowerCase());
        localStorage.setItem("language", up);
        setIsLangDropdownOpen(false);
    };

    const closeMobile = () => { setIsMobileMenuOpen(false); setIsMobileFacOpen(false); };

    const headerBg    = darkMode ? "#121212" : "#ffffff";
    const headerText  = darkMode ? "#ffffff" : "#000000";
    const dropdownBg  = darkMode ? "#1a1a1a" : "#ffffff";
    const dropdownBdr = darkMode ? "#374151" : "#e5e7eb";
    const hoverBg     = darkMode ? "#374151" : "#f3f4f6";
    const mobileBg    = darkMode ? "#0f0f0f" : "#f9fafb";

    const BLOCKS = ["D", "E", "F", "G", "H", "I"];

    return (
        <header ref={navRef} className="sticky top-0 z-50 shadow-md"
                style={{ backgroundColor: headerBg, color: headerText }}>

            {/* ── MAIN BAR ──────────────────────────────────── */}
            <div className="h-16 flex items-center justify-between px-4 sm:px-8 lg:px-10">

                {/* Logo */}
                <Link to="/" onClick={closeMobile}>
                    <img src={darkMode ? sduLogoDark : sduLogo} alt="SDU Logo"
                         className="h-10 sm:h-12 transition-opacity duration-300" />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex flex-grow justify-center items-center gap-6 text-[15px] font-bold uppercase">
                    <Link to="/" className="hover:opacity-60 transition-opacity">
                        {translations.home || "Home"}
                    </Link>
                    <Dot />
                    <a href="https://my.sdu.edu.kz/index.php?mod=schedule"
                       target="_blank" rel="noopener noreferrer"
                       className="hover:opacity-60 transition-opacity">
                        {translations.portal || "Portal"}
                    </a>
                    <Dot />
                    <Link to="/how-to" className="hover:opacity-60 transition-opacity">
                        {translations.how_to || "How To"}
                    </Link>
                    <Dot />

                    {/* Faculties dropdown */}
                    <div className="relative">
                        <button onClick={() => setIsDropdownOpen(v => !v)}
                                className="flex items-center gap-1 hover:opacity-60 transition-opacity text-[15px] font-bold uppercase font-[inherit]">
                            {translations.faculties || "Faculties"}
                            <ChevronDown size={14}
                                         className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-40 rounded-xl shadow-xl border py-1.5 z-50"
                                 style={{ backgroundColor: dropdownBg, borderColor: dropdownBdr }}>
                                {BLOCKS.map(b => (
                                    <Link key={b} to={`/Block${b}`}
                                          onClick={() => setIsDropdownOpen(false)}
                                          className="block px-4 py-2 text-[14px] font-normal normal-case transition-colors"
                                          style={{ color: headerText }}
                                          onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                                        Block {b}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Dot />
                    <Link to="/event" className="hover:opacity-60 transition-opacity">
                        {translations.event || "Events"}
                    </Link>
                </nav>

                {/* Right controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* My bookings */}
                    <Link to="/my-bookings" title="Мои бронирования"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: darkMode ? "#d1d5db" : "#4b5563" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                        <BookOpen size={19} />
                    </Link>

                    {/* QR scan */}
                    <Link to="/scan" title="Scan QR code"
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: darkMode ? "#d1d5db" : "#4b5563" }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                        <QrCode size={19} />
                    </Link>

                    {/* Language */}
                    <div className="relative">
                        <button onClick={() => setIsLangDropdownOpen(v => !v)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[13px] uppercase transition-colors"
                                style={{ color: headerText }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                            {currentLang}
                            <ChevronDown size={12} className={`transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {isLangDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-24 rounded-xl shadow-xl border py-1.5 z-50"
                                 style={{ backgroundColor: dropdownBg, borderColor: dropdownBdr }}>
                                {["ENG", "KAZ", "RU"].map(lang => (
                                    <button key={lang} onClick={() => changeLanguage(lang.toLowerCase())}
                                            className="block w-full text-left px-4 py-2 text-[13px] font-bold uppercase transition-colors"
                                            style={{ color: headerText, backgroundColor: currentLang === lang ? hoverBg : "transparent" }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = currentLang === lang ? hoverBg : "transparent"}>
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dark mode toggle */}
                    <button onClick={toggleDarkMode}
                            className="relative w-11 h-6 flex items-center p-1 rounded-full transition-colors duration-300 flex-shrink-0"
                            style={{ backgroundColor: darkMode ? "#4b5563" : "#d1d5db" }}>
                        <div className={`absolute inset-y-0 left-1 flex items-center transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-0"}`}
                             style={{ color: darkMode ? "#fbbf24" : "#374151" }}>
                            {darkMode ? <FaSun size={12} /> : <FaMoon size={12} />}
                        </div>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
                    </button>

                    {/* Hamburger — mobile only */}
                    <button onClick={() => setIsMobileMenuOpen(v => !v)}
                            className="lg:hidden p-1.5 rounded-lg transition-colors ml-1"
                            style={{ color: headerText }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* ── MOBILE MENU ───────────────────────────────── */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t"
                     style={{ backgroundColor: mobileBg, borderColor: dropdownBdr }}>
                    <div className="px-4 py-3 flex flex-col gap-1">

                        <MobileLink to="/"         label={translations.home    || "Home"}    onClick={closeMobile} hoverBg={hoverBg} color={headerText} />
                        <MobileLink href="https://my.sdu.edu.kz/index.php?mod=schedule"
                                                   label={translations.portal  || "Portal"}  onClick={closeMobile} hoverBg={hoverBg} color={headerText} external />
                        <MobileLink to="/how-to"   label={translations.how_to  || "How To"}  onClick={closeMobile} hoverBg={hoverBg} color={headerText} />

                        {/* Faculties accordion */}
                        <div>
                            <button onClick={() => setIsMobileFacOpen(v => !v)}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-left font-bold uppercase text-[14px] transition-colors"
                                    style={{ color: headerText }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                                <span>{translations.faculties || "Faculties"}</span>
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isMobileFacOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isMobileFacOpen && (
                                <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 pl-3"
                                     style={{ borderColor: "#4C6740" }}>
                                    {BLOCKS.map(b => (
                                        <MobileLink key={b} to={`/Block${b}`}
                                                    label={`Block ${b}`}
                                                    onClick={closeMobile}
                                                    hoverBg={hoverBg}
                                                    color={headerText}
                                                    small />
                                    ))}
                                </div>
                            )}
                        </div>

                        <MobileLink to="/event"    label={translations.event   || "Events"}  onClick={closeMobile} hoverBg={hoverBg} color={headerText} />
                        <MobileLink to="/scan"     label="Scan QR Code"                      onClick={closeMobile} hoverBg={hoverBg} color={headerText} />
                    </div>
                </div>
            )}
        </header>
    );
}

/* ── small helpers ─────────────────────────────────── */
function Dot() {
    return <span className="opacity-30 text-[10px]">●</span>;
}

function MobileLink({ to, href, label, onClick, hoverBg, color, external, small }) {
    const cls = `block px-3 py-3 rounded-xl font-bold uppercase transition-colors text-left w-full ${small ? "text-[13px] font-medium normal-case" : "text-[14px]"}`;

    if (href || external) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}
               className={cls} style={{ color }}
               onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
               onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
                {label}
            </a>
        );
    }
    return (
        <Link to={to} onClick={onClick} className={cls} style={{ color }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
            {label}
        </Link>
    );
}
