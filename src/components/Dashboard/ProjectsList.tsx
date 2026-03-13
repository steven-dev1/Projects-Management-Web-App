import { Board } from "@/store/features/boards/BoardsTypes";
import { ProjectCard } from "./ProjectCard";

export default function ProjectsList({ boards }: { boards: Board[] }) {
  return (
    <div className="w-full grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {boards.map((board: Board) => (
        <ProjectCard key={board.id} board={board} />
      ))}
    </div>
  );
}
