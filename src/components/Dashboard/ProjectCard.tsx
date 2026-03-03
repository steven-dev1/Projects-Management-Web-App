import { Board } from "@/store/features/boards/BoardsTypes";
import { Divider } from "@heroui/react";
import { ListCheck, Scroll } from "lucide-react";
import Link from "next/link";

export default function ProjectCard({ board }: { board: Board }) {
  const totalCards = board.lists?.reduce((acc, list) => acc + list.cards.length, 0) ?? 0;
  return (
    <Link
      href={`/boards/${board.id}`}
      className="flex flex-col border hover:shadow transition-all duration-150 bg-white border-zinc-200 rounded-lg py-2 px-3 md:p-4"
    >
      <h1 className="text-base md:text-lg font-semibold">{board.name}</h1>
      <p className="text-xs md:text-sm text-zinc-500 truncate">{board.description}</p>
      <Divider className="my-2 md:my-4" />
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 py-1 px-2 rounded-full bg-amber-100 ">
            <Scroll size={16} color="#e17100" />
            <span className="text-xs md:text-sm font-semibold text-amber-600">{board.lists?.length} listas</span>
          </div>
          <Divider orientation="vertical" />
          <div className="flex items-center gap-2 py-1 px-2 rounded-full bg-emerald-100 ">
            <ListCheck size={16} color="#009966" />
            <span className="text-xs md:text-sm font-semibold text-emerald-600">{totalCards} tareas</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
