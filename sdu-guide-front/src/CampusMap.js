import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "./ThemeContext";

/* ── custom pin icon ─────────────────────────────────── */
const makeIcon = (color, letter) =>
    L.divIcon({
        className: "",
        iconSize:   [38, 46],
        iconAnchor: [19, 46],
        popupAnchor:[0, -48],
        html: `
          <div style="
            position:relative; width:38px; height:46px;
            filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
          ">
            <div style="
              width:38px; height:38px; border-radius:50% 50% 50% 0;
              transform:rotate(-45deg); background:${color};
              border:3px solid #fff; display:flex;
              align-items:center; justify-content:center;
            ">
              <span style="
                transform:rotate(45deg); color:#fff;
                font-size:13px; font-weight:700;
                font-family:sans-serif; line-height:1;
              ">${letter}</span>
            </div>
          </div>`,
    });

/* ── SDU campus locations (реальные координаты 2GIS) ── */
const LOCATIONS = [
    {
        id: "campus",
        label: "SDU University",
        sub: "Главный кампус, блоки D – I",
        coords: [43.207176, 76.66967],
        color: "#4C6740",
        letter: "SDU",
        zone: "L",
    },
    {
        id: "dorm",
        label: "Общежитие",
        sub: "Студенческое общежитие",
        coords: [43.207452, 76.668123],
        color: "#B45A00",
        letter: "Dorm",
        zone: "J",
    },
    {
        id: "sdulife",
        label: "SDU Life",
        sub: "Студенческий центр активности",
        coords: [43.20561, 76.668843],
        color: "#008B8B",
        letter: "Life",
        zone: "K",
    },
];

/* maps zone block → location id */
export const ZONE_TO_LOCATION = {
    L: "campus",
    J: "dorm",
    K: "sdulife",
};

/* ── inner controller (imperative flyTo) ─────────────── */
const MapController = forwardRef((_, ref) => {
    const map = useMap();
    useImperativeHandle(ref, () => ({
        flyTo: (coords, zoom = 17) =>
            map.flyTo(coords, zoom, { animate: true, duration: 1.1 }),
    }));
    return null;
});

/* ── main component ──────────────────────────────────── */
const CampusMap = forwardRef(function CampusMap(_, ref) {
    const { darkMode } = useTheme();
    const ctrlRef = useRef(null);

    /* expose flyTo to parent */
    useImperativeHandle(ref, () => ({
        flyToZone: (zone) => {
            const loc = LOCATIONS.find(l => l.zone === zone);
            if (loc && ctrlRef.current) ctrlRef.current.flyTo(loc.coords, 17);
        },
        flyTo: (coords, zoom) => ctrlRef.current?.flyTo(coords, zoom),
    }));

    const tileUrl  = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    return (
        <MapContainer
            center={[43.2068, 76.6690]}
            zoom={16}
            style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
            scrollWheelZoom={false}
            zoomControl={true}
        >
            <TileLayer url={tileUrl} attribution={tileAttr} />
            <MapController ref={ctrlRef} />

            {LOCATIONS.map(loc => (
                <Marker
                    key={loc.id}
                    position={loc.coords}
                    icon={makeIcon(loc.color, loc.letter)}
                >
                    <Popup>
                        <div style={{ fontFamily: "sans-serif", minWidth: 160 }}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                            }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: "50%",
                                    backgroundColor: loc.color, flexShrink: 0,
                                }} />
                                <strong style={{ fontSize: 14 }}>{loc.label}</strong>
                            </div>
                            <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{loc.sub}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
});

export default CampusMap;
