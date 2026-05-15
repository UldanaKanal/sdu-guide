import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { QrCode, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { useTheme } from "./ThemeContext";

export default function QRScannerPage() {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [status, setStatus] = useState("init"); // init | scanning | success | error | no-camera
    const [errorMsg, setErrorMsg] = useState("");
    const scannerRef = useRef(null);
    const handledRef = useRef(false);

    useEffect(() => {
        const scanner = new Html5Qrcode("qr-reader", { verbose: false });
        scannerRef.current = scanner;

        scanner
            .start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 240, height: 240 } },
                (decodedText) => {
                    if (handledRef.current) return;

                    try {
                        const url = new URL(decodedText);
                        const path = url.pathname;

                        if (path.startsWith("/schedule/")) {
                            handledRef.current = true;
                            setStatus("success");
                            scanner.stop().catch(() => {});
                            setTimeout(() => navigate(path), 1200);
                        } else {
                            setStatus("error");
                            setErrorMsg("Это не QR-код аудитории SDU");
                            setTimeout(() => setStatus("scanning"), 2000);
                        }
                    } catch {
                        setStatus("error");
                        setErrorMsg("Не удалось распознать QR-код");
                        setTimeout(() => setStatus("scanning"), 2000);
                    }
                },
                () => {}
            )
            .then(() => setStatus("scanning"))
            .catch(() => {
                setStatus("no-camera");
                setErrorMsg("Нет доступа к камере. Разрешите доступ в настройках браузера.");
            });

        return () => {
            scanner.stop().catch(() => {});
        };
    }, [navigate]);

    const frameColor =
        status === "success" ? "#22c55e" :
        status === "error"   ? "#ef4444" :
                               "#4C6740";

    return (
        <div className={`min-h-screen flex flex-col font-[Cormorant] ${darkMode ? "bg-[#2F2D2D] text-white" : "bg-[#F8F8F8] text-black"}`}>
            <Navbar />

            {/* Hero */}
            <section
                className="w-full h-[200px] flex flex-col items-center justify-center gap-3"
                style={{ backgroundColor: darkMode ? "#3D4037" : "#4C6740" }}
            >
                <QrCode size={36} className="text-white" />
                <h1 className="text-white text-[36px] font-normal">Сканировать QR-код</h1>
            </section>

            <main className="flex-grow flex flex-col items-center justify-center py-10 px-4 gap-6">

                {status === "no-camera" ? (
                    <div className="flex flex-col items-center gap-5 text-center">
                        <Camera size={72} className="text-gray-400" />
                        <p className="text-[22px] text-red-500 font-medium">{errorMsg}</p>
                        <p className="text-gray-400 text-[17px] max-w-sm leading-relaxed">
                            Откройте настройки браузера и разрешите доступ к камере для этого сайта,
                            затем обновите страницу.
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-[20px] text-gray-500">
                            Наведите камеру на QR-код аудитории
                        </p>

                        {/* Видоискатель */}
                        <div className="relative" style={{ width: 320, height: 320 }}>
                            <div
                                id="qr-reader"
                                style={{ width: 320, height: 320, borderRadius: 16, overflow: "hidden" }}
                            />

                            {/* Угловые рамки поверх видео */}
                            <div className="absolute inset-0 pointer-events-none">
                                <Corner pos="top-3 left-3"    borders="border-t-4 border-l-4 rounded-tl-lg" color={frameColor} />
                                <Corner pos="top-3 right-3"   borders="border-t-4 border-r-4 rounded-tr-lg" color={frameColor} />
                                <Corner pos="bottom-3 left-3" borders="border-b-4 border-l-4 rounded-bl-lg" color={frameColor} />
                                <Corner pos="bottom-3 right-3"borders="border-b-4 border-r-4 rounded-br-lg" color={frameColor} />

                                {/* Сканирующая линия */}
                                {status === "scanning" && (
                                    <div className="scan-line" style={{
                                        position: "absolute",
                                        left: 20, right: 20, height: 2,
                                        background: "linear-gradient(to right, transparent, #4C6740, transparent)",
                                    }} />
                                )}
                            </div>
                        </div>

                        {/* Статус */}
                        {status === "success" && (
                            <div className="flex items-center gap-2 text-green-500 text-[22px]">
                                <CheckCircle size={28} />
                                Аудитория найдена — переход...
                            </div>
                        )}
                        {status === "error" && (
                            <div className="flex items-center gap-2 text-red-500 text-[20px]">
                                <AlertCircle size={24} />
                                {errorMsg}
                            </div>
                        )}
                        {status === "scanning" && (
                            <p className="text-gray-400 text-[16px]">
                                Держите QR-код в рамке
                            </p>
                        )}
                    </>
                )}
            </main>

            {/* Анимация сканирующей линии */}
            <style>{`
                #qr-reader { border: none !important; background: transparent !important; }
                #qr-reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; border-radius: 16px; }
                #qr-reader img { display: none !important; }
                #qr-reader__scan_region { border: none !important; }
                @keyframes scanMove {
                    0%   { top: 20px; }
                    50%  { top: 284px; }
                    100% { top: 20px; }
                }
                .scan-line { animation: scanMove 2s ease-in-out infinite; }
            `}</style>

            <Footer />
        </div>
    );
}

function Corner({ pos, borders, color }) {
    return (
        <div
            className={`absolute w-8 h-8 ${pos} ${borders}`}
            style={{ borderColor: color, transition: "border-color 0.3s" }}
        />
    );
}
