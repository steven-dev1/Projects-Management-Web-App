import Link from "next/link";

export default function SentEmailPassword() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center flex flex-col gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-xl">✓</span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Revisa tu email</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Te enviamos un link para restablecer tu contraseña.
          </p>
        </div>
        <Link href="/signin" className="text-sm text-blue-600 hover:text-blue-700">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
