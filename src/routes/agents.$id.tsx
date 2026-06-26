import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Navigation, Hospital, Stethoscope, HeartPulse, CalendarCheck, Activity, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { DataTable, type Column } from "@/components/common/data-table";
import { LeafletMap } from "@/components/common/leaflet-map";
import { ClientOnly } from "@/components/common/client-only";
import { StatusBadge } from "@/components/layout/app-shell";
import { AGENTS, HOSPITAL_VISITS, DOCTORS, PATIENTS } from "@/lib/dummy-data";

export const Route = createFileRoute("/agents/$id")({
  loader: ({ params }) => {
    const agent = AGENTS.find((a) => a.id === params.id);
    if (!agent) throw notFound();
    return { agent };
  },
  component: AgentDetailPage,
  notFoundComponent: () => (
    <div className="p-8"><p>Agent not found.</p><Link to="/agents" className="text-primary underline">Back</Link></div>
  ),
});

function AgentDetailPage() {
  const { agent } = Route.useLoaderData();
  const [tab, setTab] = useState("overview");

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title={agent.name}
        description={`${agent.designation} • ${agent.employeeId}`}
        actions={<Button variant="ghost" asChild><Link to="/agents"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>}
      />

      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20"><AvatarImage src={agent.photo} /><AvatarFallback>{agent.name[0]}</AvatarFallback></Avatar>
          <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Manager" value={agent.manager} />
            <Info label="Department" value={agent.department} />
            <Info label="Region" value={agent.region} />
            <Info label="Joining Date" value={agent.joiningDate} />
            <Info label="Email" value={agent.email} />
            <Info label="Phone" value={agent.phone} />
            <Info label="City" value={agent.city} />
            <Info label="Status" value={<StatusBadge status={agent.status} />} />
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex w-full flex-wrap justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="travel">Travel</TabsTrigger>
          <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Today's Distance" value={`${agent.distanceToday} km`} icon={Navigation} tone="primary" />
            <StatCard label="Attendance" value={agent.attendance} icon={CalendarCheck} tone="success" />
            <StatCard label="Hospitals Covered" value={6} icon={Hospital} tone="info" />
            <StatCard label="Doctors Met" value={9} icon={Stethoscope} tone="success" />
            <StatCard label="Patients Covered" value={14} icon={HeartPulse} tone="warning" />
            <StatCard label="Current Speed" value={`${agent.speed} km/h`} icon={Activity} tone="primary" />
            <StatCard label="Battery" value={`${agent.battery}%`} icon={Activity} tone="warning" />
            <StatCard label="Last Updated" value={agent.lastLocationTime} icon={Clock} tone="info" />
          </div>
        </TabsContent>

        <TabsContent value="travel" className="mt-4 space-y-4">
          <Card>
            <CardContent className="grid gap-3 p-4 md:grid-cols-4">
              <div className="space-y-1"><label className="text-xs text-muted-foreground">From</label><Input type="date" /></div>
              <div className="space-y-1"><label className="text-xs text-muted-foreground">To</label><Input type="date" /></div>
              <div className="flex items-end"><Button className="w-full">Show Route</Button></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="h-[360px] p-3">
              <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-xl bg-muted" />}>
                <LeafletMap agents={[agent]} focus={{ lat: agent.lat, lng: agent.lng }} />
              </ClientOnly>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Start Time" value="09:12" icon={Clock} />
            <StatCard label="End Time" value="18:04" icon={Clock} />
            <StatCard label="Distance" value={`${agent.distanceToday} km`} icon={Navigation} tone="info" />
            <StatCard label="Avg Speed" value="32 km/h" icon={Activity} tone="success" />
            <StatCard label="Max Speed" value="78 km/h" icon={Activity} tone="warning" />
            <StatCard label="Total Stops" value={6} icon={MapPin} tone="info" />
            <StatCard label="Travel Duration" value="7h 22m" icon={Clock} tone="primary" />
          </div>
        </TabsContent>

        <TabsContent value="hospitals" className="mt-4">
          <Card><CardContent className="p-4">
            <DataTable
              data={HOSPITAL_VISITS}
              columns={[
                { key: "hospital", header: "Hospital", sortable: true },
                { key: "type", header: "Type" },
                { key: "address", header: "Address" },
                { key: "checkIn", header: "Check-in" },
                { key: "checkOut", header: "Check-out" },
                { key: "duration", header: "Duration" },
                { key: "gpsVerified", header: "GPS", render: (r) => <StatusBadge status={r.gpsVerified ? "present" : "absent"} /> },
                { key: "photos", header: "Photos", render: (r) => `${r.photos} photo${r.photos === 1 ? "" : "s"}` },
              ] as Column<typeof HOSPITAL_VISITS[number]>[]}
            />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="doctors" className="mt-4">
          <Card><CardContent className="p-4">
            <DataTable
              data={DOCTORS}
              columns={[
                { key: "name", header: "Doctor", sortable: true },
                { key: "specialization", header: "Specialization" },
                { key: "phone", header: "Phone" },
                { key: "hospital", header: "Hospital" },
                { key: "meetingDate", header: "Meeting" },
                { key: "duration", header: "Duration" },
                { key: "remarks", header: "Remarks" },
                { key: "nextFollowup", header: "Next Follow-up" },
              ] as Column<typeof DOCTORS[number]>[]}
            />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="patients" className="mt-4">
          <Card><CardContent className="p-4">
            <DataTable
              data={PATIENTS}
              columns={[
                { key: "name", header: "Patient", sortable: true },
                { key: "age", header: "Age" },
                { key: "gender", header: "Gender" },
                { key: "disease", header: "Disease" },
                { key: "doctor", header: "Doctor" },
                { key: "hospital", header: "Hospital" },
                { key: "visitDate", header: "Visit Date" },
                { key: "prescriptionUploaded", header: "Rx", render: (r) => r.prescriptionUploaded ? "✓" : "—" },
                { key: "status", header: "Status" },
              ] as Column<typeof PATIENTS[number]>[]}
            />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <AttendanceCalendar />
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card><CardContent className="p-6">
            <ol className="relative space-y-5 border-l-2 border-border pl-5">
              {["Checked in at 09:12", "Visited Apollo Hospital", "Met Dr. Mehta — Cardiology", "Patient consult — Hypertension", "Visited Fortis Healthcare", "Checked out at 18:04"].map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-primary" />
                  <div className="text-sm font-medium">{t}</div>
                  <div className="text-xs text-muted-foreground">2 hr ago</div>
                </li>
              ))}
            </ol>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function AttendanceCalendar() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const status = (d: number) => (d % 7 === 0 ? "off" : d % 11 === 0 ? "absent" : d % 9 === 0 ? "late" : "present");
  const colors: Record<string, string> = {
    present: "bg-success/15 text-success border-success/30",
    late: "bg-warning/15 text-warning border-warning/30",
    absent: "bg-destructive/15 text-destructive border-destructive/30",
    off: "bg-muted text-muted-foreground border-border",
  };
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <Card className="lg:col-span-3">
        <CardHeader><CardTitle>June 2026</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {days.map((d) => {
              const s = status(d);
              return (
                <div key={d} className={`flex h-16 flex-col items-center justify-center rounded-md border text-sm ${colors[s]}`}>
                  <div className="font-semibold">{d}</div>
                  <div className="text-[10px] capitalize">{s}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-4">
        <StatCard label="Present" value={22} icon={CalendarCheck} tone="success" />
        <StatCard label="Late Marks" value={3} icon={Clock} tone="warning" />
        <StatCard label="Absent" value={1} icon={Activity} tone="danger" />
        <StatCard label="Avg Hours" value="8h 42m" icon={Clock} tone="info" />
      </div>
    </div>
  );
}