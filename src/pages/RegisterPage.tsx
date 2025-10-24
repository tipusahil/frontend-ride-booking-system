import Logo from "@/assets/icons/Logo";
import { RegisterForm } from "@/components/modules/authentication/RegisterForm";
import { Link } from "react-router";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-2 md:p-10 ">
        <div className="flex justify-center gap-2   md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="  flex  items-center justify-center rounded-md">
              <Logo className="" />
            </div>
            <h2 className="text-xl md:text-2xl">
              Rider Hero
            </h2>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block rounded-2xl">
        <img
         
          src="/src/assets/images/img1.jpg"
          alt="Image"
          className="absolute  inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
