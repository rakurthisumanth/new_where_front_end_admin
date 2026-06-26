import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { PATIENTS } from "@/lib/dummy-data";

export const Route = createFileRoute("/patients")({
  head: () => ({ meta: [{ title: "Patients — FieldTrack" }] }),
  component: () => {
    const [search, setSearch] = useState("");
    type R = typeof PATIENTS[number];
    const cols: Column<R>[] = [
      { key: "name", header: "Patient", sortable: true },
      { key: "age", header: "Age" },
      { key: "gender", header: "Gender" },
      { key: "disease", header: "Disease" },
      { key: "doctor", header: "Doctor" },
      { key: "hospital", header: "Hospital" },
      { key: "visitDate", header: "Visit Date", sortable: true },
      { key: "prescriptionUploaded", header: "Rx", render: (r) => r.prescriptionUploaded ? <Badge className="bg-success/15 text-success">Uploaded</Badge> : <Badge variant="outline">Pending</Badge> },
      { key: "status", header: "Status" },
    ];
    return (
      <div className="space-y-6 p-4 md:p-6">
        <PageHeader title="Patients" description="Patient coverage and prescription tracking." />
        <Card><CardContent className="grid gap-3 p-4 md:grid-cols-4">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">From Date</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">To Date</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Hospital</label><Input placeholder="Search…" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Doctor</label><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" /></div>
        </CardContent></Card>
        <Card><CardContent className="p-4"><DataTable data={PATIENTS} columns={cols} search={search} searchFields={["name", "doctor", "hospital", "disease"]} /></CardContent></Card>
      </div>
    );
  },
});