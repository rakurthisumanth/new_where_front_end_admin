import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AGENTS, MONTHLY_DISTANCE, WEEKLY_ACTIVITY } from "@/lib/dummy-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — FieldTrack" }] }),
  component: Analytics,
});

const PIE = ["#2563EB", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

function Analytics() {
  const top = [...AGENTS].sort((a, b) => b.distanceToday - a.distanceToday).slice(0, 6);
  const pieData = ["North", "South", "East", "West", "Central"].map((r) => ({
    name: r, value: AGENTS.filter((a) => a.region === r).length,
  }));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Analytics" description="Performance trends and insights." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Distance (km)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DISTANCE}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563EB" stopOpacity={0.5} /><stop offset="100%" stopColor="#2563EB" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip />
                <Area type="monotone" dataKey="distance" stroke="#2563EB" fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Weekly Activity</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="visits" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="meetings" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hospital & Doctor Visits</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_DISTANCE.map((m, i) => ({ ...m, hospitals: 30 + i * 8, doctors: 25 + i * 6 }))}>
                <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />
                <Line type="monotone" dataKey="hospitals" stroke="#2563EB" strokeWidth={2} />
                <Line type="monotone" dataKey="doctors" stroke="#22C55E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Region Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Top Agents</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {top.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</div>
                  <Avatar className="h-10 w-10"><AvatarImage src={a.photo} /><AvatarFallback>{a.name[0]}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{a.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{a.region} • {a.distanceToday} km</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}