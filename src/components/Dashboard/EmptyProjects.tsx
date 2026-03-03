import { LayoutDashboard } from "lucide-react";
import ButtonCreateProject from "./ButtonCreateProject";

export default function EmptyProjects() {
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <div className="p-3 bg-purple-100 rounded-full">
        <LayoutDashboard size={32} color="#a742ff" />
      </div>
      <h5 className="font-bold text-xl">Aún no tienes proyectos</h5>
      <p className="text-center">Comienza creando tu primer tablero para organizar tus tareas y proyectos</p>
      <ButtonCreateProject />
    </div>
  );
}
