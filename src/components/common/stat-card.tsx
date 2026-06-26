import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
}

const TONES: Record<NonNullable<Props["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

export function StatCard({ label, value, icon: Icon, trend, tone = "primary" }: Props) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", TONES[tone])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-bold leading-none">{value}</div>
          {trend && <div className="mt-1 text-xs text-muted-foreground">{trend}</div>}
        </div>
      </CardContent>
    </Card>
  );
}