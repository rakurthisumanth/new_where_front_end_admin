import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { DOCTORS } from "@/lib/dummy-data";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [{ title: "Doctors — FieldTrack" }] }),
  component: () => {
    const [search, setSearch] = useState("");
    type R = typeof DOCTORS[number];
    const cols: Column<R>[] = [
      { key: "name", header: "Doctor Name", sortable: true },
      { key: "specialization", header: "Specialization" },
      { key: "phone", header: "Phone" },
      { key: "hospital", header: "Hospital" },
      { key: "meetingDate", header: "Meeting Date", sortable: true },
      { key: "duration", header: "Duration" },
      { key: "remarks", header: "Remarks" },
      { key: "nextFollowup", header: "Next Follow-up" },
    ];
    return (
      <div className="space-y-6 p-4 md:p-6">
        <PageHeader title="Doctors" description="Doctor meetings tracked by your field force." />
        <Card><CardContent className="grid gap-3 p-4 md:grid-cols-4">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">From Date</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">To Date</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Doctor</label><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctor…" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Hospital</label><Input placeholder="Search hospital…" /></div>
        </CardContent></Card>
        <Card><CardContent className="p-4"><DataTable data={DOCTORS} columns={cols} search={search} searchFields={["name", "specialization", "hospital"]} /></CardContent></Card>
      </div>
    );
  },
});