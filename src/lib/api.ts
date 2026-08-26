const TOKEN_KEY = "fieldtrack.admin.token";
const USER_KEY = "fieldtrack.admin.user";

export const API_BASE =
  "https://whereismyemployeebackendd.vercel.app/api/v1";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: AdminUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string }).message || "Request failed");
  }
  return data as T;
}

export const adminApi = {
  login(identifier: string, password: string) {
    return api<{ token: string; user: AdminUser; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
  },
  me() {
    return api<{ role: string; user: AdminUser }>("/auth/me");
  },
  dashboard() {
    return api<{
      totalAgents: number;
      activeAgents: number;
      inactiveAgents: number;
      checkedInToday: number;
      checkedOutToday: number;
      distanceToday: number;
    }>("/dashboard/stats");
  },
  employees() {
    return api<import("./dummy-data").Agent[]>("/employees");
  },
  employee(id: string) {
    return api<{
      agent: import("./dummy-data").Agent;
      today: DutySession | null;
      history: DutySession[];
    }>(`/employees/${id}`);
  },
  createEmployee(payload: Record<string, unknown>) {
    return api<import("./dummy-data").Agent>("/employees", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateEmployee(id: string, payload: Record<string, unknown>) {
    return api<import("./dummy-data").Agent>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  disableEmployee(id: string) {
    return api(`/employees/${id}/disable`, { method: "PATCH" });
  },
  deleteEmployee(id: string) {
    return api(`/employees/${id}`, { method: "DELETE" });
  },
  tracking() {
    return api<import("./dummy-data").Agent[]>("/tracking");
  },
  travel(params?: { from?: string; to?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);
    if (params?.search) query.set("search", params.search);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return api<TravelRow[]>(`/reports/travel${suffix}`);
  },
};

export type DutySession = {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string | null;
  totalDistanceKm: number;
  status: "onDuty" | "offDuty";
  locationPoints: Array<{
    id: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    accuracy: number | null;
  }>;
};

export type TravelRow = {
  id: string;
  sessionId: string;
  agent: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  distance: number;
  travelTime: string;
  hospitals: number;
  doctors: number;
  patients: number;
  avgSpeed: number;
  stops: number;
  status: string;
};
