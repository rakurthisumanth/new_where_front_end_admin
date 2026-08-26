import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { useState } from "react";
import { adminApi } from "@/lib/api";

export const Route = createFileRoute("/agents/new")({
  head: () => ({ meta: [{ title: "Add Agent — FieldTrack" }] }),
  component: AddAgentPage,
});

const schema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    phone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    joiningDate: z.string().min(1, "Required"),
    address: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    pincode: z.string().min(4, "Required"),
    emergencyContact: z.string().min(10, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
        <Input
          type={show ? "text" : "password"}
          className="pr-10"
          {...inputProps}
        />
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

function AddAgentPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Schema) => {
    try {
      const { confirmPassword: _, ...payload } = data;
      await adminApi.createEmployee(payload);
      toast.success("Agent created successfully");
      navigate({ to: "/agents" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create agent");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 md:p-6">
      <PageHeader
        title="Add Agent"
        description="Create a new field agent profile."
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
            <Input type="tel" placeholder="10-digit mobile number" {...register("phone")} />
          </Field>
          <Field label="Joining Date" error={errors.joiningDate?.message}>
            <Input type="date" {...register("joiningDate")} />
          </Field>
          <PasswordField
            label="Password"
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
          {isSubmitting ? "Saving…" : "Save Agent"}
        </Button>
      </div>
    </form>
  );
}
