import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, Inbox } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  columns, data, pageSize = 8, search = "", searchFields,
}: {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  search?: string;
  searchFields?: (keyof T)[];
}) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const filtered = useMemo(() => {
    let out = data;
    if (search && searchFields) {
      const q = search.toLowerCase();
      out = out.filter((r) => searchFields.some((f) => String(r[f] ?? "").toLowerCase().includes(q)));
    }
    if (sort) {
      out = [...out].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sort.key];
        const bv = (b as Record<string, unknown>)[sort.key];
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av < bv) return sort.dir === "asc" ? -1 : 1;
        if (av > bv) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
    return out;
  }, [data, search, searchFields, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (filtered.length === 0) {
    return <EmptyState icon={Inbox} title="No records found" description="Try changing filters or search query." />;
  }

  const toggleSort = (key: string) => {
    setSort((s) => (s?.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={String(c.key)} className={c.className}>
                  {c.sortable ? (
                    <button
                      className="inline-flex items-center gap-1 font-semibold hover:text-primary"
                      onClick={() => toggleSort(String(c.key))}
                    >
                      {c.header} <ArrowUpDown className="h-3 w-3 opacity-50" />
                    </button>
                  ) : c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/40">
                {columns.map((c) => (
                  <TableCell key={String(c.key)} className={c.className}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[String(c.key)] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">Page {page} / {totalPages}</span>
          <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}