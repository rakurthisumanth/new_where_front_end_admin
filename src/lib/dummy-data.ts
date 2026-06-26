export type AgentStatus = "checked_in" | "moving" | "idle" | "offline";

export interface Agent {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  manager: string;
  region: string;
  organization: string;
  status: AgentStatus;
  battery: number;
  speed: number;
  lastLocationTime: string;
  distanceToday: number;
  attendance: "present" | "absent" | "late";
  photo: string;
  lat: number;
  lng: number;
  address: string;
  joiningDate: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
}

const FIRST = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai"];
const LAST = ["Sharma", "Verma", "Patel", "Reddy", "Iyer", "Singh", "Kumar", "Gupta", "Nair", "Mehta", "Joshi", "Rao", "Khan", "Chopra", "Malhotra"];
const DESIGNATIONS = ["Field Executive", "Medical Rep", "Sales Officer", "Area Manager", "Territory Lead"];
const DEPARTMENTS = ["Sales", "Marketing", "Field Ops", "Medical"];
const REGIONS = ["North", "South", "East", "West", "Central"];
const ORGS = ["MediCorp Pharma", "HealthBridge Ltd", "ZenoCare"];
const MANAGERS = ["Rahul Bansal", "Neha Kapoor", "Vikram Sethi", "Anita Desai"];
const STATUSES: AgentStatus[] = ["checked_in", "moving", "idle", "offline"];
const ADDRESSES = [
  "MG Road, Bengaluru",
  "Park Street, Kolkata",
  "Connaught Place, New Delhi",
  "Marine Drive, Mumbai",
  "Banjara Hills, Hyderabad",
  "Anna Salai, Chennai",
  "FC Road, Pune",
  "Civil Lines, Jaipur",
];

// Deterministic PRNG so SSR/CSR match
function seeded(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const rng = seeded(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]!;

export const AGENTS: Agent[] = Array.from({ length: 8 }, (_, i) => {
  const first = pick(FIRST);
  const last = pick(LAST);
  const name = `${first} ${last}`;
  // India bbox-ish
  const lat = 12.9 + rng() * 16;
  const lng = 72 + rng() * 16;
  return {
    id: `agt-${1000 + i}`,
    employeeId: `EMP${2000 + i}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@medicorp.in`,
    phone: `+91 9${Math.floor(100000000 + rng() * 899999999)}`,
    designation: pick(DESIGNATIONS),
    department: pick(DEPARTMENTS),
    manager: pick(MANAGERS),
    region: pick(REGIONS),
    organization: pick(ORGS),
    status: pick(STATUSES),
    battery: Math.floor(20 + rng() * 80),
    speed: Math.floor(rng() * 60),
    lastLocationTime: `${Math.floor(rng() * 30)} min ago`,
    distanceToday: +(rng() * 80).toFixed(1),
    attendance: rng() > 0.15 ? "present" : rng() > 0.5 ? "late" : "absent",
    photo: `https://i.pravatar.cc/120?img=${(i % 70) + 1}`,
    lat,
    lng,
    address: pick(ADDRESSES),
    joiningDate: `202${Math.floor(rng() * 4)}-0${1 + Math.floor(rng() * 9)}-1${Math.floor(rng() * 9)}`,
    city: pick(["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune"]),
    state: pick(["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Telangana"]),
    pincode: `${500000 + Math.floor(rng() * 99999)}`,
    emergencyContact: `+91 9${Math.floor(100000000 + rng() * 899999999)}`,
  };
});

export const HOSPITALS = [
  "Apollo Hospital", "Fortis Healthcare", "Manipal Hospital", "Max Super Specialty",
  "AIIMS", "Narayana Health", "Medanta", "Kokilaben Hospital", "Lilavati Hospital",
];

export const DOCTORS = Array.from({ length: 8 }, (_, i) => ({
  id: `doc-${i}`,
  name: `Dr. ${pick(FIRST)} ${pick(LAST)}`,
  specialization: pick(["Cardiology", "Orthopedics", "Pediatrics", "Neurology", "Oncology", "General Medicine", "ENT", "Dermatology"]),
  phone: `+91 9${Math.floor(100000000 + rng() * 899999999)}`,
  hospital: pick(HOSPITALS),
  meetingDate: `2026-06-${10 + (i % 18)}`,
  duration: `${10 + Math.floor(rng() * 40)} min`,
  remarks: pick(["Positive response", "Needs follow-up", "Demo scheduled", "Sample provided"]),
  nextFollowup: `2026-07-${1 + (i % 28)}`,
}));

export const PATIENTS = Array.from({ length: 8 }, (_, i) => ({
  id: `pat-${i}`,
  name: `${pick(FIRST)} ${pick(LAST)}`,
  age: 18 + Math.floor(rng() * 70),
  gender: rng() > 0.5 ? "Male" : "Female",
  disease: pick(["Hypertension", "Diabetes", "Asthma", "Arthritis", "Migraine", "Cardiac"]),
  doctor: DOCTORS[i % DOCTORS.length]!.name,
  hospital: pick(HOSPITALS),
  visitDate: `2026-06-${10 + (i % 18)}`,
  prescriptionUploaded: rng() > 0.3,
  status: pick(["Follow-up", "Completed", "Pending"]),
}));

export const HOSPITAL_VISITS = Array.from({ length: 6 }, (_, i) => ({
  id: `hv-${i}`,
  hospital: pick(HOSPITALS),
  type: pick(["Multi-specialty", "Clinic", "Government", "Specialty"]),
  address: pick(ADDRESSES),
  checkIn: `${9 + (i % 8)}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}`,
  checkOut: `${10 + (i % 8)}:${(i * 11) % 60 < 10 ? "0" : ""}${(i * 11) % 60}`,
  duration: `${20 + Math.floor(rng() * 60)} min`,
  gpsVerified: rng() > 0.2,
  photos: 1 + Math.floor(rng() * 3),
}));

export const RECENT_ACTIVITIES = [
  { id: 1, agent: "Aarav Sharma", action: "checked in at Apollo Hospital", time: "2 min ago", type: "checkin" },
  { id: 2, agent: "Priya Reddy", action: "met Dr. Mehta — Cardiology", time: "12 min ago", type: "meeting" },
  { id: 3, agent: "Rohan Patel", action: "uploaded prescription for patient", time: "20 min ago", type: "upload" },
  { id: 4, agent: "Ananya Iyer", action: "completed visit at Fortis Healthcare", time: "35 min ago", type: "visit" },
  { id: 5, agent: "Vihaan Singh", action: "checked out for the day", time: "1 hr ago", type: "checkout" },
  { id: 6, agent: "Diya Khan", action: "started journey to Manipal Hospital", time: "1 hr ago", type: "travel" },
];

export const TRAVEL_REPORTS = AGENTS.slice(0, 8).map((a, i) => ({
  id: `tr-${i}`,
  agent: a.name,
  employeeId: a.employeeId,
  date: `2026-06-${10 + (i % 18)}`,
  checkIn: "09:1" + (i % 9),
  checkOut: "18:0" + (i % 9),
  distance: +(20 + rng() * 60).toFixed(1),
  travelTime: `${4 + Math.floor(rng() * 5)}h ${Math.floor(rng() * 60)}m`,
  hospitals: 2 + Math.floor(rng() * 6),
  doctors: 1 + Math.floor(rng() * 8),
  patients: 3 + Math.floor(rng() * 15),
  avgSpeed: +(20 + rng() * 25).toFixed(1),
  stops: 3 + Math.floor(rng() * 8),
}));

export const DASHBOARD_STATS = {
  totalAgents: AGENTS.length,
  activeAgents: AGENTS.filter((a) => a.status !== "offline").length,
  inactiveAgents: AGENTS.filter((a) => a.status === "offline").length,
  checkedInToday: AGENTS.filter((a) => a.attendance === "present").length,
  checkedOutToday: 18,
  distanceToday: +AGENTS.reduce((s, a) => s + a.distanceToday, 0).toFixed(0),
  hospitalsVisited: 47,
  doctorsMet: 68,
  patientsCovered: 142,
};

export const ATTENDANCE_CHART = [
  { hour: "9 AM", present: 28, late: 4 },
  { hour: "10 AM", present: 30, late: 2 },
  { hour: "11 AM", present: 32, late: 1 },
  { hour: "12 PM", present: 31, late: 1 },
  { hour: "1 PM", present: 28, late: 0 },
  { hour: "2 PM", present: 30, late: 1 },
  { hour: "3 PM", present: 29, late: 0 },
  { hour: "4 PM", present: 27, late: 0 },
];

export const MONTHLY_DISTANCE = [
  { month: "Jan", distance: 4200 },
  { month: "Feb", distance: 3800 },
  { month: "Mar", distance: 5100 },
  { month: "Apr", distance: 4700 },
  { month: "May", distance: 5600 },
  { month: "Jun", distance: 6200 },
];

export const WEEKLY_ACTIVITY = [
  { day: "Mon", visits: 42, meetings: 28 },
  { day: "Tue", visits: 51, meetings: 35 },
  { day: "Wed", visits: 38, meetings: 24 },
  { day: "Thu", visits: 49, meetings: 31 },
  { day: "Fri", visits: 55, meetings: 40 },
  { day: "Sat", visits: 31, meetings: 18 },
  { day: "Sun", visits: 12, meetings: 6 },
];

export const NOTIFICATIONS = [
  { id: 1, title: "Agent offline alert", body: "Vihaan Singh has been offline > 30 min", time: "5m" },
  { id: 2, title: "New visit logged", body: "Priya Reddy logged a hospital visit", time: "20m" },
  { id: 3, title: "Low battery", body: "Rohan Patel's device at 15%", time: "1h" },
  { id: 4, title: "Daily report ready", body: "Yesterday's travel report is available", time: "3h" },
];