import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordUi from "@/components/ui/PasswordUi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { useRegisterMutation } from "@/redux/features/auth/auth.api";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

// ✅ Zod Schema আপডেট করা হলো (driver হলে vehicle info লাগবে)
const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.email("Enter a valid email."),
    role: z.enum(["admin", "rider", "driver"]),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    // ✅ নতুন ফিল্ড (optional initially)
    vehicleType: z.string().optional(),
    licensePlate: z.string().optional(),
  })
  // ✅ পাসওয়ার্ড ম্যাচ যাচাই
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  })
  // ✅ যদি role === "driver" হয় তাহলে vehicle info required হবে
  .refine(
    (data) => data.role !== "driver" || (data.vehicleType && data.licensePlate), // দুইটা থাকতে হবে
    {
      message: "Vehicle info required for drivers.",
      path: ["vehicleType"],
    }
  );

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [register] = useRegisterMutation();
  const navigate = useNavigate();

  // ✅ form setup
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "rider",
      password: "",
      confirmPassword: "",
      vehicleType: "",
      licensePlate: "",
    },
  });

  // ✅ role এর মান লাইভ দেখার জন্য watch()
  const selectedRole = form.watch("role");

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const userInfo = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      // ✅ শুধুমাত্র driver হলে vehicle info backend এ পাঠানো হবে
      ...(data.role === "driver" && {
        driverInfo: [
          {
            vehicleInfo: {
              licensePlate: data.licensePlate,
            },
          },
        ],
      }),
    };

    try {
      const result = await register(userInfo).unwrap();
if(result.success) {
        toast.success(result?.message || "User created successfully");
      console.log(result);
      navigate("/");
}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch (error:any) {
      console.log(error.data?.message);
      toast.error(error.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className={cn("flex flex-col space-y-3", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create an account
        </p>
      </div>

      <div className="grid gap-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* <SelectItem value="admin">Admin</SelectItem> */}
                      <SelectItem value="rider">Rider</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ⚡ Conditional Vehicle Info Inputs */}
            {selectedRole === "driver" && (
              <>
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Car, Bike, Truck" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Plate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. DHA-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordUi {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordUi {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" className="w-full cursor-pointer">
              Submit
              <Send className="mr-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </div>
  );
}
