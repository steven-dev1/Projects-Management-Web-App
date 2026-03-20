'use client';
import Link from "next/link";
import { Button } from "@heroui/react";
import { Unlink } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="flex items-center gap-2 mb-12">
        <Unlink color="#006fee" size={28} />
        <span className="text-lg font-semibold">Projects M.</span>
      </Link>

      <p className="text-8xl font-bold text-zinc-200 dark:text-zinc-800 select-none mb-4">
        404
      </p>

      <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
        Página no encontrada
      </h1>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs mb-8">
        La página que buscas no existe o fue movida.
      </p>

      <Link href="/dashboard">
        <Button color="primary" variant="flat">
          Volver al dashboard
        </Button>
      </Link>
    </div>
  );
}