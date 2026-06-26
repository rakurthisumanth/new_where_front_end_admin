import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/layout/app-shell";
import { HOSPITAL_VISITS } from "@/lib/dummy-data";

export const Route = createFileRoute("/hospitals")({
  head: () => ({ meta: [{ title: "Hospital Visits — FieldTrack" }] }),
  component: () => {
    const [search, setSearch] = useState("");
    type R = typeof HOSPITAL_VISITS[number];
    const cols: Column<R>[] = [
      { key: "hospital", header: "Hospital", sortable: true },
      { key: "type", header: "Type" },
      { key: "address", header: "Address" },
      { key: "checkIn", header: "Check-in" },
      { key: "checkOut", header: "Check-out" },
      { key: "duration", header: "Duration" },
      { key: "gpsVerified", header: "GPS Verified", render: (r) => <StatusBadge status={r.gpsVerified ? "present" : "absent"} /> },
      { key: "photos", header: "Photos", render: (r) => `${r.photos}` },
      { key: "actions", header: "", render: () => <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button> },
    ];
    return (
      <div className="space-y-6 p-4 md:p-6">
        <PageHeader title="Hospital Visits" description="All hospital visits logged by field agents." />
        <Card><CardContent className="grid gap-3 p-4 md:grid-cols-3">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">From Date</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">To Date</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Search Hospital</label><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" /></div>
        </CardContent></Card>
        <Card><CardContent className="p-4"><DataTable data={HOSPITAL_VISITS} columns={cols} search={search} searchFields={["hospital", "address"]} /></CardContent></Card>
      </div>
    );
  },
});