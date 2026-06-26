import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — FieldTrack" }] }),
  component: Reports,
});

const TYPES = [
  { title: "Daily Report", desc: "Today's field activities, visits, attendance." },
  { title: "Weekly Report", desc: "Last 7 days performance summary." },
  { title: "Monthly Report", desc: "Complete monthly analytics & KPIs." },
  { title: "Custom Range", desc: "Build a report for any date range." },
];

function Reports() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Reports" description="Generate and download operational reports." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {TYPES.map((t) => (
          <Card key={t.title} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
              <CardTitle className="mt-2 text-base">{t.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{t.desc}</p>
              <div className="flex flex-wrap gap-2">
                {["PDF", "Excel", "CSV"].map((fmt) => (
                  <Button key={fmt} size="sm" variant="outline" onClick={() => toast.success(`Generating ${t.title} (${fmt})…`)}>
                    <Download className="mr-1 h-3 w-3" />{fmt}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Custom Report</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1"><label className="text-xs text-muted-foreground">From</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">To</label><Input type="date" /></div>
          <div className="space-y-1"><label className="text-xs text-muted-foreground">Format</label>
            <Input list="formats" placeholder="PDF" /><datalist id="formats"><option value="PDF" /><option value="Excel" /><option value="CSV" /></datalist>
          </div>
          <div className="flex items-end"><Button className="w-full" onClick={() => toast.success("Report queued")}>Generate</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}