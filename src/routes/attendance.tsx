import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, Activity, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";

export const Route = createFileRoute("/attendance")({
  head: () => ({ meta: [{ title: "Attendance — FieldTrack" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const status = (d: number) => (d % 7 === 0 ? "off" : d % 11 === 0 ? "absent" : d % 9 === 0 ? "late" : "present");
  const colors: Record<string, string> = {
    present: "bg-success/15 text-success border-success/30",
    late: "bg-warning/15 text-warning border-warning/30",
    absent: "bg-destructive/15 text-destructive border-destructive/30",
    off: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Attendance" description="Monthly attendance overview." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Present" value={22} icon={CalendarCheck} tone="success" />
        <StatCard label="Late Marks" value={3} icon={Clock} tone="warning" />
        <StatCard label="Absent" value={1} icon={UserX} tone="danger" />
        <StatCard label="Avg Working Hours" value="8h 42m" icon={Activity} tone="info" />
      </div>
      <Card>
        <CardHeader><CardTitle>June 2026</CardTitle></CardHeader>
        <CardContent>
          <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const s = status(d);
              return (
                <div key={d} className={`flex h-20 flex-col items-center justify-center rounded-md border text-sm ${colors[s]}`}>
                  <div className="font-semibold">{d}</div>
                  <div className="text-[10px] capitalize">{s}</div>
                  {s === "present" && <div className="text-[10px]">09:12 → 18:04</div>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}