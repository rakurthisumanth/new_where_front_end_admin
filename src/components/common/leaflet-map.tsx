import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import type { Agent } from "@/lib/dummy-data";

const colorIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const STATUS_COLOR: Record<string, string> = {
  checked_in: "#22C55E",
  moving: "#2563EB",
  idle: "#F59E0B",
  offline: "#EF4444",
};

function FlyTo({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lng != null) map.flyTo([lat, lng], 12, { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

export function LeafletMap({
  agents,
  focus,
  height = "100%",
}: {
  agents: Agent[];
  focus?: { lat: number; lng: number } | null;
  height?: string | number;
}) {
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
        <Marker key={a.id} position={[a.lat, a.lng]} icon={colorIcon(STATUS_COLOR[a.status] ?? "#888")}>
          <Popup>
            <div className="space-y-1 text-xs">
              <div className="text-sm font-semibold">{a.name}</div>
              <div>📞 {a.phone}</div>
              <div>🛣 Today: {a.distanceToday} km</div>
              <div>⚡ Speed: {a.speed} km/h</div>
              <div>🔋 Battery: {a.battery}%</div>
              <div>📍 {a.address}</div>
              <div className="text-muted-foreground">⏱ {a.lastLocationTime}</div>
              <button className="mt-1 rounded bg-blue-600 px-2 py-1 text-white">Navigate</button>
            </div>
          </Popup>
        </Marker>
      ))}
      <FlyTo lat={focus?.lat ?? null} lng={focus?.lng ?? null} />
    </MapContainer>
  );
}