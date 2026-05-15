import { useState, useCallback } from "react";

const KEY = "sdu-favorite-rooms";

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    });

    const toggle = useCallback((roomId) => {
        setFavorites(prev => {
            const next = prev.includes(roomId)
                ? prev.filter(r => r !== roomId)
                : [...prev, roomId];
            localStorage.setItem(KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const isFavorite = useCallback((roomId) => favorites.includes(roomId), [favorites]);

    return { favorites, toggle, isFavorite };
}
