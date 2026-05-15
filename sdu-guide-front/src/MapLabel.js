import React, { useRef, useEffect, useState } from "react";

export default function MapLabel({ x, y, height = 40, text }) {
    const [textWidth, setTextWidth] = useState(0);
    const textRef = useRef(null);
    const padding = 20;
    const radius = 20;

    useEffect(() => {
        if (textRef.current) {
            const bbox = textRef.current.getBBox();
            setTextWidth(bbox.width + padding);
        }
    }, [text]);

    return (
        <g transform={`translate(${x}, ${y})`}>
            {/* Табличка */}
            <rect width={textWidth} height={height} rx={radius} fill="black" />
            {/* Текст */}
            <text
                ref={textRef}
                x={textWidth / 2}
                y={height / 2 + 6}
                textAnchor="middle"
                fill="white"
                fontSize="18"
                fontFamily="serif"
            >
                {text}
            </text>
            {/* Ножка */}
            <line
                x1={textWidth / 2}
                y1={height}
                x2={textWidth / 2}
                y2={height + 25}
                stroke="black"
                strokeWidth="2"
            />
        </g>
    );
}
