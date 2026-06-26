import { Link, useRouterState, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, MapPin, Route as RouteIcon, Hospital, Stethoscope,
  HeartPulse, CalendarCheck, BarChart3, FileText, Settings as SettingsIcon,
  Bell, Search, Moon, Sun, Menu, ChevronDown, Building2, LogOut, UserCircle,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
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
  { to: "/travel", label: "Travel Report", icon: RouteIcon }
] as const;

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [org, setOrg] = useState("MediCorp Pharma");
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (phone || password) {
      setLoginError(null);
    }
  }, [phone, password]);

  const handleLogout = () => {
    setLoggedIn(false);
    setPhone("");
    setPassword("");
    setLoginError(null);
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validPhone = "+91 9123456789";
    const validPassword = "password123";

    if (phone === validPhone && password === validPassword) {
      setLoggedIn(true);
      setLoginError(null);
    } else {
      setLoginError("Invalid phone number or password.");
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-card/80 p-8 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <UserCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Admin sign in</h1>
            <p className="mt-2 text-sm text-muted-foreground">Use the dummy credentials to continue.</p>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Phone number</label>
              <Input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 9123456789"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password123"
              />
            </div>
            {loginError ? <p className="text-sm text-destructive">{loginError}</p> : null}
            <Button type="submit" className="w-full">Sign in</Button>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-400">
              <p>Dummy credentials:</p>
              <p className="mt-1 font-semibold text-white">Phone: +91 9123456789</p>
              <p className="font-semibold text-white">Password: password123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
                <DropdownMenuItem className="text-destructive" onSelect={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
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