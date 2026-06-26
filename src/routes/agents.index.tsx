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

  const filtered = AGENTS

  const cols: Column<Agent>[] = [
    {
      key: "name", header: "Agent Name", sortable: true,
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
    {
      key: "actions", header: "Actions",
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
    <div className="space-y-4 p-4 md:p-6">
      <PageHeader
        title="Agent Management"
        description="Manage and monitor all field agents."
        actions={
          <Button asChild className="gap-2">
            <Link to="/agents/new"><Plus className="h-4 w-4" /> Add Agent</Link>
          </Button>
        }
      />

      <div>
        <CardContent className="p-4">
          <DataTable columns={cols} data={filtered} search={search} searchFields={["name", "employeeId", "email", "phone"]} pageSize={10} />
        </CardContent>
      </div>
    </div>
  );
}