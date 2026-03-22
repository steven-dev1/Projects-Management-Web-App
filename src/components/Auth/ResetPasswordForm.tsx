"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Form, Input, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidSession(true);
      setChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setValidSession(true);
        setChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checking)
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Spinner color="default" size="lg" />
      </div>
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.push("/signin"), 2000);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Contraseña actualizada</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Redirigiendo al inicio de sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Link inválido o expirado</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Solicita un nuevo link de recuperación.</p>
          </div>
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
            Solicitar nuevo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-300">
            Projects <span className="text-blue-600">M.</span>
          </Link>
          <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mt-1">Nueva contraseña</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-semibold tracking-tight dark:text-zinc-300 text-zinc-900 mb-6">
            Restablecer contraseña
          </h1>

          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="new_password"
              type={showNew ? "text" : "password"}
              label="Nueva contraseña"
              placeholder="••••••••"
              labelPlacement="outside"
              isRequired
              minLength={6}
              variant="bordered"
              autoComplete="new-password"
              endContent={
                <button type="button" onClick={() => setShowNew(!showNew)} className="cursor-pointer">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            <Input
              name="confirm_password"
              type={showConfirm ? "text" : "password"}
              label="Confirmar contraseña"
              placeholder="••••••••"
              labelPlacement="outside"
              isRequired
              minLength={6}
              variant="bordered"
              autoComplete="new-password"
              endContent={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="cursor-pointer">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-600 text-xs px-3.5 py-3 rounded-xl">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="flat" isLoading={loading} className="w-full font-medium mt-1" radius="lg">
              Guardar contraseña
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
