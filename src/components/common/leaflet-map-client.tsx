import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Agent } from "@/lib/dummy-data";

const STATUS_COLOR: Record<string, string> = {
  checked_in: "#22C55E",
  moving: "#2563EB",
  idle: "#F59E0B",
  offline: "#EF4444",
};

/** Dot marker for idle / offline. */
const colorIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

/**
 * Bike marker for on-duty agents. Rotates by heading so travel direction is visible.
 * SVG faces "up" (north); Leaflet rotation uses degrees clockwise from north.
 */
const bikeIcon = (color: string, heading = 0, pulse = false) => {
  const rotation = Number.isFinite(heading) ? heading : 0;
  const pulseRing = pulse
    ? `<span style="position:absolute;inset:-6px;border-radius:50%;border:2px solid ${color};opacity:0.45;animation:ft-pulse 1.4s ease-out infinite"></span>`
    : "";
  return L.divIcon({
    className: "fieldtrack-bike-marker",
    html: `
      <div style="position:relative;width:40px;height:40px;display:grid;place-items:center">
        ${pulseRing}
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:${color};
          border:2px solid #fff;
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          display:grid;place-items:center;
          transform:rotate(${rotation}deg);
        ">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="5.5" cy="17.5" r="2.6" stroke="#fff" stroke-width="1.8"/>
            <circle cx="18.5" cy="17.5" r="2.6" stroke="#fff" stroke-width="1.8"/>
            <path d="M5.5 17.5 L10 10.5 L14.5 10.5 L18.5 17.5" stroke="#fff" stroke-width="1.8" stroke-linejoin="round" fill="none"/>
            <path d="M10 10.5 L12 7 H15" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="1.2" fill="#fff"/>
          </svg>
        </div>
      </div>
      <style>
        @keyframes ft-pulse {
          0% { transform: scale(0.85); opacity: 0.55; }
          100% { transform: scale(1.45); opacity: 0; }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -18],
  });
};

function markerIcon(agent: Agent) {
  const color = STATUS_COLOR[agent.status] ?? "#888";
  const onDuty = agent.status === "checked_in" || agent.status === "moving";
  if (!onDuty) return colorIcon(color);
  const heading = Number((agent as Agent & { heading?: number }).heading ?? 0);
  return bikeIcon(color, heading, agent.status === "moving");
}

function FlyTo({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (lat != null && lng != null) map.flyTo([lat, lng], 15, { duration: 0.8 });
  }, [lat, lng, map]);

  return null;
}

export type LeafletMapProps = {
  agents: Agent[];
  focus?: { lat: number; lng: number } | null;
  height?: string | number;
};

export default function LeafletMapClient({ agents, focus, height = "100%" }: LeafletMapProps) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      scrollWheelZoom
      style={{ height, width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {agents.map((a) => (
        <Marker key={a.id} position={[a.lat, a.lng]} icon={markerIcon(a)}>
          <Popup>
            <div className="space-y-1 text-xs">
              <div className="text-sm font-semibold">{a.name}</div>
              <div>📞 {a.phone}</div>
              <div>🛣 Today: {Number(a.distanceToday || 0).toFixed(1)} km</div>
              <div>📍 {a.address || "Location updating…"}</div>
              <div className="text-muted-foreground">⏱ {a.lastLocationTime}</div>
            </div>
          </Popup>
        </Marker>
      ))}
      <FlyTo lat={focus?.lat ?? null} lng={focus?.lng ?? null} />
    </MapContainer>
  );
}
