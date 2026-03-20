import { ShieldX } from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function BoardAccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
        <ShieldX size={36} className="text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Sin acceso</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
        No tienes permiso para ver este tablero o no existe.
      </p>
      <Link href="/dashboard">
        <Button color="primary" variant="flat">
          Volver al dashboard
        </Button>
      </Link>
    </div>
  );
}
