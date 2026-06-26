import { createFileRoute } from "@tanstack/react-router";
import {
  Users, UserCheck, UserX, LogIn, LogOut, Navigation,
  Hospital, Stethoscope, HeartPulse, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/stat-card";
import { PageHeader } from "@/components/common/page-header";
import { ClientOnly } from "@/components/common/client-only";
import { LeafletMap } from "@/components/common/leaflet-map";
import { StatusBadge } from "@/components/layout/app-shell";
import {
  AGENTS, DASHBOARD_STATS, ATTENDANCE_CHART, RECENT_ACTIVITIES,
} from "@/lib/dummy-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FieldTrack" },
      { name: "description", content: "Realtime employee field tracking dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const s = DASHBOARD_STATS;
  const top = [...AGENTS].sort((a, b) => b.distanceToday - a.distanceToday).slice(0, 5);
  const recentCheckins = AGENTS.filter((a) => a.attendance === "present").slice(0, 6);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Dashboard" description="Live overview of field operations across your organization." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Agents" value={s.totalAgents} icon={Users} tone="primary" trend="Across all regions" />
        <StatCard label="Active Agents" value={s.activeAgents} icon={UserCheck} tone="success" trend="Online now" />
        <StatCard label="Inactive" value={s.inactiveAgents} icon={UserX} tone="danger" trend="Offline" />
        <StatCard label="Checked In" value={s.checkedInToday} icon={LogIn} tone="info" trend="Today" />
        <StatCard label="Checked Out" value={s.checkedOutToday} icon={LogOut} tone="warning" trend="Today" />
        <StatCard label="Distance Today" value={`${s.distanceToday} km`} icon={Navigation} tone="primary" trend="All agents combined" />
        <StatCard label="Hospitals Visited" value={s.hospitalsVisited} icon={Hospital} tone="info" trend="Today" />
        <StatCard label="Doctors Met" value={s.doctorsMet} icon={Stethoscope} tone="success" trend="Today" />
        <StatCard label="Patients Covered" value={s.patientsCovered} icon={HeartPulse} tone="warning" trend="Today" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Live Agent Map</CardTitle>
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">Live</Badge>
          </CardHeader>
          <CardContent className="h-[380px] p-3 pt-0">
            <ClientOnly fallback={<div className="h-full w-full animate-pulse rounded-xl bg-muted" />}>
              <LeafletMap agents={AGENTS} />
            </ClientOnly>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent className="h-[380px] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_CHART}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hour" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Performing Agents</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent className="space-y-3">
            {top.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</div>
                <Avatar className="h-9 w-9"><AvatarImage src={a.photo} /><AvatarFallback>{a.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{a.region} • {a.designation}</div>
                </div>
                <div className="text-sm font-semibold">{a.distanceToday} km</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Check-ins</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentCheckins.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarImage src={a.photo} /><AvatarFallback>{a.name[0]}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{a.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{a.address}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l border-border pl-5">
              {RECENT_ACTIVITIES.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[26px] grid h-4 w-4 place-items-center rounded-full border-2 border-background bg-primary" />
                  <div className="text-sm"><span className="font-semibold">{a.agent}</span> {a.action}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
