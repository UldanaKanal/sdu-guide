import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import exploreIcon from "../src/Components/assets/exploreicon.png";
import zones from "./data/zones"; // Убедись, что в zones.js названия тоже обновлены
import { useZone } from "./ZoneContext";

export default function Sidebar() {
    const { activeZone, setActiveZone } = useZone();

    return (
        <div className="w-48 h-full bg-[#4C684B] flex flex-col items-center justify-between">
            {/* Верхний логотип */}
            <div className="w-full h-20 flex flex-col items-center justify-center border-b border-[#4C684B]">
                <img src={exploreIcon} alt="Explore" className="w-6 h-6" />
                <span className="text-white text-sm mt-1">Explore</span>
            </div>

            {/* Список зон */}
            <div className="flex-1 flex flex-col items-center gap-4 mt-6 w-full">
                {zones.map((zone) => (
                    <button
                        key={zone.id}
                        onClick={() => setActiveZone(zone.id)}
                        className={`w-[90%] text-sm px-2 py-2 rounded-lg text-white transition
                            ${activeZone === zone.id ? "bg-[#D9D9D9] text-black font-semibold" : "hover:bg-[#5c7b5a]"}
                        `}
                    >
                        {zone.label}
                    </button>
                ))}
            </div>

            {/* Нижняя стрелка */}
            <div className="flex items-center justify-center mb-4">
                <FaChevronLeft className="text-black text-2xl cursor-pointer" />
            </div>
        </div>
    );
}
