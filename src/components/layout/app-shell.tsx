import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, MapPin, Route as RouteIcon, Hospital, Stethoscope,
  HeartPulse, CalendarCheck, BarChart3, FileText, Settings as SettingsIcon,
  Bell, Search, Moon, Sun, Menu, ChevronDown, Building2, LogOut, UserCircle,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NOTIFICATIONS } from "@/lib/dummy-data";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agents", label: "Agent Management", icon: Users },
  { to: "/tracking", label: "Live Tracking", icon: MapPin },
  { to: "/travel", label: "Travel Report", icon: RouteIcon },
  { to: "/hospitals", label: "Hospital Visits", icon: Hospital },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/patients", label: "Patients", icon: HeartPulse },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [org, setOrg] = useState("MediCorp Pharma");

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">FieldTrack</div>
            <div className="truncate text-[11px] text-muted-foreground">Admin Suite</div>
          </div>
        </div>
        <nav className="flex h-[calc(100vh-4rem)] flex-col gap-0.5 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
                <Building2 className="h-4 w-4" />
                <span className="max-w-[160px] truncate">{org}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Switch organization</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["MediCorp Pharma", "HealthBridge Ltd", "ZenoCare"].map((o) => (
                <DropdownMenuItem key={o} onClick={() => setOrg(o)}>{o}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative ml-1 hidden max-w-md flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search agents, hospitals, doctors…" className="pl-9" />
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {NOTIFICATIONS.length}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b p-3 text-sm font-semibold">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="border-b px-3 py-2.5 last:border-0 hover:bg-accent/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium">{n.title}</div>
                        <div className="text-[11px] text-muted-foreground">{n.time}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{n.body}</div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-1.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <div className="text-xs font-semibold leading-tight">Admin User</div>
                    <div className="text-[10px] leading-tight text-muted-foreground">Super Admin</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><UserCircle className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem><SettingsIcon className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    checked_in: "bg-success/15 text-success border-success/30",
    moving: "bg-info/15 text-info border-info/30",
    idle: "bg-warning/15 text-warning border-warning/30",
    offline: "bg-destructive/15 text-destructive border-destructive/30",
    present: "bg-success/15 text-success border-success/30",
    absent: "bg-destructive/15 text-destructive border-destructive/30",
    late: "bg-warning/15 text-warning border-warning/30",
  };
  return (
    <Badge variant="outline" className={cn("border capitalize", map[status] ?? "")}>
      {status.replace("_", " ")}
    </Badge>
  );
}