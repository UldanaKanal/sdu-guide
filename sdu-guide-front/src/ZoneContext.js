import React, { createContext, useContext, useState } from "react";

const ZoneContext = createContext();

export function useZone() {
    return useContext(ZoneContext);
}

export function ZoneProvider({ children }) {
    const [activeZone, setActiveZone] = useState(null);

    return (
        <ZoneContext.Provider value={{ activeZone, setActiveZone }}>
            {children}
        </ZoneContext.Provider>
    );
}
