import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Eye, Pencil, Ban, Trash2, UserCog, MoreHorizontal, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { StatusBadge } from "@/components/layout/app-shell";
import { AGENTS, type Agent } from "@/lib/dummy-data";

export const Route = createFileRoute("/agents/")({
  head: () => ({ meta: [{ title: "Agent Management — FieldTrack" }] }),
  component: AgentsPage,
});

function AgentsPage() {
  const [search, setSearch] = useState("");
  const [org, setOrg] = useState("all");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [dept, setDept] = useState("all");

  const filtered = AGENTS.filter((a) =>
    (org === "all" || a.organization === org) &&
    (region === "all" || a.region === region) &&
    (status === "all" || a.status === status) &&
    (dept === "all" || a.department === dept),
  );

  const cols: Column<Agent>[] = [
    {
      key: "name", header: "Agent", sortable: true,
      render: (a) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarImage src={a.photo} /><AvatarFallback>{a.name[0]}</AvatarFallback></Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{a.name}</div>
            <div className="truncate text-xs text-muted-foreground">{a.employeeId}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Mobile" },
    { key: "email", header: "Email", render: (a) => <span className="text-xs">{a.email}</span> },
    { key: "designation", header: "Designation", sortable: true },
    { key: "manager", header: "Manager" },
    { key: "region", header: "Region", sortable: true },
    { key: "status", header: "Status", render: (a) => <StatusBadge status={a.status} /> },
    { key: "lastLocationTime", header: "Last Location" },
    {
      key: "battery", header: "Battery",
      render: (a) => (
        <div className="flex items-center gap-1.5">
          <Battery className={`h-4 w-4 ${a.battery < 20 ? "text-destructive" : a.battery < 50 ? "text-warning" : "text-success"}`} />
          <span className="text-xs">{a.battery}%</span>
        </div>
      ),
    },
    { key: "distanceToday", header: "Distance", sortable: true, render: (a) => <span>{a.distanceToday} km</span> },
    { key: "attendance", header: "Attendance", render: (a) => <StatusBadge status={a.attendance} /> },
    {
      key: "actions", header: "",
      render: (a) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild><Link to="/agents/$id" params={{ id: a.id }}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem>
            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuItem><UserCog className="mr-2 h-4 w-4" />Assign Manager</DropdownMenuItem>
            <DropdownMenuItem><Ban className="mr-2 h-4 w-4" />Disable</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Agent Management"
        description="Manage and monitor all field agents."
        actions={
          <Button asChild className="gap-2">
            <Link to="/agents/new"><Plus className="h-4 w-4" /> Add Agent</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents…" className="pl-9" />
            </div>
            <Select value={org} onValueChange={setOrg}>
              <SelectTrigger><SelectValue placeholder="Organization" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                <SelectItem value="MediCorp Pharma">MediCorp Pharma</SelectItem>
                <SelectItem value="HealthBridge Ltd">HealthBridge Ltd</SelectItem>
                <SelectItem value="ZenoCare">ZenoCare</SelectItem>
              </SelectContent>
            </Select>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue placeholder="Region" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {["North", "South", "East", "West", "Central"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={dept} onValueChange={setDept}>
              <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {["Sales", "Marketing", "Field Ops", "Medical"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {["checked_in", "moving", "idle", "offline"].map((r) => <SelectItem key={r} value={r}>{r.replace("_", " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <DataTable columns={cols} data={filtered} search={search} searchFields={["name", "employeeId", "email", "phone"]} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}