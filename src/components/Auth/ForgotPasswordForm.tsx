"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import Link from "next/link";
import { Form, Input, Button } from "@heroui/react";
import SentEmailPassword from "./SentEmailPassword";

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return <SentEmailPassword />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-300">
            Projects <span className="text-blue-600">M.</span>
          </Link>
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mt-1">Recupera tu contraseña</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold tracking-tight dark:text-zinc-300 text-zinc-900 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-6">
            Ingresa tu email y te enviaremos un link para restablecerla.
          </p>

          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-3 rounded-xl">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="flat" isLoading={loading} className="w-full font-medium mt-1" radius="lg">
              Enviar link
            </Button>
          </Form>
        </div>

        <p className="text-center text-xs text-zinc-400 mt-5">
          <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
