import { createFileRoute } from "@tanstack/react-router";
import {
  Users, UserCheck, UserX, LogIn, LogOut,
  Hospital, Stethoscope, HeartPulse, TrendingUp, Navigation,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/stat-card";
import { PageHeader } from "@/components/common/page-header";
import { AGENTS, DASHBOARD_STATS } from "@/lib/dummy-data";

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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Dashboard" description="Live overview of field operations across your organization." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Agents" value={s.totalAgents} icon={Users} tone="primary" trend="Across all regions" />
        <StatCard label="Active Agents" value={s.activeAgents} icon={UserCheck} tone="success" trend="Online now" />
        <StatCard label="Inactive" value={s.inactiveAgents} icon={UserX} tone="danger" trend="Offline" />
        <StatCard label="Checked In" value={s.checkedInToday} icon={LogIn} tone="info" trend="Today" />
        <StatCard label="Checked Out" value={s.checkedOutToday} icon={LogOut} tone="warning" trend="Today" />
      </div>

      <Card className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/25">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.16),transparent_16%)]" />
        <div className="absolute -left-10 top-20 h-3 w-40 rounded-full bg-sky-400/20 blur-2xl" />
        <div className="absolute right-8 bottom-16 h-3 w-28 rounded-full bg-fuchsia-400/20 blur-2xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.28em] text-sky-300/80">Employee Tracking</p>
            <h2 className="text-3xl font-semibold text-white">Track your field team visually</h2>
            <p className="max-w-2xl text-slate-300">
              A clean visual preview card designed like a tracker dashboard — no tables, only modern route styling, map-inspired glow, and location highlights.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100">Live routes</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100">Location pulse</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100">Signal overlays</span>
            </div>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.16),transparent_24%)]" />
            <div className="relative grid h-full w-full gap-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
                  <Navigation className="h-4 w-4 text-sky-300" />
                  Route mode
                </div>
                <div className="rounded-full bg-slate-950/90 px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">Live</div>
              </div>

              <div className="relative h-52 overflow-hidden rounded-[1.5rem] bg-slate-950/80 p-4 text-slate-400">
                <div className="absolute -left-10 top-8 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="absolute right-6 top-16 h-16 w-16 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <div className="absolute left-8 bottom-10 h-3 w-32 rounded-full bg-gradient-to-r from-sky-400/40 to-transparent" />
                <div className="absolute right-10 top-24 h-3 w-20 rounded-full bg-gradient-to-l from-fuchsia-400/40 to-transparent" />
                <div className="absolute left-16 top-28 h-3 w-28 rounded-full bg-gradient-to-r from-slate-200/30 to-transparent" />
                <div className="absolute left-12 top-10 h-4 w-4 rounded-full bg-sky-400 shadow-sky-400/40" />
                <div className="absolute right-16 top-20 h-4 w-4 rounded-full bg-fuchsia-400 shadow-fuchsia-400/40" />
                <div className="absolute left-24 bottom-14 h-4 w-4 rounded-full bg-cyan-300 shadow-cyan-300/40" />
                <div className="absolute inset-x-4 bottom-24 h-0.5 bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />
                <div className="absolute inset-x-12 top-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
                <div className="absolute right-8 bottom-8 rounded-3xl border border-white/10 bg-slate-950/90 px-3 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
                  Map preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
