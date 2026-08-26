import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/common/page-header";
import { DataTable, type Column } from "@/components/common/data-table";
import { PageLoader } from "@/components/common/empty-state";
import type { Agent } from "@/lib/dummy-data";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/agents/")({
  head: () => ({ meta: [{ title: "Agent Management — FieldTrack" }] }),
  component: AgentsPage,
});

function formatJoinDate(value?: string) {
  if (!value) return "—";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const [y, m, d] = value.slice(0, 10).split("-");
    return `${d}-${m}-${y}`;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB");
}

function AgentsPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const agents = useQuery({ queryKey: ["employees"], queryFn: adminApi.employees });
  const remove = useMutation({
    mutationFn: adminApi.deleteEmployee,
    onSuccess: () => {
      toast.success("Agent deleted");
      void queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filtered = agents.data ?? [];

  const cols: Column<Agent>[] = [
    {
      key: "name",
      header: "Agent Name",
      sortable: true,
      render: (a) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={a.photo} />
            <AvatarFallback>{a.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{a.name}</div>
            <div className="truncate text-xs text-muted-foreground">{a.phone}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Mobile" },
    {
      key: "joiningDate",
      header: "Date of Join",
      sortable: true,
      render: (a) => formatJoinDate(a.joiningDate),
    },
    {
      key: "city",
      header: "City",
      sortable: true,
      render: (a) => a.city || "—",
    },
    {
      key: "actions",
      header: "Actions",
      render: (a) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/agents/$id" params={{ id: a.id }}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => remove.mutate(a.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
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
            <Link to="/agents/new">
              <Plus className="h-4 w-4" /> Add Agent
            </Link>
          </Button>
        }
      />

      <div>
        <CardContent className="p-4">
          {agents.isLoading || (agents.isFetching && !agents.data) ? (
            <PageLoader label="Loading agents…" />
          ) : agents.isError ? (
            <p className="py-10 text-center text-sm text-destructive">
              {(agents.error as Error).message || "Could not load agents."}
            </p>
          ) : (
            <DataTable
              columns={cols}
              data={filtered}
              search={search}
              searchFields={["name", "phone", "city", "joiningDate"]}
              pageSize={10}
            />
          )}
        </CardContent>
      </div>
    </div>
  );
}
