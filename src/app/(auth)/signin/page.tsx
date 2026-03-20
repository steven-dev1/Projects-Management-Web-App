import LoginForm from "@/components/Auth/LoginForm";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
  <Suspense>
    <LoginForm />
  </Suspense>
  );
}
