import { useState, useRef } from "react";
import { Heart, QrCode, Download, X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import XlsxViewer from "./XlsxViwer/XlsxViewer";
import BookingPanel from "./BookingPanel";
import { useFavorites } from "../../hooks/useFavorites";

export default function Modal({ room, onClose }) {
    const { isFavorite, toggle } = useFavorites();
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef(null);
    const fav = isFavorite(room);
    const displayName = room.toUpperCase().replace("-", " - ");
    const scheduleUrl = `${window.location.origin}/schedule/${room}`;

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector("canvas");
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR_${displayName.replace(" ", "_")}.png`;
        a.click();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto flex justify-center items-start"
            style={{ padding: "32px 16px" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-[#222] p-6 rounded-xl shadow-lg max-w-5xl w-full relative my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white text-2xl leading-none hover:text-gray-300 transition-colors z-10"
                >
                    ×
                </button>

                <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                    <h2 className="text-white text-xl font-[Cormorant]">
                        Расписание — {displayName}
                    </h2>

                    <button
                        onClick={() => toggle(room)}
                        title={fav ? "Убрать из избранного" : "Добавить в избранное"}
                        className="flex items-center gap-1 px-3 py-1 rounded-full border transition-all duration-200 text-sm"
                        style={{
                            borderColor: fav ? "#ef4444" : "#6b7280",
                            color: fav ? "#ef4444" : "#9ca3af",
                        }}
                    >
                        <Heart
                            size={16}
                            className={fav ? "fill-red-500 text-red-500" : "text-gray-400"}
                        />
                        {fav ? "В избранном" : "В избранное"}
                    </button>

                    <button
                        onClick={() => setShowQR(v => !v)}
                        title="QR-код аудитории"
                        className="flex items-center gap-1 px-3 py-1 rounded-full border transition-all duration-200 text-sm"
                        style={{
                            borderColor: showQR ? "#4C6740" : "#6b7280",
                            color: showQR ? "#6abf5e" : "#9ca3af",
                        }}
                    >
                        <QrCode size={16} />
                        QR-код
                    </button>
                </div>

                {/* QR-код панель */}
                {showQR && (
                    <div className="flex flex-col items-center gap-3 mb-5 p-4 bg-white rounded-xl w-fit mx-auto">
                        <div ref={qrRef}>
                            <QRCodeCanvas
                                value={scheduleUrl}
                                size={180}
                                bgColor="#ffffff"
                                fgColor="#222222"
                                level="M"
                                includeMargin
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-center max-w-[180px] break-all">
                            {scheduleUrl}
                        </p>
                        <button
                            onClick={downloadQR}
                            className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#4C6740] text-white text-sm hover:bg-[#3a5030] transition-colors"
                        >
                            <Download size={14} />
                            Скачать PNG
                        </button>
                    </div>
                )}

                <XlsxViewer room={room} />
                <BookingPanel room={room} />
            </div>
        </div>
    );
}
