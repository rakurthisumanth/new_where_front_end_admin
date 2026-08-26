import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ClientOnly } from "@/components/common/client-only";
import { LeafletMap } from "@/components/common/leaflet-map";
import { StatusBadge } from "@/components/layout/app-shell";
import { PageLoader } from "@/components/common/empty-state";
import { adminApi } from "@/lib/api";
import type { Agent } from "@/lib/dummy-data";

export const Route = createFileRoute("/tracking")({
  head: () => ({ meta: [{ title: "Live Tracking — FieldTrack" }] }),
  component: LiveTracking,
});

const LEGEND = [
  { color: "#22C55E", label: "On duty (bike)", bike: true },
  { color: "#EF4444", label: "Offline", bike: false },
];

function LiveTracking() {
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("all");
  const [status, setStatus] = useState("all");
  const [focus, setFocus] = useState<Agent | null>(null);
  const tracking = useQuery({
    queryKey: ["tracking"],
    queryFn: adminApi.tracking,
    refetchInterval: 8000,
  });

  const filtered = useMemo(
    () => (tracking.data ?? []).filter(
      (a) =>
        (org === "all" || a.organization === org) &&
        (status === "all" || a.status === status) &&
        (search === "" || a.name.toLowerCase().includes(search.toLowerCase())),
    ),
    [tracking.data, search, org, status],
  );

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 gap-0 md:grid-cols-[360px_1fr]">
      <aside className="flex flex-col overflow-hidden border-r bg-card">
        <div className="space-y-2 border-b p-3">
          {tracking.isFetching ? (
            <p className="px-1 text-xs text-muted-foreground">Updating locations…</p>
          ) : null}
        </div>
        <div className="flex-1 overflow-y-auto">
          {tracking.isLoading || (tracking.isFetching && !tracking.data) ? (
            <PageLoader label="Loading live tracking…" />
          ) : tracking.isError ? (
            <p className="p-4 text-sm text-destructive">
              {(tracking.error as Error).message || "Could not load tracking."}
            </p>
          ) : filtered.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No agents found.</p>
          ) : (
            filtered.map((a) => (
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
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {a.address || "Location updating…"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{a.lastLocationTime}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="relative">
        {tracking.isLoading || (tracking.isFetching && !tracking.data) ? (
          <PageLoader label="Loading map…" />
        ) : (
          <ClientOnly fallback={<div className="h-full w-full animate-pulse bg-muted" />}>
            <LeafletMap agents={filtered} focus={focus ? { lat: focus.lat, lng: focus.lng } : null} height="100%" />
          </ClientOnly>
        )}
        <Card className="absolute bottom-3 left-3 z-[400] w-fit shadow-lg">
          <CardContent className="flex flex-wrap items-center gap-3 p-2.5">
            {LEGEND.map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs">
                {l.bike ? (
                  <span
                    className="grid h-5 w-5 place-items-center rounded-full border-2 border-white shadow"
                    style={{ background: l.color }}
                    title="Bike"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle cx="5.5" cy="17.5" r="2.4" stroke="#fff" strokeWidth="1.8" />
                      <circle cx="18.5" cy="17.5" r="2.4" stroke="#fff" strokeWidth="1.8" />
                      <path d="M5.5 17.5 L10 10.5 L14.5 10.5 L18.5 17.5" stroke="#fff" strokeWidth="1.8" fill="none" />
                      <path d="M10 10.5 L12 7 H15" stroke="#fff" strokeWidth="1.8" />
                    </svg>
                  </span>
                ) : (
                  <span
                    className="h-3 w-3 rounded-full border-2 border-white"
                    style={{ background: l.color }}
                  />
                )}
                {l.label}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}