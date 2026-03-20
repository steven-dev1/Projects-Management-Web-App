import RegisterForm from "@/components/Auth/RegisterForm";
import { Suspense } from "react";

export default function SignUp() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
