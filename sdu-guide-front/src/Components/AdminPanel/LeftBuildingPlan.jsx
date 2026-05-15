import { useState } from "react";
import Modal from "./Modal";
import { useTheme } from "../../ThemeContext";

const GREEN = "#4C6740";
const FLOOR_LABELS = { 3: "3rd", 2: "2nd", 1: "1st" };

const allRooms = [
    { x: 145, y: 140, number: 301 },
    { x: 345, y: 140, number: 302 },
    { x: 545, y: 140, number: 303 },
    { x: 740, y: 140, number: 304 },
    { x: 915, y: 140, number: 305 },
    { x: 145, y: 235, number: 201 },
    { x: 345, y: 235, number: 202 },
    { x: 545, y: 235, number: 203 },
    { x: 740, y: 235, number: 204 },
    { x: 915, y: 235, number: 205 },
    { x: 145, y: 335, number: 101 },
    { x: 345, y: 335, number: 102 },
    { x: 545, y: 335, number: 103 },
    { x: 740, y: 335, number: 104 },
    { x: 915, y: 335, number: 105 },
];

const floorOf = (n) => Math.floor(n / 100);

export default function LeftBuildingPlan({ svgPath, roomPrefix }) {
    const { darkMode } = useTheme();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [hoveredRoom,  setHoveredRoom]  = useState(null);
    const [activeFloor,  setActiveFloor]  = useState(null);

    const border  = darkMode ? "#2a2a2a" : "#e5e7eb";
    const muted   = darkMode ? "#9ca3af" : "#6b7280";
    const surface = darkMode ? "#111"    : "#fff";
    const textCol = darkMode ? "#f9fafb" : "#111827";

    const floors       = [3, 2, 1];
    const visibleRooms = activeFloor ? allRooms.filter(r => floorOf(r.number) === activeFloor) : allRooms;
    const gridFloors   = activeFloor ? [activeFloor] : floors;

    const openRoom = (number) => setSelectedRoom(`${roomPrefix}-${number}`);

    return (
        <div>
            {/* ── Floor tabs ──────────────────────────────────── */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="font-sans text-[11px] uppercase tracking-[4px]" style={{ color: muted }}>
                    Floor:
                </span>
                {[null, ...floors].map(floor => (
                    <button
                        key={floor ?? "all"}
                        onClick={() => setActiveFloor(floor)}
                        className="font-sans text-[13px] font-medium px-4 py-1.5 rounded-full border-2 transition-all duration-200"
                        style={{
                            borderColor: GREEN,
                            backgroundColor: activeFloor === floor ? GREEN : "transparent",
                            color: activeFloor === floor ? "#fff" : GREEN,
                        }}
                    >
                        {floor ? `${FLOOR_LABELS[floor]} Floor` : "All"}
                    </button>
                ))}
                {selectedRoom && (
                    <span className="ml-auto font-sans text-[13px] px-4 py-1.5 rounded-full"
                          style={{ backgroundColor: GREEN + "18", color: GREEN }}>
                        ✓ <strong>{selectedRoom.toUpperCase().replace("-", " ")}</strong>
                    </span>
                )}
            </div>

            {/* ── SVG floor plan ──────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden border shadow-sm mb-8"
                 style={{ borderColor: border, backgroundColor: surface }}>
                <svg viewBox="0 0 1000 500" width="100%" style={{ display: "block" }}>
                    {/* оригинальное изображение */}
                    <image href={svgPath} width="100%" height="100%" />

                    {/* индикаторы комнат — маленькие точки поверх оригинала */}
                    {visibleRooms.map(({ x, y, number }) => {
                        const roomId     = `${roomPrefix}-${number}`;
                        const isSelected = selectedRoom === roomId;
                        const isHovered  = hoveredRoom  === number;

                        /* центр точки — посередине оригинального хит-ареа */
                        const cx = x + 10;
                        const cy = y + 20;

                        return (
                            <g key={number}
                               onClick={() => openRoom(number)}
                               onMouseEnter={() => setHoveredRoom(number)}
                               onMouseLeave={() => setHoveredRoom(null)}
                               style={{ cursor: "pointer" }}>

                                {/* расширенный прозрачный хит-ареа */}
                                <rect x={x - 60} y={y - 10} width="160" height="65"
                                      fill="transparent" />

                                {/* пульсирующий фон для выбранного */}
                                {isSelected && (
                                    <circle cx={cx} cy={cy} r="18"
                                            fill={GREEN} opacity="0.18" />
                                )}

                                {/* основная точка */}
                                <circle
                                    cx={cx} cy={cy}
                                    r={isSelected ? 10 : isHovered ? 8 : 6}
                                    fill={isSelected ? GREEN : isHovered ? GREEN : GREEN + "80"}
                                    stroke="white"
                                    strokeWidth={isSelected ? "2.5" : "2"}
                                    style={{ transition: "r 0.15s, fill 0.15s" }}
                                />

                                {/* номер рядом с точкой при hover или selected */}
                                {(isHovered || isSelected) && (
                                    <text
                                        x={cx + 15} y={cy + 5}
                                        fontFamily="sans-serif" fontSize="12"
                                        fontWeight="700" fill={GREEN}
                                        style={{ pointerEvents: "none", userSelect: "none" }}
                                    >
                                        {number}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* ── Room grid ───────────────────────────────────── */}
            <div className="space-y-8">
                {gridFloors.map(floor => (
                    <div key={floor}>
                        {/* floor header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-sans text-[12px] font-bold flex-shrink-0"
                                 style={{ backgroundColor: GREEN }}>
                                {floor}
                            </div>
                            <span className="font-[Cormorant] text-[22px]">
                                {FLOOR_LABELS[floor]} Floor
                            </span>
                            <div className="flex-1 h-px" style={{ backgroundColor: border }} />
                        </div>

                        {/* room cards */}
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {allRooms
                                .filter(r => floorOf(r.number) === floor)
                                .map(({ number }) => {
                                    const roomId     = `${roomPrefix}-${number}`;
                                    const isSelected = selectedRoom === roomId;

                                    return (
                                        <button
                                            key={number}
                                            onClick={() => setSelectedRoom(roomId)}
                                            className="group relative flex flex-col items-center gap-1.5 py-5 px-2 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                                            style={{
                                                borderColor: GREEN,
                                                backgroundColor: isSelected ? GREEN : "transparent",
                                            }}
                                            onMouseEnter={e => {
                                                if (!isSelected) e.currentTarget.style.backgroundColor = GREEN + "12";
                                            }}
                                            onMouseLeave={e => {
                                                if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                                            }}
                                        >
                                            {/* top accent */}
                                            {!isSelected && (
                                                <div className="absolute top-0 left-4 right-4 h-[2px] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                     style={{ backgroundColor: GREEN }} />
                                            )}
                                            <span className="font-[Cormorant] leading-none"
                                                  style={{ fontSize: 32, color: isSelected ? "#fff" : GREEN }}>
                                                {number}
                                            </span>
                                            <span className="font-sans text-[10px] uppercase tracking-widest"
                                                  style={{ color: isSelected ? "rgba(255,255,255,.65)" : muted }}>
                                                {roomPrefix.toUpperCase()} · {floor}F
                                            </span>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-8 text-center font-sans text-[12px]" style={{ color: muted }}>
                Click a room on the plan or in the grid below to view its schedule
            </p>

            {selectedRoom && (
                <Modal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
            )}
        </div>
    );
}
