import { BoardResponse } from "@/store/features/boards/BoardsTypes";
import { Progress } from "@heroui/react";

export default function CardsByList({ board }: { board: BoardResponse }) {
  return (
    <div className="bg-content1 rounded-2xl p-5 shadow-small flex flex-col gap-3">
      <p className="text-sm font-semibold">Por lista</p>
      {board.lists
        .filter((l) => l.status === "active")
        .map((list) => {
          const listTotal = list.cards.length;
          const listDone = list.cards.filter((c) => c.is_completed).length;
          const listRate = listTotal > 0 ? Math.round((listDone / listTotal) * 100) : 0;
          return (
            <div key={list.id} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-default-500">
                <span className="truncate max-w-40">{list.title}</span>
                <span>
                  {listDone}/{listTotal}
                </span>
              </div>
              <Progress value={listRate} size="sm" color="primary" />
            </div>
          );
        })}
      {board.lists.filter((l) => l.status === "active").length === 0 && (
        <p className="text-sm text-default-400 text-center py-4">Sin listas activas</p>
      )}
    </div>
  );
}
