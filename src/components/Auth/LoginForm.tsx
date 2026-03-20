"use client";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Form, Input, Button } from "@heroui/react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const redirectTo = searchParams.get("redirectTo");
    router.push(redirectTo ?? "/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-300">
            Projects <span className="text-blue-600">M.</span>
          </Link>
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mt-1">Bienvenido de vuelta</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold tracking-tight dark:text-zinc-300 text-zinc-900 mb-6">Iniciar sesión</h1>

          <Form onSubmit={handleLogin} className="flex flex-col gap-4">
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
              autoComplete="password"
              placeholder="••••••••"
              labelPlacement="outside"
              isRequired
              variant="bordered"
              endContent={
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 whitespace-nowrap">
                  ¿Olvidaste tu contraseña?
                </Link>
              }
            />

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-3 rounded-xl">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="flat"
              isLoading={loading}
              className="w-full font-medium mt-1"
              radius="lg"
            >
              Iniciar sesión
            </Button>
          </Form>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Crear cuenta gratis
          </Link>
        </p>
      </div>
    </div>
  );
}