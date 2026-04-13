"use client";
import { useRouter } from "next/navigation";
import { Chip } from "@heroui/react";
import { Board, Card } from "@/store/features/boards/BoardsTypes";
import { ClipboardX } from "lucide-react";

interface Props {
  cards: Card[];
  boards: Board[];
}

export default function MyAssignedCards({ cards, boards }: Props) {
  const router = useRouter();

  if (cards.length === 0) {
    return <p className="text-sm text-zinc-400 flex flex-col border p-2 rounded-lg border-zinc-900 items-center gap-2">
      <ClipboardX />
      No tienes tarjetas asignadas.
      </p>;
  }

  const findBoardByCard = (card: Card) =>
    boards.find((b) => b.lists?.some((l) => l.cards?.some((c) => c.id === card.id)));

  return (
    <div className="flex flex-col gap-2">
      {cards.slice(0, 5).map((card) => {
        const board = findBoardByCard(card);
        return (
          <div
            key={card.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 cursor-pointer"
            onClick={() => board && router.push(`/boards/${board.id}`)}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-sm font-medium text-zinc-800 dark:text-zinc-100 dark:hover:text-zinc-400 hover:text-zinc-500 ${card.is_completed ? "line-through" : ""}`}>
                {card.title}
              </span>
              {board && <span className="text-xs text-zinc-400">{board.name}</span>}
            </div>
            <Chip size="sm" variant="flat" color={card.is_completed ? "success" : "default"}>
              {card.is_completed ? "Completada" : "Pendiente"}
            </Chip>
          </div>
        );
      })}
      {cards.length > 5 && (
        <p className="text-xs text-zinc-400 text-center">+{cards.length - 5} más</p>
      )}
    </div>
  );
}