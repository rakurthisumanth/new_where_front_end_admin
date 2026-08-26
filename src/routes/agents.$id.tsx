import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { PageLoader } from "@/components/common/empty-state";
import { adminApi } from "@/lib/api";

export const Route = createFileRoute("/agents/$id")({
  head: () => ({ meta: [{ title: "Edit Agent — FieldTrack" }] }),
  component: EditAgentPage,
});

const schema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    joiningDate: z.string().min(1, "Required"),
    address: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    pincode: z.string().min(4, "Required"),
    emergencyContact: z.string().min(10, "Required"),
  })
  .superRefine((data, ctx) => {
    const password = data.password?.trim() ?? "";
    const confirm = data.confirmPassword?.trim() ?? "";
    if (!password && !confirm) return;
    if (password.length > 0 && password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least 6 characters",
        path: ["password"],
      });
    }
    if (password !== confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type Schema = z.infer<typeof schema>;

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PasswordField({
  label,
  error,
  show,
  onToggle,
  ...inputProps
}: {
  label: string;
  error?: string;
  show: boolean;
  onToggle: () => void;
} & React.ComponentProps<typeof Input>) {
  return (
    <Field label={label} error={error}>
      <div className="relative">
        <Input type={show ? "text" : "password"} className="pr-10" {...inputProps} />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: fullName.trim(), lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function toDateInput(value?: string) {
  if (!value) return "";
  // Accept yyyy-mm-dd or ISO / dd-mm-yyyy-ish display strings.
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return "";
}

function EditAgentPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const detail = useQuery({
    queryKey: ["employee", id],
    queryFn: () => adminApi.employee(id),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const agent = detail.data?.agent;
    if (!agent) return;
    const { firstName, lastName } = splitName(agent.name);
    reset({
      firstName,
      lastName,
      phone: agent.phone || "",
      password: "",
      confirmPassword: "",
      joiningDate: toDateInput(agent.joiningDate),
      address: agent.address || "",
      city: agent.city || "",
      state: agent.state || "",
      pincode: agent.pincode || "",
      emergencyContact: agent.emergencyContact || "",
    });
  }, [detail.data, reset]);

  const onSubmit = async (data: Schema) => {
    try {
      const { confirmPassword: _, password, ...rest } = data;
      const payload: Record<string, unknown> = { ...rest };
      if (password?.trim()) payload.password = password.trim();
      await adminApi.updateEmployee(id, payload);
      toast.success("Agent updated successfully");
      navigate({ to: "/agents" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update agent");
    }
  };

  if (detail.isLoading) {
    return (
      <div className="p-4 md:p-6">
        <PageLoader label="Loading agent…" />
      </div>
    );
  }

  if (detail.error || !detail.data?.agent) {
    return (
      <div className="p-8">
        <p>Agent not found.</p>
        <Link to="/agents" className="text-primary underline">
          Back
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Edit Agent"
        description="Update this field agent profile."
        actions={
          <Button variant="ghost" asChild>
            <Link to="/agents">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="First Name" error={errors.firstName?.message}>
            <Input {...register("firstName")} />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <Input {...register("lastName")} />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <Input type="tel" {...register("phone")} />
          </Field>
          <Field label="Joining Date" error={errors.joiningDate?.message}>
            <Input type="date" {...register("joiningDate")} />
          </Field>
          <PasswordField
            label="Password (leave blank to keep current)"
            error={errors.password?.message}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            {...register("password")}
          />
          <PasswordField
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            {...register("confirmPassword")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address & Emergency</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Address" error={errors.address?.message}>
            <Input {...register("address")} />
          </Field>
          <Field label="City" error={errors.city?.message}>
            <Input {...register("city")} />
          </Field>
          <Field label="State" error={errors.state?.message}>
            <Input {...register("state")} />
          </Field>
          <Field label="Pincode" error={errors.pincode?.message}>
            <Input {...register("pincode")} />
          </Field>
          <Field label="Emergency Contact" error={errors.emergencyContact?.message}>
            <Input {...register("emergencyContact")} />
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <Link to="/agents">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
