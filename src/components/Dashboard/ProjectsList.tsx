import { Board } from "@/store/features/boards/BoardsTypes";
import { ProjectCard } from "./ProjectCard";

interface Props {
  boards: Board[];
  emptyMessage?: string;
}

export default function ProjectsList({ boards, emptyMessage = "No hay proyectos" }: Props) {
  if (boards.length === 0) {
    return <p className="text-sm text-zinc-400 text-center py-8">{emptyMessage}</p>;
  }

  return (
    <div className="w-full grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {boards.map((board) => (
        <ProjectCard key={board.id} board={board} />
      ))}
    </div>
  );
}