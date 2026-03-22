import { Clock } from "lucide-react";
import React from "react";
import ProjectsList from "./ProjectsList";
import { Board } from "@/store/features/boards/BoardsTypes";

export default function LastActivity({ boards }: { boards: Board[] }) {
  const recentBoards = [...boards]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .filter((board) => new Date(board.updated_at).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 7)
    .slice(0, 3);
  return (
    <section>
      <h3 className="font-semibold flex items-center gap-2 mb-3">
        <Clock size={18} /> Actividad reciente
      </h3>
      {recentBoards.length > 0 && <ProjectsList boards={recentBoards} />}
      {recentBoards.length === 0 && <p className="text-sm text-zinc-400 w-full text-center">No hay actividad reciente</p>}
    </section>
  );
}
