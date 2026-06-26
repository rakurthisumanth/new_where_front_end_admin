import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export const Route = createFileRoute("/agents/new")({
  head: () => ({ meta: [{ title: "Add Agent — FieldTrack" }] }),
  component: AddAgentPage,
});

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  employeeId: z.string().min(1, "Required"),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  department: z.string().min(1),
  designation: z.string().min(1),
  manager: z.string().min(1),
  joiningDate: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4),
  emergencyContact: z.string().min(10),
});
type Schema = z.infer<typeof schema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function AddAgentPage() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: Schema) => {
    console.log("New agent", data);
    toast.success("Agent created successfully");
    navigate({ to: "/agents" });
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPhoto(URL.createObjectURL(f));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Add Agent"
        description="Create a new field agent profile."
        actions={
          <Button variant="ghost" asChild><Link to="/agents"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Profile Photo</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <Avatar className="h-32 w-32">
              {photo && <AvatarImage src={photo} />}
              <AvatarFallback className="text-2xl">A</AvatarFallback>
            </Avatar>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent">
              <Upload className="h-4 w-4" /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Employee Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name" error={errors.firstName?.message}><Input {...register("firstName")} /></Field>
            <Field label="Last Name" error={errors.lastName?.message}><Input {...register("lastName")} /></Field>
            <Field label="Employee ID" error={errors.employeeId?.message}><Input {...register("employeeId")} /></Field>
            <Field label="Email" error={errors.email?.message}><Input type="email" {...register("email")} /></Field>
            <Field label="Phone" error={errors.phone?.message}><Input {...register("phone")} /></Field>
            <Field label="Password" error={errors.password?.message}><Input type="password" {...register("password")} /></Field>

            <Field label="Department" error={errors.department?.message}>
              <Select onValueChange={(v) => setValue("department", v)} value={watch("department")}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Sales", "Marketing", "Field Ops", "Medical"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Designation" error={errors.designation?.message}><Input {...register("designation")} /></Field>
            <Field label="Manager" error={errors.manager?.message}>
              <Select onValueChange={(v) => setValue("manager", v)} value={watch("manager")}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["Rahul Bansal", "Neha Kapoor", "Vikram Sethi", "Anita Desai"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Joining Date" error={errors.joiningDate?.message}><Input type="date" {...register("joiningDate")} /></Field>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Address & Emergency</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Address" error={errors.address?.message}><Input {...register("address")} /></Field>
          <Field label="City" error={errors.city?.message}><Input {...register("city")} /></Field>
          <Field label="State" error={errors.state?.message}><Input {...register("state")} /></Field>
          <Field label="Pincode" error={errors.pincode?.message}><Input {...register("pincode")} /></Field>
          <Field label="Emergency Contact" error={errors.emergencyContact?.message}><Input {...register("emergencyContact")} /></Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild><Link to="/agents">Cancel</Link></Button>
        <Button type="submit">Save Agent</Button>
      </div>
    </form>
  );
}