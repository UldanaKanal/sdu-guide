import React from "react";

const ZONES = [
    // Left side — entrance & small blocks
    { id: "Zone A",     x: 115,  y: 390, color: "#E8734A" },   // teal building, left entrance
    { id: "Zone H",     x: 272,  y: 448, color: "#7A4CC9" },   // purple circular building, left-center

    // Four cylindrical Bochka lounges — bottom-center
    { id: "Bochka A",   x: 553,  y: 468, color: "#4C9E7A" },
    { id: "Bochka B",   x: 646,  y: 468, color: "#7A6CC9" },
    { id: "Bochka C",   x: 755,  y: 455, color: "#C97A2A" },
    { id: "Bochka D",   x: 858,  y: 455, color: "#3D7AC9" },

    // Eat Zone — food court around the cylindrical area
    { id: "Eat Zone",   x: 695,  y: 515, color: "#4AA8E8" },

    // Large cyan Hall — center-right
    { id: "Hall",       x: 1005, y: 488, color: "#C9A020" },

    // WIFI Zone — gap/open area between Hall and right blocks
    { id: "WIFI Zone",  x: 1145, y: 488, color: "#4CAA44" },

    // Red Cantin — orange-coral building, bottom right-center
    { id: "Red Cantin", x: 1195, y: 472, color: "#C94040" },

    // Lab & Game Zone — right-side gray structures
    { id: "Lab",        x: 1355, y: 475, color: "#5A9EC9" },
    { id: "Game Zone",  x: 1430, y: 530, color: "#C94A7A" },
];

const PIN_R = 14;

export default function InteractiveMapOverlay({ selectedZone, onZoneClick }) {
    return (
        <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1643 824"
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }}
        >
            {ZONES.map(({ id, x, y, color }) => {
                const isSelected = id === selectedZone;
                const r = isSelected ? PIN_R + 3 : PIN_R;

                return (
                    <g
                        key={id}
                        onClick={() => onZoneClick(id)}
                        style={{ cursor: "pointer", pointerEvents: "all" }}
                    >
                        {/* glow ring for selected */}
                        {isSelected && (
                            <circle cx={x} cy={y - r} r={r + 8}
                                    fill={color} opacity="0.25" />
                        )}

                        {/* pin body: circle + teardrop tail */}
                        <circle cx={x} cy={y - r} r={r}
                                fill={color}
                                stroke="white"
                                strokeWidth={isSelected ? 2.5 : 1.5} />

                        {/* tail */}
                        <polygon
                            points={`${x - 5},${y - 3} ${x + 5},${y - 3} ${x},${y + 8}`}
                            fill={color}
                        />

                        {/* white dot inside pin */}
                        <circle cx={x} cy={y - r} r={r * 0.38}
                                fill="rgba(255,255,255,0.85)" />

                        {/* label bubble */}
                        <g transform={`translate(${x}, ${y - r * 2 - 22})`}>
                            <rect
                                x={-(id.length * 4.2 + 8) / 2}
                                y={-14}
                                width={id.length * 4.2 + 16}
                                height={22}
                                rx={6}
                                fill={isSelected ? color : "rgba(255,255,255,0.92)"}
                                stroke={color}
                                strokeWidth="1.5"
                            />
                            <text
                                x={0} y={3}
                                textAnchor="middle"
                                fontFamily="sans-serif"
                                fontSize={isSelected ? 11 : 10}
                                fontWeight={isSelected ? "700" : "600"}
                                fill={isSelected ? "#fff" : color}
                                style={{ pointerEvents: "none", userSelect: "none" }}
                            >
                                {id}
                            </text>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}
