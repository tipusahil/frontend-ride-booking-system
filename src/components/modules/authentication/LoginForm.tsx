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
import config from "@/config/env";

import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import z from "zod";

// -------------------
const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "email is required." }) // string type er sate ei (nonempty)ta use kora jai, tai string dilam nahoi email() diyei kaj hoye jai zod er v4 onujai
    .email({ message: "Please enter a valid email address." }),

  password: z
    .string()
    .nonempty({ message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});
// -------------------

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  //  ----------------------start form--------
const [login]= useLoginMutation();
const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // const onSubmit: SubmitHandler<FieldValues> = async (data) => {
  const onSubmit = async (data: z.infer<typeof loginSchema>) => {

    const loginInfo = {
      email: data.email,
      password:data.password,
    }

    try {
      console.log(data);
      const result = await login(loginInfo).unwrap();
     if(result.success) {
        toast.success(result?.message || "User logged successfully");
      console.log(result);
      navigate("/")
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log(error)
      toast.error(error.data?.message || "something went wrong!")
    }
  };
  //  ----------------------end form--------

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        {/* ----------start ---login form ----*/}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* ----------formFIeld for email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------formFiled for login */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to={"/forgot-password"}
                      className="ml-auto text-sm underline-offset-4 hover:underline hover:text-blue-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <FormControl>
                    {/* <Input
                      placeholder="john@example.com"
                      {...field}
                      value={field.value || ""}
                    /> */}
                    <PasswordUi {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-foreground  cursor-pointer"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* ----------end ---login form ----*/}

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          onClick={() => window.open(`${config.baseUrl}/auth/google`, "_self")} // (_self) er jaigai (_blank,_parent, _top) eshob o dewa jai , but ekoi tab e open korte caile (_self)tab tai dite hbe.
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
        >
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          replace
          className="underline underline-offset-4 hover:text-blue-500"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
