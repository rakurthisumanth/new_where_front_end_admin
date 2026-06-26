import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, FileSpreadsheet, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { TRAVEL_REPORTS } from "@/lib/dummy-data";
import { toast } from "sonner";

export const Route = createFileRoute("/travel")({
  head: () => ({ meta: [{ title: "Travel Report — FieldTrack" }] }),
  component: TravelPage,
});

function TravelPage() {
  const [search, setSearch] = useState("");
  type Row = typeof TRAVEL_REPORTS[number];
  const cols: Column<Row>[] = [
    { key: "agent", header: "Employee", sortable: true },
    { key: "date", header: "Date", sortable: true },
    { key: "checkIn", header: "Check In" },
    { key: "checkOut", header: "Check Out" },
    { key: "distance", header: "Distance", sortable: true, render: (r) => `${r.distance} km` },
    { key: "travelTime", header: "Travel Time" },
    { key: "hospitals", header: "Hospitals" },
    { key: "doctors", header: "Doctors" },
    { key: "patients", header: "Patients" },
    { key: "avgSpeed", header: "Avg Speed", render: (r) => `${r.avgSpeed} km/h` },
    { key: "stops", header: "Stops" },
    {
      key: "actions", header: "",
      render: () => <Button size="sm" variant="ghost"><Eye className="mr-1 h-4 w-4" />View</Button>,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Travel Report"
        description="Detailed travel analytics for every field agent."
        actions={
          <>
            <Button variant="outline" onClick={() => toast.success("PDF export started")}><Download className="mr-2 h-4 w-4" />Export PDF</Button>
            <Button variant="outline" onClick={() => toast.success("Excel export started")}><FileSpreadsheet className="mr-2 h-4 w-4" />Export Excel</Button>
            <Button>Generate Report</Button>
          </>
        }
      />

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">From Date</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">To Date</label><Input type="date" /></div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Organization</label>
            <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Manager</label>
            <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Department</label>
            <Select><SelectTrigger><SelectValue placeholder="All" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Search Agent</label>
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card><CardContent className="p-4"><DataTable data={TRAVEL_REPORTS} columns={cols} search={search} searchFields={["agent", "employeeId"]} pageSize={10} /></CardContent></Card>
    </div>
  );
}