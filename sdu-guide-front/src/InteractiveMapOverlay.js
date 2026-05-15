import React from "react";

const ZONES = [
    { id: "Zone A",     x: 432,  y: 185, color: "#E8734A" },
    { id: "Eat Zone",   x: 1030, y: 480, color: "#4AA8E8" },
    { id: "Red Cantin", x: 910,  y: 475, color: "#C94040" },
    { id: "Bochka A",   x: 610,  y: 520, color: "#4C9E7A" },
    { id: "Bochka B",   x: 672,  y: 490, color: "#7A6CC9" },
    { id: "Bochka C",   x: 748,  y: 518, color: "#C97A2A" },
    { id: "Bochka D",   x: 842,  y: 496, color: "#3D7AC9" },
    { id: "Zone H",     x: 370,  y: 358, color: "#7A4CC9" },
    { id: "WIFI Zone",  x: 456,  y: 488, color: "#4CAA44" },
    { id: "Hall",       x: 1210, y: 500, color: "#C9A020" },
    { id: "Lab",        x: 1315, y: 490, color: "#5A9EC9" },
    { id: "Game Zone",  x: 1390, y: 620, color: "#C94A7A" },
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
