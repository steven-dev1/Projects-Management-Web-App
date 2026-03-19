"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Form, Input, Button } from "@heroui/react";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-semibold tracking-tight dark:text-zinc-300 text-zinc-900">
            Projects <span className="text-blue-600">M.</span>
          </Link>
          <p className="text-sm dark:text-zinc-500 text-zinc-400 font-medium mt-1">Crea tu cuenta gratis</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold tracking-tight dark:text-zinc-300 text-zinc-900 mb-6">Crear cuenta</h1>

          <Form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              name="fullName"
              type="text"
              label="Nombre completo"
              placeholder="Juan Pérez"
              labelPlacement="outside"
              isRequired
              variant="bordered"
              autoComplete="name"
            />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="tu@email.com"
              labelPlacement="outside"
              isRequired
              variant="bordered"
              autoComplete="email"
            />

            <Input
              name="password"
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              labelPlacement="outside"
              isRequired
              minLength={6}
              variant="bordered"
              autoComplete="password"
            />

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-3 rounded-xl">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              className="w-full font-medium mt-1"
              radius="lg"
              variant="flat"
            >
              Crear cuenta
            </Button>
          </Form>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
