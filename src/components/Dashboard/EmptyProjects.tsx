import { LayoutDashboard } from "lucide-react";
import ButtonCreateProject from "./ButtonCreateProject";
import Link from "next/link";

export default function EmptyProjects() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <div className="p-3 bg-purple-100 rounded-full">
        <LayoutDashboard size={32} color="#a742ff" />
      </div>
      <h5 className="font-bold text-xl">Aún no tienes proyectos</h5>
      <p className="text-center w-3/4">Comienza creando tu primer tablero para organizar tus tareas y proyectos o desarchiva los que necesites.</p>
      <div className="flex items-center gap-2">
          <ButtonCreateProject size="md" />
          <Link href="/dashboard/archived" className="dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200  text-sm dark:text-zinc-300 p-3 rounded-xl">
              Ver tableros archivados
          </Link>
        </div>
    </div>
  );
}
