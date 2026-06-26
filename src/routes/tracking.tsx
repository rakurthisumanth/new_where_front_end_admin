import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Battery, Gauge } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientOnly } from "@/components/common/client-only";
import { LeafletMap } from "@/components/common/leaflet-map";
import { StatusBadge } from "@/components/layout/app-shell";
import { AGENTS, type Agent } from "@/lib/dummy-data";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Live Tracking — FieldTrack" }] }),
  component: LiveTracking,
});

const LEGEND = [
  { color: "#22C55E", label: "Checked In" },
  { color: "#2563EB", label: "Moving" },
  { color: "#F59E0B", label: "Idle" },
  { color: "#EF4444", label: "Offline" },
];

function LiveTracking() {
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("all");
  const [status, setStatus] = useState("all");
  const [focus, setFocus] = useState<Agent | null>(null);

  const filtered = useMemo(
    () => AGENTS.filter(
      (a) =>
        (org === "all" || a.organization === org) &&
        (status === "all" || a.status === status) &&
        (search === "" || a.name.toLowerCase().includes(search.toLowerCase())),
    ),
    [search, org, status],
  );

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 gap-0 md:grid-cols-[360px_1fr]">
      <aside className="flex flex-col overflow-hidden border-r bg-card">
        <div className="space-y-2 border-b p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search agents…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select value={org} onValueChange={setOrg}>
              <SelectTrigger><SelectValue placeholder="Org" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orgs</SelectItem>
                <SelectItem value="MediCorp Pharma">MediCorp</SelectItem>
                <SelectItem value="HealthBridge Ltd">HealthBridge</SelectItem>
                <SelectItem value="ZenoCare">ZenoCare</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="moving">Moving</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((a) => (
            <button
              key={a.id}
              onClick={() => setFocus(a)}
              className={`flex w-full items-start gap-3 border-b px-3 py-3 text-left hover:bg-accent ${focus?.id === a.id ? "bg-accent" : ""}`}
            >
              <Avatar className="h-10 w-10 shrink-0"><AvatarImage src={a.photo} /><AvatarFallback>{a.name[0]}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold">{a.name}</div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Battery className="h-3 w-3" />{a.battery}%</span>
                  <span className="inline-flex items-center gap-1"><Gauge className="h-3 w-3" />{a.speed} km/h</span>
                </div>
                <div className="mt-1 truncate text-xs text-muted-foreground">{a.address}</div>
                <div className="text-[11px] text-muted-foreground">{a.lastLocationTime}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="relative">
        <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
          <LeafletMap agents={filtered} focus={focus ? { lat: focus.lat, lng: focus.lng } : null} height="100%" />
        </ClientOnly>
        <Card className="absolute bottom-3 left-3 z-[400] w-fit shadow-lg">
          <CardContent className="flex flex-wrap items-center gap-3 p-2.5">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs">
                <span className="h-3 w-3 rounded-full border-2 border-white" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}