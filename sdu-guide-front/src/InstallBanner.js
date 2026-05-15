import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

const GREEN = "#4C6740";

export default function InstallBanner() {
    const [prompt, setPrompt]   = useState(null);
    const [visible, setVisible] = useState(false);
    const [done,    setDone]    = useState(false);

    useEffect(() => {
        // Не показываем если уже установлено
        if (window.matchMedia("(display-mode: standalone)").matches) return;
        if (sessionStorage.getItem("pwa-dismissed")) return;

        const handler = (e) => {
            e.preventDefault();
            setPrompt(e);
            setVisible(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const install = async () => {
        if (!prompt) return;
        prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === "accepted") setDone(true);
        setVisible(false);
    };

    const dismiss = () => {
        sessionStorage.setItem("pwa-dismissed", "1");
        setVisible(false);
    };

    if (!visible || done) return null;

    return (
        <div
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[340px] z-50 rounded-2xl shadow-2xl p-4 flex items-center gap-4"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
        >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ backgroundColor: GREEN }}>
                <Smartphone size={24} color="#fff" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="font-[Cormorant] text-white text-[18px] leading-tight">
                    SDU Campus Guide
                </p>
                <p className="font-sans text-[12px] text-gray-400 mt-0.5">
                    Установите как приложение на телефон
                </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    onClick={install}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-[13px] font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: GREEN }}>
                    <Download size={14} />
                    Установить
                </button>
                <button
                    onClick={dismiss}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
