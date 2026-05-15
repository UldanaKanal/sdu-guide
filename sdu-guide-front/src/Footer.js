import React from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaTelegramPlane } from "react-icons/fa";
import footerLogo     from "./Components/assets/footerLOGO.png";
import footerLogoDark from "./Components/assets/footerLOGOdark.png";
import { useTheme }       from "./ThemeContext";
import { useTranslation } from "./LanguageContext";
import { Link } from "react-router-dom";

const SOCIALS = [
    { icon: FaInstagram,     href: "#", label: "Instagram" },
    { icon: FaFacebookF,     href: "#", label: "Facebook"  },
    { icon: FaTiktok,        href: "#", label: "TikTok"    },
    { icon: FaTelegramPlane, href: "#", label: "Telegram"  },
];

export default function Footer() {
    const { darkMode }     = useTheme();
    const { translations } = useTranslation();

    const bg      = darkMode ? "#3D4037" : "#878F71";
    const divider = "rgba(255,255,255,0.15)";

    return (
        <footer style={{ backgroundColor: bg }} className="text-white">

            {/* ── MAIN CONTENT ──────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-10 pb-8">

                {/* Mobile top: logo + socials in one compact row */}
                <div className="flex md:hidden items-center justify-between mb-6 pb-6"
                     style={{ borderBottom: `1px solid ${divider}` }}>
                    <img src={darkMode ? footerLogoDark : footerLogo}
                         alt="SDU Guide" className="h-16 object-contain" />
                    <div className="flex items-center gap-2">
                        {SOCIALS.map(({ icon: Icon, href, label }) => (
                            <a key={label} href={href} aria-label={label}
                               className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                               style={{ border: "1px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.8)" }}
                               onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#3D4037"; }}
                               onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}>
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Grid: mobile 2-col, desktop 3-col с логотипом по центру */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

                    {/* Col 1 — Website links */}
                    <div className="flex flex-col gap-3">
                        <h3 className="font-sans text-[10px] uppercase tracking-[4px] text-white/55">
                            {translations.website || "Website"}
                        </h3>
                        <nav className="flex flex-col gap-1.5">
                            {[
                                { label: translations.portal2         || "Portal",           href: "https://my.sdu.edu.kz/index.php?mod=schedule", ext: true },
                                { label: translations.faculties2      || "Faculties",         to:   "/AllFacilities" },
                                { label: translations.maps_directions || "Maps & Directions", to:   "/detailed-map"  },
                                { label: translations.events          || "Events",            to:   "/event"         },
                                { label: "How To",                                            to:   "/how-to"        },
                            ].map(({ label, to, href, ext }) =>
                                ext ? (
                                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                                       className="font-[Cormorant] text-[16px] sm:text-[18px] text-white/75 hover:text-white transition-colors w-fit">
                                        {label}
                                    </a>
                                ) : (
                                    <Link key={label} to={to}
                                          className="font-[Cormorant] text-[16px] sm:text-[18px] text-white/75 hover:text-white transition-colors w-fit">
                                        {label}
                                    </Link>
                                )
                            )}
                        </nav>
                    </div>

                    {/* Col 2 — Logo (только desktop, скрыт на мобиле) */}
                    <div className="hidden md:flex flex-col items-center gap-5 px-6 border-x"
                         style={{ borderColor: divider }}>
                        <img src={darkMode ? footerLogoDark : footerLogo}
                             alt="SDU Guide" className="h-28 object-contain" />
                        <div className="flex items-center gap-3">
                            {SOCIALS.map(({ icon: Icon, href, label }) => (
                                <a key={label} href={href} aria-label={label}
                                   className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                   style={{ border: "1px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.8)" }}
                                   onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.color = "#3D4037"; e.currentTarget.style.borderColor = "transparent"; }}
                                   onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}>
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>
                        <p className="font-sans text-[12px] text-center leading-relaxed max-w-[240px]"
                           style={{ color: "rgba(255,255,255,0.5)" }}>
                            {translations.address ||
                                "Almaty region, Karasai district. 040900, city of Kaskelen, st. Abylai Khan 1/1"}
                        </p>
                    </div>

                    {/* Col 3 — Contact */}
                    <div className="flex flex-col gap-3 items-start md:items-end">
                        <h3 className="font-sans text-[10px] uppercase tracking-[4px] text-white/55">
                            {translations.contact || "Contact"}
                        </h3>
                        <div className="flex flex-col gap-1.5 md:items-end">
                            <a href="tel:+77273079565"
                               className="font-[Cormorant] text-[18px] sm:text-[20px] text-white hover:text-white/80 transition-colors">
                                {translations.phone || "+7 727 307 95 65"}
                            </a>
                            <a href="mailto:info@sdu.edu.kz"
                               className="font-[Cormorant] text-[16px] sm:text-[18px] text-white/75 hover:text-white transition-colors">
                                {translations.email || "info@sdu.edu.kz"}
                            </a>
                            <Link to="/scan"
                                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[11px] transition-all duration-200"
                                  style={{ border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.65)" }}
                                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; e.currentTarget.style.color = "#fff"; }}
                                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                                    <path d="M14 14h3v3M17 21h3M21 17h-3"/>
                                </svg>
                                Scan QR
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile address */}
                <p className="md:hidden font-sans text-[11px] text-center leading-relaxed mt-5 pt-5"
                   style={{ color: "rgba(255,255,255,0.45)", borderTop: `1px solid ${divider}` }}>
                    {translations.address ||
                        "Almaty region, Karasai district. 040900, city of Kaskelen, st. Abylai Khan 1/1"}
                </p>
            </div>

            {/* ── BOTTOM BAR ────────────────────────────────── */}
            <div style={{ borderTop: `1px solid ${divider}` }}>
                <div className="max-w-6xl mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-1">
                    <p className="font-sans text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        © {new Date().getFullYear()} SDU Campus Guide. All rights reserved.
                    </p>
                    <p className="font-sans text-[12px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Suleyman Demirel University
                    </p>
                </div>
            </div>
        </footer>
    );
}
