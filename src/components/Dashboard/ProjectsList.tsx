import { Board } from "@/store/features/boards/BoardsTypes";
import { ProjectCard } from "./ProjectCard";

interface Props {
  boards: Board[];
}

export default function ProjectsList({ boards }: Props) {

  return (
    <div className="w-full grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
      {boards.map((board) => (
        <ProjectCard key={board.id} board={board} />
      ))}
    </div>
  );
}
