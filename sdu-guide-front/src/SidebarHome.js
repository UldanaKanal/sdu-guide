import React from "react";
import { Globe2, Building2, Landmark, Hotel } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function SidebarHome({ onZoneClick }) {
    const { darkMode } = useTheme();

    const zones = [
        { label: "Campus",   icon: Landmark,  block: "L" },
        { label: "SDU Life", icon: Building2, block: "K" },
        { label: "Dorm",     icon: Hotel,     block: "J" },
    ];

    return (
        <div
            className="flex flex-col items-center py-7 px-2 rounded-2xl gap-1 flex-shrink-0"
            style={{
                width: 88,
                backgroundColor: darkMode ? "#2a3527" : "#4C6740",
                alignSelf: "flex-start",
            }}
        >
            <Globe2 size={26} color="rgba(255,255,255,0.7)" />
            <span style={{
                fontFamily: "sans-serif",
                fontSize: 9,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                marginTop: 4,
                marginBottom: 20,
            }}>
                Explore
            </span>

            {zones.map(({ label, icon: Icon, block }) => (
                <button
                    key={block}
                    onClick={() => onZoneClick(block)}
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                        padding: "10px 4px",
                        borderRadius: 12,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Icon size={20} color="rgba(255,255,255,0.85)" />
                    </div>
                    <span style={{
                        fontFamily: "sans-serif",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.65)",
                        textAlign: "center",
                        lineHeight: 1.2,
                    }}>
                        {label}
                    </span>
                </button>
            ))}
        </div>
    );
}
