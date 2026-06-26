import { useEffect, useState, type ComponentType } from "react";
import type { Agent } from "@/lib/dummy-data";

export type LeafletMapProps = {
  agents: Agent[];
  focus?: { lat: number; lng: number } | null;
  height?: string | number;
};

export function LeafletMap(props: LeafletMapProps) {
  const [MapComponent, setMapComponent] = useState<ComponentType<LeafletMapProps> | null>(null);

  useEffect(() => {
    void import("./leaflet-map-client").then((mod) => {
      setMapComponent(() => mod.default);
    });
  }, []);

  if (!MapComponent) {
    return null;
  }

  return <MapComponent {...props} />;
}
