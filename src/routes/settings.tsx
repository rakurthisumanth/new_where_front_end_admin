import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — FieldTrack" }] }),
  component: Settings,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}

function Settings() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <PageHeader title="Settings" description="Organization, tracking and notifications configuration."
        actions={<Button onClick={() => toast.success("Settings saved")}>Save Changes</Button>} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Organization Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization Name"><Input defaultValue="MediCorp Pharma" /></Field>
            <Field label="Industry"><Input defaultValue="Pharmaceuticals" /></Field>
            <Field label="Headquarters"><Input defaultValue="Mumbai, India" /></Field>
            <Field label="Support Email"><Input defaultValue="support@medicorp.in" /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Office Timings</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Start Time"><Input type="time" defaultValue="09:00" /></Field>
            <Field label="End Time"><Input type="time" defaultValue="18:00" /></Field>
            <Field label="Working Days"><Input defaultValue="Mon - Sat" /></Field>
            <Field label="Half Day"><Input defaultValue="Saturday" /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tracking</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Tracking Interval (min)"><Input type="number" defaultValue={5} /></Field>
            <Field label="Location Accuracy"><Input defaultValue="High" /></Field>
            <div className="flex items-center justify-between"><Label>Background Tracking</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Geofence Alerts</Label><Switch defaultChecked /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Attendance Rules</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Late After"><Input type="time" defaultValue="09:15" /></Field>
            <Field label="Half Day After"><Input type="time" defaultValue="11:00" /></Field>
            <div className="flex items-center justify-between"><Label>Auto Check-out</Label><Switch /></div>
            <div className="flex items-center justify-between"><Label>Selfie Required</Label><Switch defaultChecked /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Holiday Settings</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Annual Holidays"><Input type="number" defaultValue={12} /></Field>
            <Field label="Region Holidays"><Input defaultValue="Karnataka, Maharashtra" /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Leave Settings</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Casual Leave"><Input type="number" defaultValue={12} /></Field>
            <Field label="Sick Leave"><Input type="number" defaultValue={10} /></Field>
            <Field label="Earned Leave"><Input type="number" defaultValue={15} /></Field>
            <Field label="Carry Forward"><Input type="number" defaultValue={5} /></Field>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between"><Label>Email — daily report</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Email — agent offline</Label><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><Label>Push — low battery</Label><Switch /></div>
            <div className="flex items-center justify-between"><Label>SMS — late check-in</Label><Switch /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}